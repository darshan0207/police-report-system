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
      toast.success("ફરજનો પ્રકાર સફળતાપૂર્વક અપડેટ થયું");
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
    if (!confirm("શું તમે ખરેખર આ ફરજનો પ્રકાર કાઢી નાખવા માંગો છો? ")) {
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
      toast.success("ફરજનો પ્રકાર સફળતાપૂર્વક કાઢી નાખ્યું");
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
            <TableHead>ફરજનો પ્રકાર</TableHead>
            <TableHead className="w-32">એકશનસ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dutyTypes.map((dutyType) => (
            <TableRow key={dutyType._id}>
              <TableCell className="font-medium">{dutyType.name}</TableCell>
              <TableCell>
                <div className="flex">
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
                        <DialogTitle>એડિટ ફરજનો પ્રકાર</DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={handleSubmit(updateDutyType)}
                        className="space-y-4"
                      >
                        <div>
                          <Label htmlFor="editDutyType" className="mb-2">
                            ફરજનો પ્રકાર <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="editDutyType"
                            {...register("name")}
                            placeholder="ફરજનો પ્રકાર દાખલ કરો"
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
                            {isLoading
                              ? "અપડેટ કરી રહ્યું છે..."
                              : "અપડેટ ફરજનો પ્રકાર"}
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
                    onClick={() => deletePoliceStation(dutyType._id)}
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
      {dutyTypes.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            હજુ સુધી કોઈ ફરજનો પ્રકાર બનાવ્યા નથી
          </h3>
        </div>
      )}

      {dutyTypes.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>કુલ {dutyTypes.length} ફરજનો પ્રકાર</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
