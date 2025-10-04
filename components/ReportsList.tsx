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
import { PDFDownloadLink } from "@react-pdf/renderer";
import GujaratiPDF from "./GujaratiPDF";
import GujaratiExcel from "./GujaratiExcel";
import { Download, Pencil } from "lucide-react";
import ReportEditForm from "./forms/ReportEditForm";

interface DeploymentRecord {
  _id: string;
  date: string;
  unit: { _id: string; name: string };
  policeStation: { _id: string; name: string };
  dutyType: { _id: string; name: string; code: string };
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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<DeploymentRecord | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const fetchReports = async (date?: string) => {
    setLoading(true);
    try {
      const url = date ? `/api/reports?date=${date}` : "/api/reports";
      const response = await fetch(url);
      const data = await response?.json();
      setReports(data || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchReports(selectedDate);
  }, [selectedDate]);

  return (
    <>
      <div className="space-y-6">
        <div className="flex gap-4 items-center">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-fit"
          />
          <Button type="button" onClick={() => fetchReports(selectedDate)}>
            રિપોર્ટ લોડ કરો
          </Button>
          {reports?.length > 0 && (
            <Button variant="outline">
              <PDFDownloadLink
                document={<GujaratiPDF data={reports} date={selectedDate} />}
                fileName={`દૈનિક_રિપોર્ટ_${selectedDate}.pdf`}
              >
                {({ loading }) =>
                  loading ? "PDF તૈયાર થઈ રહ્યું છે..." : "PDF ડાઉનલોડ કરો"
                }
              </PDFDownloadLink>
            </Button>
          )}
          {reports?.length > 0 && (
            <GujaratiExcel data={reports} date={selectedDate} />
          )}
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
                      <TableHead>
                        દિવસ ફરજ નાં પોલીસ <br /> સ્ટેશનોની કુલ સંખ્યા
                      </TableHead>
                      <TableHead>
                        રાત્રી ફરજ નાં પોલીસ <br />
                        સ્ટેશનોની કુલ સંખ્યા
                      </TableHead>
                      <TableHead>
                        દિવસ ફરજ નાં કુલ <br /> ફોટોગ્રાફો
                      </TableHead>
                      <TableHead>
                        રાત્રી ફરજ નાં કુલ <br />
                        ફોટોગ્રાફો
                      </TableHead>
                      <TableHead>ખરાઈ કરનાર અધિકારીનું નામ</TableHead>
                      <TableHead>નોંધ</TableHead>
                      <TableHead>
                        રિમાક ફરજ ઉપર <br /> હાજર કુલ સંખ્યા
                      </TableHead>
                      <TableHead>એકશન</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report._id}>
                        <TableCell>{report.unit?.name}</TableCell>
                        <TableCell>{report.policeStation?.name}</TableCell>
                        <TableCell>
                          {report.dutyType.code === "day" ? 1 : ""}
                        </TableCell>
                        <TableCell>
                          {report.dutyType.code === "night" ? 1 : ""}
                        </TableCell>
                        <TableCell>
                          {report.dutyType.code === "day" &&
                          report?.images?.length > 0
                            ? report.images.map((image, index) => (
                                <div
                                  key={index}
                                  className="relative group inline-block mr-2"
                                >
                                  <img
                                    src={image}
                                    alt={`image ${index + 1}`}
                                    className="w-12 h-12 object-contain rounded-lg border border-gray-200 transition-transform duration-200 group-hover:scale-105"
                                  />

                                  {/* Download icon overlay */}
                                  <a
                                    href={image}
                                    download={`image_${index + 1}.jpg`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg"
                                  >
                                    <Download className="w-6 h-6 text-white drop-shadow-md" />
                                  </a>
                                </div>
                              ))
                            : ""}
                        </TableCell>
                        <TableCell>
                          {report.dutyType.code === "night" &&
                          report?.images?.length > 0
                            ? report.images.map((image, index) => (
                                <div
                                  key={index}
                                  className="relative group inline-block mr-2"
                                >
                                  <img
                                    src={image}
                                    alt={`image ${index + 1}`}
                                    className="w-12 h-12 object-contain rounded-lg border border-gray-200 transition-transform duration-200 group-hover:scale-105"
                                  />

                                  {/* Download icon overlay */}
                                  <a
                                    href={image}
                                    download={`image_${index + 1}.jpg`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg"
                                  >
                                    <Download className="w-6 h-6 text-white drop-shadow-md" />
                                  </a>
                                </div>
                              ))
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
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingReport(report);
                              setEditDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {editDialogOpen && (
        <ReportEditForm
          editDialogOpen={editDialogOpen}
          setEditDialogOpen={() => {
            setEditDialogOpen(false);
            setEditingReport(null);
            fetchReports(selectedDate);
          }}
          data={editingReport}
        />
      )}
    </>
  );
}
