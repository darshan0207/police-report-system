"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Unit {
  _id: string;
  name: string;
}

interface PoliceStation {
  _id: string;
  name: string;
  unit?: string;
}

interface DutyType {
  _id: string;
  name: string;
}
interface Officer {
  _id: string;
  name: string;
  badgeNumber: string;
  rank: string;
  photo?: string;
  unit?: string;
  policeStation?: string;
  isActive: boolean;
}

interface DeploymentRow {
  unit: string;
  policeStation: string;
  dutyType: string;
  dutyCount: number;
  totalPhotos: number;
  verifyingOfficer: string;
  remarks?: string;
}

export default function ReportForm() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [stations, setStations] = useState<PoliceStation[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [dutyTypes, setDutyTypes] = useState<DutyType[]>([]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [deployments, setDeployments] = useState<DeploymentRow>({
    unit: "",
    policeStation: "",
    dutyType: "",
    dutyCount: 0,
    totalPhotos: 0,
    verifyingOfficer: "",
    remarks: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/units").then((r) => r.json()),
      fetch("/api/police-stations").then((r) => r.json()),
      fetch("/api/duty-type").then((r) => r.json()),
      fetch("/api/officers").then((r) => r.json()),
    ]).then(([u, p, d, o]) => {
      setUnits(u);
      setStations(p);
      setDutyTypes(d);
      setOfficers(o.filter((officer: Officer) => officer.isActive));
    });
  }, []);

  const updateDeployment = (field: keyof DeploymentRow, value: any) => {
    setDeployments((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, deployments }),
      });

      if (response.ok) {
        alert("Report saved successfully!");
        setDeployments({
          unit: "",
          policeStation: "",
          dutyType: "",
          dutyCount: 0,
          totalPhotos: 0,
          verifyingOfficer: "",
          remarks: "",
        });
      } else {
        alert("Error saving report");
      }
    } catch (error) {
      alert("Error saving report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Report Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deployment Records</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border p-4 rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Deployment </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Unit</Label>
                <Select
                  // value={deployment.unit}
                  onValueChange={(value) => updateDeployment("unit", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit._id} value={unit._id}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Police Station</Label>
                <Select
                  // value={deployment.policeStation}
                  onValueChange={(value) =>
                    updateDeployment("policeStation", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Station" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map((station) => (
                      <SelectItem key={station._id} value={station._id}>
                        {station.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Duty Type</Label>
                <Select
                  // value={deployment.unit}
                  onValueChange={(value) => updateDeployment("dutyType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Duty Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {dutyTypes.map((dutyType) => (
                      <SelectItem key={dutyType._id} value={dutyType._id}>
                        {dutyType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <div>
                <Label>Duty</Label>
                <Input
                  type="number"
                  // value={deployment.dayDutyMale}
                  onChange={(e) =>
                    updateDeployment(
                      "dutyCount",
                      Number.parseInt(e.target.value) || 0
                    )
                  }
                />
              </div>
              <div>
                <Label>Total Photos</Label>
                <Input
                  type="number"
                  // value={deployment.dayTotalPhotos}
                  onChange={(e) =>
                    updateDeployment(
                      "totalPhotos",
                      Number.parseInt(e.target.value) || 0
                    )
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>Verifying Officer</Label>
                <Select
                  // value={deployment.verifyingOfficer}
                  onValueChange={(value) =>
                    updateDeployment("verifyingOfficer", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Verifying Officer" />
                  </SelectTrigger>
                  <SelectContent>
                    {officers.map((officer) => (
                      <SelectItem key={officer._id} value={officer._id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={officer.photo || "/placeholder.svg"}
                              alt={officer.name}
                            />
                            <AvatarFallback className="text-xs">
                              {officer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{officer.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {officer.rank} - {officer.badgeNumber}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Remarks</Label>
              <Textarea
                // value={deployment.remarks || ""}
                onChange={(e) => updateDeployment("remarks", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle>Daily Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(summary).map(
              ([key, value]) =>
                key !== "remarks" && (
                  <div key={key}>
                    <Label className="capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </Label>
                    <Input
                      type="number"
                      value={value as number}
                      onChange={(e) =>
                        setSummary((prev) => ({
                          ...prev,
                          [key]: Number.parseInt(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                )
            )}
          </div>
          <div className="mt-4">
            <Label>Remarks</Label>
            <Textarea
              value={summary.remarks}
              onChange={(e) =>
                setSummary((prev) => ({ ...prev, remarks: e.target.value }))
              }
            />
          </div>
        </CardContent>
      </Card> */}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Saving..." : "Save Daily Report"}
      </Button>
    </form>
  );
}
