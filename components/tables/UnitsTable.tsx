"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { unitSchema, UnitFormData } from "@/lib/schemas/unit";

interface Unit {
  _id: string;
  name: string;
  type: string;
}

interface UnitsTableProps {
  units: Unit[];
  onUpdated: () => void;
  onDeleted: () => void;
}

export default function UnitsTable({
  units,
  onUpdated,
  onDeleted,
}: UnitsTableProps) {
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      name: "",
      type: "",
    },
  });

  const handleEditClick = (unit: Unit) => {
    setEditingUnit(unit);
    setValue("name", unit.name);
    setValue("type", unit.type || "");
    setEditDialogOpen(true);
  };

  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setEditingUnit(null);
    reset();
  };

  const updateUnit = async (data: UnitFormData) => {
    if (!editingUnit) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/units/${editingUnit._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData?.error || `HTTP error! status: ${response.status}`
        );
      }

      handleDialogClose();
      onUpdated();
      toast.success("યુનિટ સફળતાપૂર્વક અપડેટ થયું");
    } catch (error) {
      console.error("Error updating unit:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update unit"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUnit = async (unitId: string) => {
    if (!confirm("શું તમે ખરેખર આ યુનિટ કાઢી નાખવા માંગો છો??")) {
      return;
    }

    try {
      const response = await fetch(`/api/units/${unitId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData?.error || `HTTP error! status: ${response.status}`
        );
      }

      onDeleted();
      toast.success("યુનિટ સફળતાપૂર્વક કાઢી નાખ્યું");
    } catch (error) {
      console.error("Error deleting unit:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete unit"
      );
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>યુનિટનું નામ</TableHead>
            <TableHead>યુનિટનો પ્રકાર</TableHead>
            <TableHead className="w-32">એકશનસ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {units.map((unit) => (
            <TableRow key={unit._id}>
              <TableCell className="font-medium">{unit.name}</TableCell>
              <TableCell>{unit.type || "-"}</TableCell>
              <TableCell>
                <div className="flex">
                  <Dialog
                    open={editDialogOpen && editingUnit?._id === unit._id}
                    onOpenChange={setEditDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(unit)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>એડિટ યુનિટ</DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={handleSubmit(updateUnit)}
                        className="space-y-4"
                      >
                        <div>
                          <Label htmlFor="editUnitName" className="mb-2">
                            યુનિટનું નામ <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="editUnitName"
                            {...register("name")}
                            placeholder="યુનિટનું નામ દાખલ કરો"
                            className={errors.name ? "border-red-500" : ""}
                          />
                          {errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.name.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="editUnitType" className="mb-2">
                            યુનિટનો પ્રકાર{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="editUnitType"
                            {...register("type")}
                            placeholder="યુનિટનો પ્રકાર દાખલ કરો"
                            className={errors.type ? "border-red-500" : ""}
                          />
                          {errors.type && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.type.message}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button type="submit" disabled={isLoading}>
                            {isLoading
                              ? "અપડેટ કરી રહ્યું છે..."
                              : "અપડેટ યુનિટ"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleDialogClose}
                            disabled={isLoading}
                          >
                            રદ કરો
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  {/* <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteUnit(unit._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button> */}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {units.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            હજુ સુધી કોઈ યુનિટ બનાવ્યા નથી
          </h3>
        </div>
      )}

      {units.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>કુલ {units.length} યુનિટ</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
