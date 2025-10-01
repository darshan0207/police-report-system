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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DeploymentRecord {
  _id: string;
  date: string;
  unit: { name: string };
  policeStation: { name: string };
  dayDutyMale: number;
  dayDutyFemale: number;
  nightDutyMale: number;
  nightDutyFemale: number;
  dayTotalPhotos: number;
  nightTotalPhotos: number;
  verifyingOfficer: {
    _id: string;
    name: string;
    badgeNumber: string;
    rank: string;
    photo?: string;
  };
}

// interface DailySummary {
//   _id: string;
//   date: string;
//   totalAvailable: number;
//   totalOnDuty: number;
//   lawOrderDuty: number;
//   vipDuty: number;
//   railwayDuty: number;
//   trafficDuty: number;
//   otherDuty: number;
//   courtDuty: number;
//   onLeave: number;
// }

export default function ReportsList() {
  const [reports, setReports] = useState<DeploymentRecord[]>([]);
  // const [summary, setSummary] = useState<DailySummary | null>(null);
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [loading, setLoading] = useState(false);

  const fetchReports = async (date?: string) => {
    setLoading(true);
    try {
      const url = date ? `/api/reports?date=${date}` : "/api/reports";
      const response = await fetch(url);
      const data = await response.json();
      setReports(data.deployments || []);
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

      {/* {summary && (
        <Card>
          <CardHeader>
            <CardTitle>
              Daily Summary - {new Date(selectedDate).toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="font-medium">Total Available</div>
                <div className="text-2xl font-bold">
                  {summary.totalAvailable}
                </div>
              </div>
              <div>
                <div className="font-medium">Total On Duty</div>
                <div className="text-2xl font-bold">{summary.totalOnDuty}</div>
              </div>
              <div>
                <div className="font-medium">Law & Order</div>
                <div className="text-2xl font-bold">{summary.lawOrderDuty}</div>
              </div>
              <div>
                <div className="font-medium">VIP Duty</div>
                <div className="text-2xl font-bold">{summary.vipDuty}</div>
              </div>
              <div>
                <div className="font-medium">Railway Duty</div>
                <div className="text-2xl font-bold">{summary.railwayDuty}</div>
              </div>
              <div>
                <div className="font-medium">Traffic Duty</div>
                <div className="text-2xl font-bold">{summary.trafficDuty}</div>
              </div>
              <div>
                <div className="font-medium">Court Duty</div>
                <div className="text-2xl font-bold">{summary.courtDuty}</div>
              </div>
              <div>
                <div className="font-medium">On Leave</div>
                <div className="text-2xl font-bold">{summary.onLeave}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )} */}

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
                    <TableHead>Unit</TableHead>
                    <TableHead>Police Station</TableHead>
                    <TableHead>Day Male</TableHead>
                    <TableHead>Day Female</TableHead>
                    <TableHead>Night Male</TableHead>
                    <TableHead>Night Female</TableHead>
                    <TableHead>Day Photos</TableHead>
                    <TableHead>Night Photos</TableHead>
                    <TableHead>Verifying Officer</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report._id}>
                      <TableCell>{report.unit?.name}</TableCell>
                      <TableCell>{report.policeStation?.name}</TableCell>
                      <TableCell>{report.dayDutyMale}</TableCell>
                      <TableCell>{report.dayDutyFemale}</TableCell>
                      <TableCell>{report.nightDutyMale}</TableCell>
                      <TableCell>{report.nightDutyFemale}</TableCell>
                      <TableCell>{report.dayTotalPhotos}</TableCell>
                      <TableCell>{report.nightTotalPhotos}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={
                                report.verifyingOfficer?.photo ||
                                "/placeholder.svg"
                              }
                              alt={report.verifyingOfficer?.name || "Officer"}
                            />
                            <AvatarFallback className="text-xs">
                              {report.verifyingOfficer?.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase() || "NA"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">
                              {report.verifyingOfficer?.name || "N/A"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {report.verifyingOfficer?.rank} -{" "}
                              {report.verifyingOfficer?.badgeNumber}
                            </span>
                          </div>
                        </div>
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
  );
}
