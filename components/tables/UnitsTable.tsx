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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Unit {
  _id: string;
  name: string;
  type?: string;
}

interface UnitsTableProps {
  units: Unit[];
  onUnitUpdated: () => void;
  onUnitDeleted: () => void;
}

export default function UnitsTable({
  units,
  onUnitUpdated,
  onUnitDeleted,
}: UnitsTableProps) {
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const updateUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUnit) return;

    try {
      const response = await fetch(`/api/units/${editingUnit._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingUnit.name,
          type: editingUnit.type,
        }),
      });

      if (response.ok) {
        setEditingUnit(null);
        setEditDialogOpen(false);
        onUnitUpdated();
        toast({
          title: "Success",
          description: "Unit updated successfully",
        });
      }
    } catch (error) {
      console.error("Error updating unit:", error);
      toast({
        title: "Error",
        description: "Failed to update unit",
        variant: "destructive",
      });
    }
  };

  const deleteUnit = async (unitId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this unit? This will also delete all associated police stations."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/units/${unitId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onUnitDeleted();
        toast({
          title: "Success",
          description: "Unit deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting unit:", error);
      toast({
        title: "Error",
        description: "Failed to delete unit",
        variant: "destructive",
      });
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
                        onClick={() => {
                          setEditingUnit(unit);
                          setEditDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Unit</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={updateUnit} className="space-y-4">
                        <div>
                          <Label htmlFor="editUnitName">Unit Name</Label>
                          <Input
                            id="editUnitName"
                            value={editingUnit?.name || ""}
                            onChange={(e) =>
                              setEditingUnit((prev) =>
                                prev ? { ...prev, name: e.target.value } : null
                              )
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="editUnitType">Type</Label>
                          <Input
                            id="editUnitType"
                            value={editingUnit?.type || ""}
                            onChange={(e) =>
                              setEditingUnit((prev) =>
                                prev ? { ...prev, type: e.target.value } : null
                              )
                            }
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button type="submit">Update Unit</Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setEditingUnit(null);
                              setEditDialogOpen(false);
                            }}
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
