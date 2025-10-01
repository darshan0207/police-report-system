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
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Unit {
  _id: string;
  name: string;
}

interface PoliceStation {
  _id: string;
  name: string;
  unit?: { _id: string; name: string };
  address?: string;
}

interface StationsTableProps {
  stations: PoliceStation[];
  units: Unit[];
  onStationUpdated: () => void;
  onStationDeleted: () => void;
}

export default function StationsTable({
  stations,
  units,
  onStationUpdated,
  onStationDeleted,
}: StationsTableProps) {
  const [editingStation, setEditingStation] = useState<PoliceStation | null>(
    null
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const updateStation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStation) return;

    try {
      const response = await fetch(
        `/api/police-stations/${editingStation._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editingStation.name,
            unit: editingStation.unit?._id || null,
            address: editingStation.address,
          }),
        }
      );

      if (response.ok) {
        setEditingStation(null);
        setEditDialogOpen(false);
        onStationUpdated();
        toast({
          title: "Success",
          description: "Police station updated successfully",
        });
      }
    } catch (error) {
      console.error("Error updating station:", error);
      toast({
        title: "Error",
        description: "Failed to update police station",
        variant: "destructive",
      });
    }
  };

  const deleteStation = async (stationId: string) => {
    if (!confirm("Are you sure you want to delete this police station?")) {
      return;
    }

    try {
      const response = await fetch(`/api/police-stations/${stationId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onStationDeleted();
        toast({
          title: "Success",
          description: "Police station deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting station:", error);
      toast({
        title: "Error",
        description: "Failed to delete police station",
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
            <TableHead>Unit</TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stations.map((station) => (
            <TableRow key={station._id}>
              <TableCell className="font-medium">{station.name}</TableCell>
              <TableCell>{station.unit?.name || "-"}</TableCell>
              <TableCell className="max-w-xs truncate">
                {station.address || "-"}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Dialog
                    open={editDialogOpen && editingStation?._id === station._id}
                    onOpenChange={setEditDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingStation(station);
                          setEditDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Police Station</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={updateStation} className="space-y-4">
                        <div>
                          <Label htmlFor="editStationName">Station Name</Label>
                          <Input
                            id="editStationName"
                            value={editingStation?.name || ""}
                            onChange={(e) =>
                              setEditingStation((prev) =>
                                prev ? { ...prev, name: e.target.value } : null
                              )
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label>Unit (Optional)</Label>
                          <Select
                            value={editingStation?.unit?._id || ""}
                            onValueChange={(value) => {
                              const selectedUnit = units.find(
                                (u) => u._id === value
                              );
                              if (editingStation) {
                                setEditingStation({
                                  ...editingStation,
                                  unit: selectedUnit
                                    ? {
                                        _id: selectedUnit._id,
                                        name: selectedUnit.name,
                                      }
                                    : undefined,
                                });
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              {units.map((unit) => (
                                <SelectItem key={unit._id} value={unit._id}>
                                  {unit.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="editStationAddress">Address</Label>
                          <Input
                            id="editStationAddress"
                            value={editingStation?.address || ""}
                            onChange={(e) =>
                              setEditingStation((prev) =>
                                prev
                                  ? { ...prev, address: e.target.value }
                                  : null
                              )
                            }
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button type="submit">Update Station</Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setEditingStation(null);
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
                    onClick={() => deleteStation(station._id)}
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
        <div className="text-center py-8 text-muted-foreground">
          No police stations found. Create your first police station above.
        </div>
      )}
    </>
  );
}
