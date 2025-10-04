"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OfficersTable from "./tables/OfficersTable";
import OfficerForm from "./forms/OfficerForm";
import { toast } from "sonner";
interface Officer {
  _id: string;
  name: string;
  isActive: boolean;
}

export default function OfficersTab() {
  const [officers, setOfficers] = useState<Officer[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const stationsRes = await fetch("/api/officers");
      setOfficers(await stationsRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>નવો અધિકારી ઉમેરો</CardTitle>
        </CardHeader>
        <CardContent>
          <OfficerForm onCreated={fetchData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>અધિકારીની યાદી</CardTitle>
        </CardHeader>
        <CardContent>
          <OfficersTable
            officers={officers}
            onUpdated={fetchData}
            onDeleted={fetchData}
          />
        </CardContent>
      </Card>
    </div>
  );
}
