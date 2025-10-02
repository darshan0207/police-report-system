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
import {
  policeStationSchema,
  PoliceStationFormData,
} from "@/lib/schemas/police-station";

interface PoliceStation {
  _id: string;
  name: string;
}

interface StationsTableProps {
  stations: PoliceStation[];
  onUpdated: () => void;
  onDeleted: () => void;
}

export default function StationsTable({
  stations,
  onUpdated,
  onDeleted,
}: StationsTableProps) {
  const [editingPoliceStation, setEditingPoliceStation] =
    useState<PoliceStation | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<PoliceStationFormData>({
    resolver: zodResolver(policeStationSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleEditClick = (policeStation: PoliceStation) => {
    setEditingPoliceStation(policeStation);
    setValue("name", policeStation.name);
    setEditDialogOpen(true);
  };

  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setEditingPoliceStation(null);
    reset();
  };

  const updatePoliceStation = async (data: PoliceStationFormData) => {
    if (!editingPoliceStation) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/police-stations/${editingPoliceStation._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData?.error || `HTTP error! status: ${response.status}`
        );
      }

      handleDialogClose();
      onUpdated();
      toast.success("Police Station updated successfully");
    } catch (error) {
      console.error("Error updating police station:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update police station"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const deletePoliceStation = async (stationId: string) => {
    if (!confirm("Are you sure you want to delete this police station? ")) {
      return;
    }

    try {
      const response = await fetch(`/api/police-stations/${stationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData?.error || `HTTP error! status: ${response.status}`
        );
      }

      onDeleted();
      toast.success("Police station deleted successfully");
    } catch (error) {
      console.error("Error deleting police station:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete police station"
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
          {stations.map((station) => (
            <TableRow key={station._id}>
              <TableCell className="font-medium">{station.name}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Dialog
                    open={
                      editDialogOpen &&
                      editingPoliceStation?._id === station._id
                    }
                    onOpenChange={setEditDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(station)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Police Station</DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={handleSubmit(updatePoliceStation)}
                        className="space-y-4"
                      >
                        <div>
                          <Label
                            htmlFor="editPoliceStationName"
                            className="mb-2"
                          >
                            Police Station Name{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="editPoliceStationName"
                            {...register("name")}
                            placeholder="Enter police station name"
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
                              ? "Updating..."
                              : "Update Police Station"}
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
                    onClick={() => deletePoliceStation(station._id)}
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
      {stations.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No police station created yet
          </h3>
        </div>
      )}

      {stations.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>
                {stations.length} police station
                {stations.length !== 1 ? "s" : ""} total
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
