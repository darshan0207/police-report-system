"use client";

import { useState } from "react";
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
import { Pencil, Trash2, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DutyType {
  _id: string;
  name: string;
  description?: string;
}

interface DutyTypesTableProps {
  dutyTypes: DutyType[];
  onDutyTypeUpdated: () => void;
  onDutyTypeDeleted: () => void;
}

export default function DutyTypesTable({
  dutyTypes,
  onDutyTypeUpdated,
  onDutyTypeDeleted,
}: DutyTypesTableProps) {
  const [editingDutyType, setEditingDutyType] = useState<DutyType | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const updateDutyType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDutyType) return;

    setUpdateLoading(true);
    try {
      const response = await fetch(`/api/duty-type/${editingDutyType._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingDutyType.name,
          description: editingDutyType.description,
        }),
      });

      if (response.ok) {
        setEditingDutyType(null);
        setEditDialogOpen(false);
        onDutyTypeUpdated();
        toast({
          title: "Success",
          description: "Duty type updated successfully",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to update duty type",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating duty type:", error);
      toast({
        title: "Error",
        description: "Failed to update duty type",
        variant: "destructive",
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  const deleteDutyType = async (dutyTypeId: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete the duty type "${name}"? This action will also remove all associated units, police stations, and officers. This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeleteLoading(dutyTypeId);
    try {
      const response = await fetch(`/api/duty-type/${dutyTypeId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDutyTypeDeleted();
        toast({
          title: "Success",
          description: "Duty Type deleted successfully",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to delete duty type",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting duty type:", error);
      toast({
        title: "Error",
        description: "Failed to delete duty type",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Duty Type</TableHead>
            <TableHead className="w-40">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dutyTypes.map((dutyType) => (
            <TableRow key={dutyType._id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{dutyType.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2 ">
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
                        onClick={() => {
                          setEditingDutyType(dutyType);
                          setEditDialogOpen(true);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-3 w-3" />
                        <span className="sr-only">Edit duty type</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Duty Type</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={updateDutyType} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="editDutyTypeName">
                            Duty Type <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="editDutyTypeName"
                            value={editingDutyType?.name || ""}
                            onChange={(e) =>
                              setEditingDutyType((prev) =>
                                prev ? { ...prev, name: e.target.value } : null
                              )
                            }
                            placeholder="Enter duty type"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="editDutyTypeDesc">Description</Label>
                          <Input
                            id="editDutyTypeDesc"
                            value={editingDutyType?.description || ""}
                            onChange={(e) =>
                              setEditingDutyType((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      description: e.target.value,
                                    }
                                  : null
                              )
                            }
                            placeholder="Enter duty type description (optional)"
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button
                            type="submit"
                            disabled={updateLoading}
                            className="flex-1"
                          >
                            {updateLoading ? "Updating..." : "Update Duty Type"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setEditingDutyType(null);
                              setEditDialogOpen(false);
                            }}
                            disabled={updateLoading}
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
                    onClick={() => deleteDutyType(dutyType._id, dutyType.name)}
                    disabled={deleteLoading === dutyType._id}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {deleteLoading === dutyType._id ? (
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                    <span className="sr-only">Delete duty type</span>
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
            No duty types created yet
          </h3>
        </div>
      )}

      {dutyTypes.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>
                {dutyTypes.length} duty types{dutyTypes.length !== 1 ? "s" : ""}{" "}
                total
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
