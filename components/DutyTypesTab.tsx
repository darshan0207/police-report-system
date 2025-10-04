"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DutyTypesTable from "./tables/DutyTypesTable";
import DutyTypeForm from "./forms/DutyTypeForm";
import { toast } from "sonner";
interface DutyType {
  _id: string;
  name: string;
}

export default function DutyTypesTab() {
  const [dutyTypes, setDutyTypes] = useState<DutyType[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const dutyTypesRes = await fetch("/api/duty-type");
      setDutyTypes(await dutyTypesRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>નવો ફરજનો પ્રકાર ઉમેરો</CardTitle>
        </CardHeader>
        <CardContent>
          <DutyTypeForm onCreated={fetchData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ફરજના પ્રકારોની યાદી</CardTitle>
        </CardHeader>
        <CardContent>
          <DutyTypesTable
            dutyTypes={dutyTypes}
            onUpdated={fetchData}
            onDeleted={fetchData}
          />
        </CardContent>
      </Card>
    </div>
  );
}
