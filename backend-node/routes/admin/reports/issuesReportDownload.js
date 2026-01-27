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

// ✅ Helper: get filtered issues based on period, month, search, status
const getFilteredIssues = async (
  period = "daily",
  month = "",
  search = "",
  status = ""
) => {
  const connection = await mysql.createConnection(dbConfig);

  let sql = `
    SELECT id, issue_type, status, location_text, full_name, created_at
    FROM report_issues
    WHERE 1=1
  `;
  const params = [];

  // ✅ PERIOD FILTER
  if (period === "daily") {
    sql += ` AND DATE(created_at) = CURDATE() `;
  } else if (period === "weekly") {
    sql += ` AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) `;
  } else if (period === "monthly") {
    if (month) {
      // ✅ month must be YYYY-MM
      sql += ` AND DATE_FORMAT(created_at, '%Y-%m') = ? `;
      params.push(month);
    } else {
      // fallback current month
      sql += ` AND DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m') `;
    }
  } else if (period === "all") {
    // ✅ no date filter, return all records
  } else {
    // fallback today
    sql += ` AND DATE(created_at) = CURDATE() `;
  }

  // ✅ SEARCH FILTER
  if (search) {
    sql += ` AND (
      issue_type LIKE ? OR
      location_text LIKE ? OR
      full_name LIKE ?
    ) `;
    const like = `%${search}%`;
    params.push(like, like, like);
  }

  // ✅ STATUS FILTER
  if (status) {
    sql += ` AND status = ? `;
    params.push(status);
  }

  sql += ` ORDER BY created_at DESC `;

  const [rows] = await connection.execute(sql, params);
  await connection.end();

  return rows;
};

// ✅ GET /api/admin/reports/issues/download?period=all|daily|weekly|monthly&month=YYYY-MM&status=...&search=...&format=pdf|excel
router.get("/download", async (req, res) => {
  const {
    period = "daily",
    month = "",
    search = "",
    status = "",
    format = "pdf",
  } = req.query;

  try {
    const issues = await getFilteredIssues(period, month, search, status);

    // ✅ filename
    const today = new Date().toISOString().split("T")[0];
    let fileSuffix = period;

    if (period === "monthly" && month) {
      fileSuffix = `month_${month}`;
    }

    // ✅ EXCEL DOWNLOAD
    if (format === "excel") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Issues Report");

      worksheet.columns = [
        { header: "S.No", key: "sno", width: 8 },
        { header: "ID", key: "id", width: 10 },
        { header: "Issue Type", key: "issue_type", width: 18 },
        { header: "Status", key: "status", width: 14 },
        { header: "Area", key: "location_text", width: 35 },
        { header: "Reported At", key: "created_at", width: 22 },
      ];

      issues.forEach((issue, index) => {
        worksheet.addRow({
          sno: index + 1,
          id: issue.id,
          issue_type: issue.issue_type,
          status: issue.status,
          location_text: issue.location_text,
          created_at: issue.created_at,
        });
      });

      // ✅ header styling
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE5E7EB" },
      };

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="issues_report_${fileSuffix}_${today}.xlsx"`
      );

      await workbook.xlsx.write(res);
      return res.end();
    }

    // ✅ PDF DOWNLOAD
    const doc = new PDFDocument({ margin: 30, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="issues_report_${fileSuffix}_${today}.pdf"`
    );

    doc.pipe(res);

    doc.fontSize(18).text("Issues Report", { align: "center" });
    doc.moveDown(0.5);

    doc.fontSize(10).text(`Generated: ${new Date().toLocaleString("en-IN")}`, {
      align: "center",
    });

    doc
      .fontSize(10)
      .text(
        `Period: ${period.toUpperCase()}${
          period === "monthly" && month ? ` (${month})` : ""
        } | Status: ${status || "All"} | Search: ${search || "None"}`,
        { align: "center" }
      );

    doc.moveDown(1);

    doc.fontSize(11).text(`Total Records: ${issues.length}`, {
      align: "left",
    });

    doc.moveDown(0.5);

    // ✅ table header
    doc.fontSize(10).text("S.No | ID | Type | Status | Area | Date", {
      underline: true,
    });

    doc.moveDown(0.4);

    // ✅ table rows
    issues.forEach((issue, index) => {
      const area =
        issue.location_text && issue.location_text.length > 18
          ? issue.location_text.substring(0, 18) + "..."
          : issue.location_text || "-";

      const dateText = issue.created_at
        ? new Date(issue.created_at).toLocaleString("en-IN")
        : "-";

      doc.fontSize(9).text(
        `${index + 1} | ${issue.id} | ${issue.issue_type} | ${
          issue.status
        } | ${area} | ${dateText}`
      );
    });

    doc.end();
  } catch (err) {
    console.error("DOWNLOAD REPORT ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error generating report" });
  }
});

module.exports = router;
