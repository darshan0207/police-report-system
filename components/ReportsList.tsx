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
  console.log(`/api/reports/pdf/${selectedDate}`);
  const downloadPDF = () => {
    if (!selectedDate) return;
    window.open(`/api/reports/pdf/${selectedDate}`, "_blank");
  };
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
        <Button onClick={() => fetchReports(selectedDate)}>Load Reports</Button>
        <Button onClick={downloadPDF} variant="outline">
          Download PDF
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Deployment Records</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : reports.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No reports found for selected date
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ડિવિઝન / યુનિટ</TableHead>
                    <TableHead>પોલીસ સ્ટેશન</TableHead>
                    <TableHead>
                      દિવસ ફરજ નાં પોલીસ <br /> સ્ટેશનોની કુલ સંખ્યા
                    </TableHead>
                    <TableHead>
                      રાત્રી ફરજ નાં પોલીસ <br />
                      સ્ટેશનોની કુલ સંખ્યા
                    </TableHead>
                    <TableHead>
                      દિવસ ફરજ નાં કુલ <br /> ફોટોગ્રાફોની સંખ્યા
                    </TableHead>
                    <TableHead>
                      રાત્રી ફરજ નાં કુલ <br />
                      ફોટોગ્રાફોની સંખ્યા
                    </TableHead>
                    <TableHead>
                      ખરાઈ કરનાર <br /> અધિકારીનું નામ
                    </TableHead>
                    <TableHead>
                      પોલીસ સ્ટેશનની હાજરી મુજબ <br /> ફોટોગ્રાફ ન મળેલ હોય તો{" "}
                      <br />
                      કરેલ કાર્યવાહી ની વિગત
                    </TableHead>
                    <TableHead>
                      રિમાક ફરજ ઉપર <br /> હાજર કુલ સંખ્યા
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report._id}>
                      <TableCell>{report.unit?.name}</TableCell>
                      <TableCell>{report.policeStation?.name}</TableCell>
                      <TableCell>
                        {report.dutyType?.name == "Day" ? 1 : ""}
                      </TableCell>
                      <TableCell>
                        {report.dutyType?.name == "Night" ? 1 : ""}
                      </TableCell>

                      <TableCell>
                        {report.dutyType?.name == "Day"
                          ? report.images?.length
                          : ""}
                      </TableCell>
                      <TableCell>
                        {report.dutyType?.name == "Night"
                          ? report.images?.length
                          : ""}
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
