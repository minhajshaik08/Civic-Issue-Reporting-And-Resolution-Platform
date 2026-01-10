// routes/middle-admin/reports/issuesDownload.js
const express = require("express");
const mysql = require("mysql2/promise");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const router = express.Router();

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Chandana@1435",
  database: "civicreport",
};

// Helper: get filtered issues based on period, search, status
const getFilteredIssues = async (period = "daily", search = "", status = "") => {
  let days = 1;
  if (period === "weekly") days = 7;
  if (period === "monthly") days = 30;

  const connection = await mysql.createConnection(dbConfig);

  let sql =
    "SELECT * FROM report_issues WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)";
  const params = [days];

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
  await connection.end();

  return rows;
};

// GET /api/middle-admin/reports/issues/download?period=...&status=...&search=...&format=pdf|excel
router.get("/download", async (req, res) => {
  const { period = "daily", search = "", status = "", format = "pdf" } =
    req.query;

  try {
    const issues = await getFilteredIssues(period, search, status);

    if (format === "excel") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Issues Report");

      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Issue Type", key: "issue_type", width: 15 },
        { header: "Status", key: "status", width: 15 },
        { header: "Area", key: "location_text", width: 30 },
        { header: "Reported At", key: "created_at", width: 25 },
      ];

      issues.forEach((issue) => {
        worksheet.addRow({
          id: issue.id,
          issue_type: issue.issue_type,
          status: issue.status,
          location_text: issue.location_text,
          created_at: issue.created_at,
        });
      });

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
        `attachment; filename="issues_report_${new Date()
          .toISOString()
          .split("T")[0]}.xlsx"`
      );

      await workbook.xlsx.write(res);
      res.end();
    } else {
      const doc = new PDFDocument();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="issues_report_${new Date()
          .toISOString()
          .split("T")[0]}.pdf"`
      );

      doc.pipe(res);

      doc.fontSize(16).text("Issues Report", { align: "center" });
      doc.fontSize(10).text(`Generated: ${new Date().toLocaleString()}`, {
        align: "center",
      });
      doc.text(`Period: ${period} | Status: ${status || "All"}\n`, {
        align: "center",
      });

      doc.fontSize(10).text("ID | Type | Status | Area | Date", {
        underline: true,
      });

      issues.forEach((issue) => {
        doc
          .fontSize(8)
          .text(
            `${issue.id} | ${issue.issue_type} | ${issue.status} | ${issue.location_text.substring(
              0,
              20
            )}... | ${issue.created_at}`
          );
      });

      doc.end();
    }
  } catch (err) {
    console.error("MIDDLE-ADMIN DOWNLOAD REPORT ERROR:", err);
    res
      .status(500)
      .json({ success: false, message: "Error generating report" });
  }
});

module.exports = router;
