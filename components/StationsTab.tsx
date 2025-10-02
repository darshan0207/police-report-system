"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StationForm from "./forms/StationForm";
import StationsTable from "./tables/StationsTable";
import { toast } from "sonner";
interface PoliceStation {
  _id: string;
  name: string;
}

export default function StationsTab() {
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
      toast.error("Failed to fetch data");
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Police Station</CardTitle>
        </CardHeader>
        <CardContent>
          <StationForm onCreated={fetchData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Police Station List</CardTitle>
        </CardHeader>
        <CardContent>
          <StationsTable
            stations={stations}
            onUpdated={fetchData}
            onDeleted={fetchData}
          />
        </CardContent>
      </Card>
    </div>
  );
}
