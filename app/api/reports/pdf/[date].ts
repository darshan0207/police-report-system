import type { NextApiRequest, NextApiResponse } from "next";
import PDFDocument from "pdfkit";

// Optional: fetch data from DB
async function getReportData(date: string) {
  // Replace with your DB query or service call
  return {
    date,
    totalCases: 42,
    officersOnDuty: ["abc", "xyz", "789"],
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { date } = req.query;
  if (!date || typeof date !== "string") {
    res.status(400).json({ error: "Date is required" });
    return;
  }

  const reportData = await getReportData(date);

  // Set headers so browser downloads the file
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=daily-report-${date}.pdf`
  );

  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(res);

  doc.fontSize(20).text("Daily Police Report", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Date: ${reportData.date}`);
  doc.text(`Total Cases: ${reportData.totalCases}`);
  doc.moveDown();
  doc.text("Officers on Duty:");
  reportData.officersOnDuty.forEach((o) => doc.text(`• ${o}`));

  doc.end();
}
