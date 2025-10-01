"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import StationForm from "./forms/StationForm";
import StationsTable from "./tables/StationsTable";
interface Unit {
  _id: string;
  name: string;
  type?: string;
}

interface PoliceStation {
  _id: string;
  name: string;
  unit?: { _id: string; name: string };
  address?: string;
}

interface StationsTabProps {
  units: Unit[];
}

export default function StationsTab({ units }: StationsTabProps) {
  const [newStation, setNewStation] = useState({
    name: "",
    unit: "",
    address: "",
  });

  const [stations, setStations] = useState<PoliceStation[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const stationsRes = await fetch("/api/police-stations");
      setStations(await stationsRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    }
  };

  const createStation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/police-stations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStation),
      });

      if (response.ok) {
        setNewStation({ name: "", unit: "", address: "" });
        fetchData();
        toast({
          title: "Success",
          description: "Police station created successfully",
        });
      }
    } catch (error) {
      console.error("Error creating station:", error);
      toast({
        title: "Error",
        description: "Failed to create police station",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Police Station</CardTitle>
        </CardHeader>
        <CardContent>
          <StationForm
            station={newStation}
            units={units}
            onSubmit={createStation}
            onChange={setNewStation}
            submitText="Add Police Station"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Police Stations</CardTitle>
        </CardHeader>
        <CardContent>
          <StationsTable
            stations={stations}
            units={units}
            onStationUpdated={fetchData}
            onStationDeleted={fetchData}
          />
        </CardContent>
      </Card>
    </div>
  );
}
