"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import DutyTypesTable from "./tables/DutyTypesTable";
import DutyTypeForm from "./forms/DutyTypeForm";
interface DutyType {
  _id: string;
  name: string;
  description?: string;
}

export default function DutyTypesTab() {
  const [newDutyType, setNewDutyType] = useState({ name: "", description: "" });

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
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    }
  };

  const createDutyType = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/duty-type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDutyType),
      });

      if (response.ok) {
        setNewDutyType({ name: "", description: "" });
        fetchData();
        toast({
          title: "Success",
          description: "Duty Type created successfully",
        });
      }
    } catch (error) {
      console.error("Error creating duty type:", error);
      toast({
        title: "Error",
        description: "Failed to create duty type",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Duty Type</CardTitle>
        </CardHeader>
        <CardContent>
          <DutyTypeForm
            dutyType={newDutyType}
            onSubmit={createDutyType}
            onChange={setNewDutyType}
            submitText="Add Duty Type"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Duty Types</CardTitle>
        </CardHeader>
        <CardContent>
          <DutyTypesTable
            dutyTypes={dutyTypes}
            onDutyTypeUpdated={fetchData}
            onDutyTypeDeleted={fetchData}
          />
        </CardContent>
      </Card>
    </div>
  );
}
