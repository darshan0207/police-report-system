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
      toast.success("Unit updated successfully");
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
    if (!confirm("Are you sure you want to delete this unit?")) {
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
      toast.success("Unit deleted successfully");
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
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {units.map((unit) => (
            <TableRow key={unit._id}>
              <TableCell className="font-medium">{unit.name}</TableCell>
              <TableCell>{unit.type || "-"}</TableCell>
              <TableCell>
                <div className="flex gap-2">
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
                        <DialogTitle>Edit Unit</DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={handleSubmit(updateUnit)}
                        className="space-y-4"
                      >
                        <div>
                          <Label htmlFor="editUnitName" className="mb-2">
                            Unit Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="editUnitName"
                            {...register("name")}
                            placeholder="Enter unit name"
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
                            Type <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="editUnitType"
                            {...register("type")}
                            placeholder="Enter unit type"
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
                            {isLoading ? "Updating..." : "Update Unit"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleDialogClose}
                            disabled={isLoading}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteUnit(unit._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {units.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No units created yet
          </h3>
        </div>
      )}

      {units.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>
                {units.length} unit{units.length !== 1 ? "s" : ""} total
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
