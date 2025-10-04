"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import NotoSansGujarati from "@/lib/fonts/NotoSansGujarati-normal";
interface DeploymentRecord {
  _id: string;
  date: string;
  unit: { name: string };
  policeStation: { name: string };
  dutyType: { name: string };
  dutyCount: number;
  verifyingOfficer: {
    _id: string;
    name: string;
  };
  remarks: string;
  images: string[];
}

export default function ReportsList() {
  const [reports, setReports] = useState<DeploymentRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [loading, setLoading] = useState(false);

  const fetchReports = async (date?: string) => {
    setLoading(true);
    try {
      const url = date ? `/api/reports?date=${date}` : "/api/reports";
      const response = await fetch(url);
      const data = await response?.json();
      setReports(data || []);
      // setSummary(data.summary);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchReports(selectedDate);
  }, [selectedDate]);

  const generatePDF = () => {
    const doc = new jsPDF();

    // ✅ Gujarati font register
    doc.addFileToVFS("NotoSansGujarati.ttf", NotoSansGujarati);
    doc.addFont("NotoSansGujarati.ttf", "NotoSansGujarati", "normal");
    doc.setFont("NotoSansGujarati");

    // ✅ Gujarati headers
    const head = [["ક્રમ", "પોલીસ સ્ટેશન", "હાજર હોમગાડઝ", "અધિકારી", "ફોટા"]];

    // ✅ Gujarati sample body (you can map reports here)
    const body = [
      ["ક્રમ", "પોલીસ સ્ટેશન", "હાજર હોમગાડઝ", "અધિકારી", "ફોટા"],
      ["૧", "ઉમરા પોલીસ સ્ટેશન", "૩", "મૈરુ યા", "૭"],
      ["૨", "મસીટ પોલીસ સ્ટેશન", "૧", "મૈરુ યા", "૩"],
      ["૩", "લસકાણા પોલીસ સ્ટેશન", "૧", "વિજય રાઠોડ", "૭"],
    ];

    autoTable(doc, {
      head: [["", "", "", "", ""]], // blank headers
      body,
      startY: 20,
      styles: {
        font: "NotoSansGujarati", // Body font Gujarati
        fontSize: 12,
        halign: "center",
      },
      theme: "grid",
      didDrawPage: () => {
        doc.setFont("NotoSansGujarati");
        doc.setFontSize(12);
        doc.text("ક્રમ", 15, 28);
        doc.text("પોલીસ સ્ટેશન", 40, 28);
        doc.text("હાજર હોમગાડઝ", 100, 28);
        doc.text("અધિકારી", 150, 28);
        doc.text("ફોટા", 180, 28);
      },
    });

    doc.save("Gujarati-Table.pdf");
  };
  // const downloadPDF = () => {
  //   if (!selectedDate) return;
  //   window.open(`/api/reports/pdf/${selectedDate}`, "_blank");
  // };
  console.log("reports", reports);
  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-fit"
        />
        <Button onClick={() => fetchReports(selectedDate)}>
          રિપોર્ટ લોડ કરો
        </Button>
        <Button onClick={() => generatePDF()} variant="outline">
          PDF ડાઉનલોડ કરો
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>રેકોર્ડ્સ</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">લોડ કરી રહ્યું છે...</div>
          ) : reports.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              પસંદ કરેલી તારીખ માટે કોઈ રિપોર્ટ મળ્યો નથી
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ડિવિ / યુનિટ</TableHead>
                    <TableHead>પોલીસ સ્ટેશન</TableHead>
                    <TableHead>ફરજ</TableHead>
                    <TableHead>ફોટો</TableHead>
                    <TableHead>અધિકારીનું નામ</TableHead>
                    <TableHead>રિમાકસ</TableHead>
                    <TableHead>કુલ સંખ્યા</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report._id}>
                      <TableCell>{report.unit?.name}</TableCell>
                      <TableCell>{report.policeStation?.name}</TableCell>
                      <TableCell>{report.dutyType.name}</TableCell>
                      <TableCell>
                        {report.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`image ${index + 1}`}
                              className="w-full h-24 object-contain rounded-lg"
                            />
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">
                              {report.verifyingOfficer?.name || "N/A"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{report.remarks}</TableCell>
                      <TableCell>{report.dutyCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
