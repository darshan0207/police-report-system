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
      toast.success("પોલીસ સ્ટેશન સફળતાપૂર્વક અપડેટ થયું");
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
    if (!confirm("શું તમે ખરેખર આ પોલીસ સ્ટેશન કાઢી નાખવા માંગો છો? ")) {
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
      toast.success("પોલીસ સ્ટેશન સફળતાપૂર્વક કાઢી નાખ્યું");
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
            <TableHead>પોલીસ સ્ટેશનનું નામ</TableHead>
            <TableHead className="w-32">એકશનસ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stations.map((station) => (
            <TableRow key={station._id}>
              <TableCell className="font-medium">{station.name}</TableCell>
              <TableCell>
                <div className="flex">
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
                        <DialogTitle>એડિટ પોલીસ સ્ટેશન</DialogTitle>
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
                            પોલીસ સ્ટેશનનું નામ{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="editPoliceStationName"
                            {...register("name")}
                            placeholder="પોલીસ સ્ટેશનનું નામ દાખલ કરો"
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
                              : "અપડેટ પોલીસ સ્ટેશન"}
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
                    onClick={() => deletePoliceStation(station._id)}
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
      {stations.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            હજુ સુધી કોઈ પોલીસ સ્ટેશન બનાવ્યા નથી
          </h3>
        </div>
      )}

      {stations.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>કુલ {stations.length} પોલીસ સ્ટેશન</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
