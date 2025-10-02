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
import { officerSchema, OfficerFormData } from "@/lib/schemas/officer";

interface Officer {
  _id: string;
  name: string;
  isActive: boolean;
}
interface OfficersTableProps {
  officers: Officer[];
  onUpdated: () => void;
  onDeleted: () => void;
}

export default function OfficersTable({
  officers,
  onUpdated,
  onDeleted,
}: OfficersTableProps) {
  const [editingOfficer, setEditingOfficer] = useState<Officer | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<OfficerFormData>({
    resolver: zodResolver(officerSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleEditClick = (officer: Officer) => {
    setEditingOfficer(officer);
    setValue("name", officer.name);
    setEditDialogOpen(true);
  };

  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setEditingOfficer(null);
    reset();
  };

  const updateOfficer = async (data: OfficerFormData) => {
    if (!editingOfficer) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/officers/${editingOfficer._id}`, {
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
      toast.success("Officer updated successfully");
    } catch (error) {
      console.error("Error updating officer:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update officer"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const deletePoliceStation = async (stationId: string) => {
    if (!confirm("Are you sure you want to delete this officer? ")) {
      return;
    }

    try {
      const response = await fetch(`/api/officers/${stationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData?.error || `HTTP error! status: ${response.status}`
        );
      }

      onDeleted();
      toast.success("Officer deleted successfully");
    } catch (error) {
      console.error("Error deleting officer:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete officer"
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
          {officers.map((officer) => (
            <TableRow key={officer._id}>
              <TableCell className="font-medium">{officer.name}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Dialog
                    open={editDialogOpen && editingOfficer?._id === officer._id}
                    onOpenChange={setEditDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(officer)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Officer</DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={handleSubmit(updateOfficer)}
                        className="space-y-4"
                      >
                        <div>
                          <Label
                            htmlFor="editPoliceStationName"
                            className="mb-2"
                          >
                            Officer Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="editPoliceStationName"
                            {...register("name")}
                            placeholder="Enter officer name"
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
                            {isLoading ? "Updating..." : "Update Officer"}
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
                    onClick={() => deletePoliceStation(officer._id)}
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
      {officers.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No officer created yet
          </h3>
        </div>
      )}

      {officers.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>
                {officers.length} officer
                {officers.length !== 1 ? "s" : ""} total
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
