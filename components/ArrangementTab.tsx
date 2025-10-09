"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ArrangementForm from "./forms/ArrangementForm";
import ArrangementsTable from "./tables/ArrangementsTable";
interface Arrangement {
  _id: string;
  name: string;
}

export default function ArrangementTab() {
  const [arrangements, setArrangements] = useState<Arrangement[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const arrangementsRes = await fetch("/api/arrangements");
      setArrangements(await arrangementsRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>નવો બંદોબસ્ત ઉમેરો</CardTitle>
        </CardHeader>
        <CardContent>
          <ArrangementForm onCreated={fetchData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>બંદોબસ્તની યાદી</CardTitle>
        </CardHeader>
        <CardContent>
          <ArrangementsTable
            arrangements={arrangements}
            onUpdated={fetchData}
            onDeleted={fetchData}
          />
        </CardContent>
      </Card>
    </div>
  );
}
