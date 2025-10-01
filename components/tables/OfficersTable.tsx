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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Pencil, Trash2, User, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Unit {
  _id: string;
  name: string;
}

interface PoliceStation {
  _id: string;
  name: string;
}

interface Officer {
  _id: string;
  name: string;
  badgeNumber: string;
  rank: string;
  photo?: string;
  unit?: { _id: string; name: string };
  policeStation?: { _id: string; name: string };
  contactNumber?: string;
  email?: string;
  isActive: boolean;
}

interface OfficersTableProps {
  officers: Officer[];
  units: Unit[];
  stations: PoliceStation[];
  onOfficerUpdated: () => void;
  onOfficerDeleted: () => void;
}

export default function OfficersTable({
  officers,
  units,
  stations,
  onOfficerUpdated,
  onOfficerDeleted,
}: OfficersTableProps) {
  const [editingOfficer, setEditingOfficer] = useState<Officer | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const updateOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOfficer) return;

    try {
      const response = await fetch(`/api/officers/${editingOfficer._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingOfficer.name,
          badgeNumber: editingOfficer.badgeNumber,
          rank: editingOfficer.rank,
          photo: editingOfficer.photo,
          unit: editingOfficer.unit?._id || null,
          policeStation: editingOfficer.policeStation?._id || null,
          contactNumber: editingOfficer.contactNumber,
          email: editingOfficer.email,
          isActive: editingOfficer.isActive,
        }),
      });

      if (response.ok) {
        setEditingOfficer(null);
        setEditDialogOpen(false);
        onOfficerUpdated();
        toast({
          title: "Success",
          description: "Officer updated successfully",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to update officer",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating officer:", error);
      toast({
        title: "Error",
        description: "Failed to update officer",
        variant: "destructive",
      });
    }
  };

  const deleteOfficer = async (officerId: string) => {
    if (!confirm("Are you sure you want to deactivate this officer?")) {
      return;
    }

    try {
      const response = await fetch(`/api/officers/${officerId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onOfficerDeleted();
        toast({
          title: "Success",
          description: "Officer deactivated successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting officer:", error);
      toast({
        title: "Error",
        description: "Failed to deactivate officer",
        variant: "destructive",
      });
    }
  };

  const handlePhotoUpload = async (file: File) => {
    if (!file || !editingOfficer) return;

    // Create a simple data URL for demo purposes
    const reader = new FileReader();
    reader.onload = (e) => {
      const photoUrl = e.target?.result as string;
      setEditingOfficer({ ...editingOfficer, photo: photoUrl });
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Photo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Badge</TableHead>
            <TableHead>Rank</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Station</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {officers.map((officer) => (
            <TableRow key={officer._id}>
              <TableCell>
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={officer.photo || "/placeholder.svg"}
                    alt={officer.name}
                  />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{officer.name}</TableCell>
              <TableCell>{officer.badgeNumber}</TableCell>
              <TableCell>{officer.rank}</TableCell>
              <TableCell>{officer.unit?.name || "-"}</TableCell>
              <TableCell>{officer.policeStation?.name || "-"}</TableCell>
              <TableCell>
                <Badge variant={officer.isActive ? "default" : "secondary"}>
                  {officer.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
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
                        onClick={() => {
                          setEditingOfficer(officer);
                          setEditDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Officer</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={updateOfficer} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="editOfficerName">
                              Officer Name
                            </Label>
                            <Input
                              id="editOfficerName"
                              value={editingOfficer?.name || ""}
                              onChange={(e) =>
                                setEditingOfficer((prev) =>
                                  prev
                                    ? { ...prev, name: e.target.value }
                                    : null
                                )
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="editBadgeNumber">
                              Badge Number
                            </Label>
                            <Input
                              id="editBadgeNumber"
                              value={editingOfficer?.badgeNumber || ""}
                              onChange={(e) =>
                                setEditingOfficer((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        badgeNumber: e.target.value,
                                      }
                                    : null
                                )
                              }
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="editRank">Rank</Label>
                            <Input
                              id="editRank"
                              value={editingOfficer?.rank || ""}
                              onChange={(e) =>
                                setEditingOfficer((prev) =>
                                  prev
                                    ? { ...prev, rank: e.target.value }
                                    : null
                                )
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="editOfficerPhoto">Photo</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="editOfficerPhoto"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handlePhotoUpload(file);
                                }}
                              />
                              <Upload className="h-4 w-4" />
                              {editingOfficer?.photo && (
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={
                                      editingOfficer.photo || "/placeholder.svg"
                                    }
                                    alt={editingOfficer.name}
                                  />
                                  <AvatarFallback>
                                    <User className="h-4 w-4" />
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Unit (Optional)</Label>
                            <Select
                              value={editingOfficer?.unit?._id || ""}
                              onValueChange={(value) => {
                                const selectedUnit = units.find(
                                  (u) => u._id === value
                                );
                                if (editingOfficer) {
                                  setEditingOfficer({
                                    ...editingOfficer,
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
                            <Label>Police Station (Optional)</Label>
                            <Select
                              value={editingOfficer?.policeStation?._id || ""}
                              onValueChange={(value) => {
                                const selectedStation = stations.find(
                                  (s) => s._id === value
                                );
                                if (editingOfficer) {
                                  setEditingOfficer({
                                    ...editingOfficer,
                                    policeStation: selectedStation
                                      ? {
                                          _id: selectedStation._id,
                                          name: selectedStation.name,
                                        }
                                      : undefined,
                                  });
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Station" />
                              </SelectTrigger>
                              <SelectContent>
                                {stations.map((station) => (
                                  <SelectItem
                                    key={station._id}
                                    value={station._id}
                                  >
                                    {station.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="editContactNumber">
                              Contact Number
                            </Label>
                            <Input
                              id="editContactNumber"
                              value={editingOfficer?.contactNumber || ""}
                              onChange={(e) =>
                                setEditingOfficer((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        contactNumber: e.target.value,
                                      }
                                    : null
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="editEmail">Email</Label>
                            <Input
                              id="editEmail"
                              type="email"
                              value={editingOfficer?.email || ""}
                              onChange={(e) =>
                                setEditingOfficer((prev) =>
                                  prev
                                    ? { ...prev, email: e.target.value }
                                    : null
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                          <Button type="submit">Update Officer</Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setEditingOfficer(null);
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
                    onClick={() => deleteOfficer(officer._id)}
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
        <div className="text-center py-8 text-muted-foreground">
          No officers found. Create your first officer above.
        </div>
      )}
    </>
  );
}
