"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import UnitForm from "./forms/UnitForm";
import UnitsTable from "./tables/UnitsTable";

interface Unit {
  _id: string;
  name: string;
  type?: string;
}

interface UnitsTabProps {
  units: Unit[];
  onUnitCreated: () => void;
  onUnitUpdated: () => void;
  onUnitDeleted: () => void;
}

export default function UnitsTab({
  units,
  onUnitCreated,
  onUnitUpdated,
  onUnitDeleted,
}: UnitsTabProps) {
  const [newUnit, setNewUnit] = useState({ name: "", type: "" });

  const createUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/units", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUnit),
      });

      if (response.ok) {
        setNewUnit({ name: "", type: "" });
        onUnitCreated();
        toast({
          title: "Success",
          description: "Unit created successfully",
        });
      }
    } catch (error) {
      console.error("Error creating unit:", error);
      toast({
        title: "Error",
        description: "Failed to create unit",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Unit</CardTitle>
        </CardHeader>
        <CardContent>
          <UnitForm
            unit={newUnit}
            onSubmit={createUnit}
            onChange={setNewUnit}
            submitText="Add Unit"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Units</CardTitle>
        </CardHeader>
        <CardContent>
          <UnitsTable
            units={units}
            onUnitUpdated={onUnitUpdated}
            onUnitDeleted={onUnitDeleted}
          />
        </CardContent>
      </Card>
    </div>
  );
}
