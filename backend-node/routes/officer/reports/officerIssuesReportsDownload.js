const express = require("express");
const mysql = require("mysql2/promise");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const pool = require("../../../config/database");
const router = express.Router();

// Helper: get filtered issues for officer (only their assigned issues)
const getFilteredIssuesForOfficer = async (
  officer_id,
  period = "daily",
  search = "",
  status = ""
) => {
  let days = 1;
  if (period === "weekly") days = 7;
  if (period === "monthly") days = 30;

  const connection = await pool.getConnection();

  let sql =
    "SELECT * FROM report_issues WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)";
  const params = [days];

  // constraint: only issues assigned to this officer
  sql += " AND assigned_officer_id = ?";
  params.push(officer_id);

  if (search) {
    sql +=
      " AND (issue_type LIKE ? OR location_text LIKE ? OR full_name LIKE ?)";
    const like = `%${search}%`;
    params.push(like, like, like);
  }

  if (status) {
    sql += " AND status = ?";
    params.push(status);
  }

  sql += " ORDER BY created_at DESC";

  const [rows] = await connection.execute(sql, params);
  connection.release();

  return rows;
};

// GET /api/officer/reports/issues/download?period=...&status=...&search=...&officer_id=...&format=pdf|excel
router.get("/issues/download", async (req, res) => {
  const {
    period = "daily",
    search = "",
    status = "",
    officer_id,
    format = "pdf",
  } = req.query;

  if (!officer_id) {
    return res
      .status(400)
      .json({ success: false, message: "officer_id is required" });
  }

  try {
    const issues = await getFilteredIssuesForOfficer(
      officer_id,
      period,
      search,
      status
    );

    if (format === "excel") {
      // Generate Excel
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("My Issues Report");

      // Add headers
      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Issue Type", key: "issue_type", width: 15 },
        { header: "Status", key: "status", width: 15 },
        { header: "Area", key: "location_text", width: 30 },
        { header: "Reported At", key: "created_at", width: 25 },
      ];

      // Add rows
      issues.forEach((issue) => {
        worksheet.addRow({
          id: issue.id,
          issue_type: issue.issue_type,
          status: issue.status,
          location_text: issue.location_text,
          created_at: issue.created_at,
        });
      });

      // Set header styling
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD3D3D3" },
      };

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="my_assigned_issues_${new Date()
          .toISOString()
          .split("T")[0]}.xlsx"`
      );

      await workbook.xlsx.write(res);
      res.end();
    } else {
      // Generate PDF
      const doc = new PDFDocument();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="my_assigned_issues_${new Date()
          .toISOString()
          .split("T")[0]}.pdf"`
      );

      doc.pipe(res);

      doc.fontSize(16).text("My Assigned Issues Report", { align: "center" });
      doc.fontSize(10).text(`Generated: ${new Date().toLocaleString()}`, {
        align: "center",
      });
      doc.text(`Period: ${period} | Status: ${status || "All"}\n`, {
        align: "center",
      });

      // Table headers
      doc
        .fontSize(10)
        .text("ID | Type | Status | Area | Date", { underline: true });

      // Table rows
      issues.forEach((issue) => {
        doc.fontSize(8).text(
          `${issue.id} | ${issue.issue_type} | ${issue.status} | ${issue.location_text.substring(
            0,
            20
          )}... | ${issue.created_at}`
        );
      });

      doc.end();
    }
  } catch (err) {
    console.error("OFFICER DOWNLOAD REPORT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Error generating report",
    });
  }
});

module.exports = router;
