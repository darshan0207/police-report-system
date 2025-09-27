"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, FileTextIcon, PrinterIcon } from "lucide-react";

interface SummaryData {
  date: string;
  zoneWiseSummary: {
    [zoneName: string]: {
      dayDuty: number;
      nightDuty: number;
      dayPhotos: number;
      nightPhotos: number;
      totalPersonnel: number;
      units: {
        [unitName: string]: {
          dayDuty: number;
          nightDuty: number;
          dayPhotos: number;
          nightPhotos: number;
          stations: Array<{
            name: string;
            dayDuty: number;
            nightDuty: number;
            dayPhotos: number;
            nightPhotos: number;
            verifyingOfficer: string;
          }>;
        };
      };
    };
  };
  grandTotals: {
    dayDuty: number;
    nightDuty: number;
    dayPhotos: number;
    nightPhotos: number;
    totalPersonnel: number;
    vipDuty: number;
    trafficDuty: number;
    railwayDuty: number;
    otherDuty: number;
    onLeave: number;
    courtDuty: number;
    longTermAbsent: number;
    shortTermAbsent: number;
  };
  personnelAllocation: {
    staffOfficers: number;
    malePersonnel: number;
    femalePersonnel: number;
    total: number;
  };
}

export default function SummaryReport() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSummaryData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reports/summary?date=${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        setSummaryData(data);
      }
    } catch (error) {
      console.error("Error fetching summary data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaryData();
  }, [selectedDate]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading summary report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileTextIcon className="h-5 w-5" />
            Daily Summary Report - દૈનિક સારાંશ રિપોર્ટ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="date">Date / તારીખ:</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
            </div>
            <Button onClick={fetchSummaryData} disabled={loading}>
              <CalendarIcon className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button onClick={handlePrint} variant="outline">
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </CardContent>
      </Card>

      {summaryData && (
        <>
          {/* Personnel Allocation Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Personnel Allocation - કર્મચારી ફાળવણી</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {summaryData.personnelAllocation.staffOfficers}
                  </div>
                  <div className="text-sm text-gray-600">Staff Officers</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {summaryData.personnelAllocation.malePersonnel}
                  </div>
                  <div className="text-sm text-gray-600">Male Personnel</div>
                </div>
                <div className="text-center p-4 bg-pink-50 rounded-lg">
                  <div className="text-2xl font-bold text-pink-600">
                    {summaryData.personnelAllocation.femalePersonnel}
                  </div>
                  <div className="text-sm text-gray-600">Female Personnel</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {summaryData.personnelAllocation.total}
                  </div>
                  <div className="text-sm text-gray-600">Total Personnel</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Zone-wise Summary Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                Zone-wise Deployment Summary - ઝોન મુજબ તૈનાતી સારાંશ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">
                        Zone
                        <br />
                        ઝોન
                      </TableHead>
                      <TableHead className="text-center">
                        Day Duty
                        <br />
                        દિવસ ફરજ
                      </TableHead>
                      <TableHead className="text-center">
                        Night Duty
                        <br />
                        રાત્રી ફરજ
                      </TableHead>
                      <TableHead className="text-center">
                        Day Photos
                        <br />
                        દિવસ ફોટો
                      </TableHead>
                      <TableHead className="text-center">
                        Night Photos
                        <br />
                        રાત્રી ફોટો
                      </TableHead>
                      <TableHead className="text-center">
                        Total
                        <br />
                        કુલ
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(summaryData.zoneWiseSummary).map(
                      ([zoneName, zoneData]) => (
                        <TableRow key={zoneName}>
                          <TableCell className="font-medium">
                            <Badge variant="outline">{zoneName}</Badge>
                          </TableCell>
                          <TableCell className="text-center font-mono">
                            {zoneData.dayDuty}
                          </TableCell>
                          <TableCell className="text-center font-mono">
                            {zoneData.nightDuty}
                          </TableCell>
                          <TableCell className="text-center font-mono">
                            {zoneData.dayPhotos}
                          </TableCell>
                          <TableCell className="text-center font-mono">
                            {zoneData.nightPhotos}
                          </TableCell>
                          <TableCell className="text-center font-mono font-bold">
                            {zoneData.totalPersonnel}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                    {/* Grand Total Row */}
                    <TableRow className="bg-gray-50 font-bold">
                      <TableCell>GRAND TOTAL / કુલ યોગ</TableCell>
                      <TableCell className="text-center font-mono">
                        {summaryData.grandTotals.dayDuty}
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        {summaryData.grandTotals.nightDuty}
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        {summaryData.grandTotals.dayPhotos}
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        {summaryData.grandTotals.nightPhotos}
                      </TableCell>
                      <TableCell className="text-center font-mono text-lg">
                        {summaryData.grandTotals.totalPersonnel}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Duty Type Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Duty Type Breakdown - ફરજ પ્રકાર વિભાજન</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-xl font-bold">
                    {summaryData.grandTotals.dayDuty +
                      summaryData.grandTotals.nightDuty}
                  </div>
                  <div className="text-sm text-gray-600">
                    Day/Night Duty
                    <br />
                    દિવસ/રાત્રી ફરજ
                  </div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-xl font-bold">
                    {summaryData.grandTotals.vipDuty}
                  </div>
                  <div className="text-sm text-gray-600">
                    VIP Duty
                    <br />
                    વી.આઈ.પી ફરજ
                  </div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-xl font-bold">
                    {summaryData.grandTotals.trafficDuty}
                  </div>
                  <div className="text-sm text-gray-600">
                    Traffic Duty
                    <br />
                    ટ્રાફિક ફરજ
                  </div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-xl font-bold">
                    {summaryData.grandTotals.railwayDuty}
                  </div>
                  <div className="text-sm text-gray-600">
                    Railway Duty
                    <br />
                    રેલવે ફરજ
                  </div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-xl font-bold">
                    {summaryData.grandTotals.otherDuty}
                  </div>
                  <div className="text-sm text-gray-600">
                    Other Duty
                    <br />
                    અન્ય ફરજ
                  </div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-xl font-bold">
                    {summaryData.grandTotals.courtDuty}
                  </div>
                  <div className="text-sm text-gray-600">
                    Court Duty
                    <br />
                    કોર્ટ ફરજ
                  </div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-xl font-bold">
                    {summaryData.grandTotals.onLeave}
                  </div>
                  <div className="text-sm text-gray-600">
                    On Leave
                    <br />
                    રજા પર
                  </div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-xl font-bold">
                    {summaryData.grandTotals.longTermAbsent +
                      summaryData.grandTotals.shortTermAbsent}
                  </div>
                  <div className="text-sm text-gray-600">
                    Absent
                    <br />
                    ગેરહાજર
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Zone Breakdown */}
          {Object.entries(summaryData.zoneWiseSummary).map(
            ([zoneName, zoneData]) => (
              <Card key={zoneName}>
                <CardHeader>
                  <CardTitle>Zone {zoneName} - Detailed Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(zoneData.units).map(
                      ([unitName, unitData]) => (
                        <div key={unitName} className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2">
                            Unit: {unitName}
                          </h4>
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Police Station</TableHead>
                                  <TableHead className="text-center">
                                    Day Duty
                                  </TableHead>
                                  <TableHead className="text-center">
                                    Night Duty
                                  </TableHead>
                                  <TableHead className="text-center">
                                    Day Photos
                                  </TableHead>
                                  <TableHead className="text-center">
                                    Night Photos
                                  </TableHead>
                                  <TableHead>Verifying Officer</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {unitData.stations.map((station, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{station.name}</TableCell>
                                    <TableCell className="text-center font-mono">
                                      {station.dayDuty}
                                    </TableCell>
                                    <TableCell className="text-center font-mono">
                                      {station.nightDuty}
                                    </TableCell>
                                    <TableCell className="text-center font-mono">
                                      {station.dayPhotos}
                                    </TableCell>
                                    <TableCell className="text-center font-mono">
                                      {station.nightPhotos}
                                    </TableCell>
                                    <TableCell>
                                      {station.verifyingOfficer}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </>
      )}
    </div>
  );
}
