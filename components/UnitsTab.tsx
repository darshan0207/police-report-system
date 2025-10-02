"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UnitForm from "./forms/UnitForm";
import UnitsTable from "./tables/UnitsTable";
import { toast } from "sonner";

interface Unit {
  _id: string;
  name: string;
  type: string;
}

export default function UnitsTab() {
  const [units, setUnits] = useState<Unit[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const unitsRes = await fetch("/api/units");

      setUnits(await unitsRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Unit</CardTitle>
        </CardHeader>
        <CardContent>
          <UnitForm onCreated={fetchData} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Unit List</CardTitle>
        </CardHeader>
        <CardContent>
          <UnitsTable
            units={units}
            onUpdated={fetchData}
            onDeleted={fetchData}
          />
        </CardContent>
      </Card>
    </div>
  );
}
