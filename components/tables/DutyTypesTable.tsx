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
import { dutyTypeSchema, DutyTypeFormData } from "@/lib/schemas/duty-type";

interface DutyType {
  _id: string;
  name: string;
}

interface DutyTypesTableProps {
  dutyTypes: DutyType[];
  onUpdated: () => void;
  onDeleted: () => void;
}

export default function DutyTypesTable({
  dutyTypes,
  onUpdated,
  onDeleted,
}: DutyTypesTableProps) {
  const [editingDutyType, setEditingDutyType] = useState<DutyType | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<DutyTypeFormData>({
    resolver: zodResolver(dutyTypeSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleEditClick = (dutyType: DutyType) => {
    setEditingDutyType(dutyType);
    setValue("name", dutyType.name);
    setEditDialogOpen(true);
  };

  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setEditingDutyType(null);
    reset();
  };

  const updateDutyType = async (data: DutyTypeFormData) => {
    if (!editingDutyType) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/duty-type/${editingDutyType._id}`, {
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
      toast.success("Duty Type updated successfully");
    } catch (error) {
      console.error("Error updating duty type:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update duty type"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const deletePoliceStation = async (stationId: string) => {
    if (!confirm("Are you sure you want to delete this duty type? ")) {
      return;
    }

    try {
      const response = await fetch(`/api/duty-type/${stationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData?.error || `HTTP error! status: ${response.status}`
        );
      }

      onDeleted();
      toast.success("Duty type deleted successfully");
    } catch (error) {
      console.error("Error deleting duty type:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete duty type"
      );
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dutyTypes.map((dutyType) => (
            <TableRow key={dutyType._id}>
              <TableCell className="font-medium">{dutyType.name}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Dialog
                    open={
                      editDialogOpen && editingDutyType?._id === dutyType._id
                    }
                    onOpenChange={setEditDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(dutyType)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Duty Type</DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={handleSubmit(updateDutyType)}
                        className="space-y-4"
                      >
                        <div>
                          <Label htmlFor="editDutyType" className="mb-2">
                            Duty Type <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="editDutyType"
                            {...register("name")}
                            placeholder="Enter duty type"
                            className={errors.name ? "border-red-500" : ""}
                          />
                          {errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.name.message}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Updating..." : "Update Duty Type"}
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
                    onClick={() => deletePoliceStation(dutyType._id)}
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
      {dutyTypes.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No duty type created yet
          </h3>
        </div>
      )}

      {dutyTypes.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>
                {dutyTypes.length} duty type
                {dutyTypes.length !== 1 ? "s" : ""} total
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
