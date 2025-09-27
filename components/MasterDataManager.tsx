"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Upload, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Zone {
  _id: string;
  name: string;
  description?: string;
}

interface Unit {
  _id: string;
  name: string;
  zone: { _id: string; name: string };
  type?: string;
}

interface PoliceStation {
  _id: string;
  name: string;
  zone: { _id: string; name: string };
  unit?: { _id: string; name: string };
  address?: string;
}

interface Officer {
  _id: string;
  name: string;
  badgeNumber: string;
  rank: string;
  photo?: string;
  zone: { _id: string; name: string };
  unit?: { _id: string; name: string };
  policeStation?: { _id: string; name: string };
  contactNumber?: string;
  email?: string;
  isActive: boolean;
}

export default function MasterDataManager() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [stations, setStations] = useState<PoliceStation[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);

  const [newZone, setNewZone] = useState({ name: "", description: "" });
  const [newUnit, setNewUnit] = useState({ name: "", zone: "", type: "" });
  const [newStation, setNewStation] = useState({
    name: "",
    zone: "",
    unit: "",
    address: "",
  });
  const [newOfficer, setNewOfficer] = useState({
    name: "",
    badgeNumber: "",
    rank: "",
    photo: "",
    zone: "",
    unit: "",
    policeStation: "",
    contactNumber: "",
    email: "",
  });

  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [editingStation, setEditingStation] = useState<PoliceStation | null>(
    null
  );
  const [editingOfficer, setEditingOfficer] = useState<Officer | null>(null);
  const [editZoneOpen, setEditZoneOpen] = useState(false);
  const [editUnitOpen, setEditUnitOpen] = useState(false);
  const [editStationOpen, setEditStationOpen] = useState(false);
  const [editOfficerOpen, setEditOfficerOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [zonesRes, unitsRes, stationsRes, officersRes] = await Promise.all([
        fetch("/api/zones"),
        fetch("/api/units"),
        fetch("/api/police-stations"),
        fetch("/api/officers"),
      ]);

      setZones(await zonesRes.json());
      setUnits(await unitsRes.json());
      setStations(await stationsRes.json());
      setOfficers(await officersRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    }
  };

  const createZone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/zones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newZone),
      });

      if (response.ok) {
        setNewZone({ name: "", description: "" });
        fetchData();
        toast({
          title: "Success",
          description: "Zone created successfully",
        });
      }
    } catch (error) {
      console.error("Error creating zone:", error);
      toast({
        title: "Error",
        description: "Failed to create zone",
        variant: "destructive",
      });
    }
  };

  const updateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingZone) return;

    try {
      const response = await fetch(`/api/zones/${editingZone._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingZone.name,
          description: editingZone.description,
        }),
      });

      if (response.ok) {
        setEditingZone(null);
        setEditZoneOpen(false);
        fetchData();
        toast({
          title: "Success",
          description: "Zone updated successfully",
        });
      }
    } catch (error) {
      console.error("Error updating zone:", error);
      toast({
        title: "Error",
        description: "Failed to update zone",
        variant: "destructive",
      });
    }
  };

  const deleteZone = async (zoneId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this zone? This will also delete all associated units and police stations."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/zones/${zoneId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchData();
        toast({
          title: "Success",
          description: "Zone deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting zone:", error);
      toast({
        title: "Error",
        description: "Failed to delete zone",
        variant: "destructive",
      });
    }
  };

  const createUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/units", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUnit),
      });

      if (response.ok) {
        setNewUnit({ name: "", zone: "", type: "" });
        fetchData();
        toast({
          title: "Success",
          description: "Unit created successfully",
        });
      }
    } catch (error) {
      console.error("Error creating unit:", error);
      toast({
        title: "Error",
        description: "Failed to create unit",
        variant: "destructive",
      });
    }
  };

  const updateUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUnit) return;

    try {
      const response = await fetch(`/api/units/${editingUnit._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingUnit.name,
          zone: editingUnit.zone._id,
          type: editingUnit.type,
        }),
      });

      if (response.ok) {
        setEditingUnit(null);
        setEditUnitOpen(false);
        fetchData();
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
        fetchData();
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

  const createStation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/police-stations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStation),
      });

      if (response.ok) {
        setNewStation({ name: "", zone: "", unit: "", address: "" });
        fetchData();
        toast({
          title: "Success",
          description: "Police station created successfully",
        });
      }
    } catch (error) {
      console.error("Error creating station:", error);
      toast({
        title: "Error",
        description: "Failed to create police station",
        variant: "destructive",
      });
    }
  };

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
            zone: editingStation.zone._id,
            unit: editingStation.unit?._id || null,
            address: editingStation.address,
          }),
        }
      );

      if (response.ok) {
        setEditingStation(null);
        setEditStationOpen(false);
        fetchData();
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
        fetchData();
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

  const createOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/officers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOfficer),
      });

      if (response.ok) {
        setNewOfficer({
          name: "",
          badgeNumber: "",
          rank: "",
          photo: "",
          zone: "",
          unit: "",
          policeStation: "",
          contactNumber: "",
          email: "",
        });
        fetchData();
        toast({
          title: "Success",
          description: "Officer created successfully",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to create officer",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating officer:", error);
      toast({
        title: "Error",
        description: "Failed to create officer",
        variant: "destructive",
      });
    }
  };

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
          zone: editingOfficer.zone._id,
          unit: editingOfficer.unit?._id || null,
          policeStation: editingOfficer.policeStation?._id || null,
          contactNumber: editingOfficer.contactNumber,
          email: editingOfficer.email,
          isActive: editingOfficer.isActive,
        }),
      });

      if (response.ok) {
        setEditingOfficer(null);
        setEditOfficerOpen(false);
        fetchData();
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
        fetchData();
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

  const handlePhotoUpload = async (file: File, isEditing = false) => {
    if (!file) return;

    // Create a simple data URL for demo purposes
    // In production, you'd upload to a cloud storage service
    const reader = new FileReader();
    reader.onload = (e) => {
      const photoUrl = e.target?.result as string;
      if (isEditing && editingOfficer) {
        setEditingOfficer({ ...editingOfficer, photo: photoUrl });
      } else {
        setNewOfficer((prev) => ({ ...prev, photo: photoUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Tabs defaultValue="zones">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="zones">Zones</TabsTrigger>
        <TabsTrigger value="units">Units</TabsTrigger>
        <TabsTrigger value="stations">Police Stations</TabsTrigger>
        <TabsTrigger value="officers">Officers</TabsTrigger>
      </TabsList>

      <TabsContent value="zones" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Add New Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createZone} className="space-y-4">
              <div>
                <Label htmlFor="zoneName">Zone Name</Label>
                <Input
                  id="zoneName"
                  value={newZone.name}
                  onChange={(e) =>
                    setNewZone((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="zoneDesc">Description</Label>
                <Input
                  id="zoneDesc"
                  value={newZone.description}
                  onChange={(e) =>
                    setNewZone((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <Button type="submit">Add Zone</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Zones</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {zones.map((zone) => (
                  <TableRow key={zone._id}>
                    <TableCell>{zone.name}</TableCell>
                    <TableCell>{zone.description || "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog
                          open={editZoneOpen && editingZone?._id === zone._id}
                          onOpenChange={setEditZoneOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingZone(zone);
                                setEditZoneOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Zone</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={updateZone} className="space-y-4">
                              <div>
                                <Label htmlFor="editZoneName">Zone Name</Label>
                                <Input
                                  id="editZoneName"
                                  value={editingZone?.name || ""}
                                  onChange={(e) =>
                                    setEditingZone((prev) =>
                                      prev
                                        ? { ...prev, name: e.target.value }
                                        : null
                                    )
                                  }
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="editZoneDesc">
                                  Description
                                </Label>
                                <Input
                                  id="editZoneDesc"
                                  value={editingZone?.description || ""}
                                  onChange={(e) =>
                                    setEditingZone((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            description: e.target.value,
                                          }
                                        : null
                                    )
                                  }
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button type="submit">Update Zone</Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingZone(null);
                                    setEditZoneOpen(false);
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
                          onClick={() => deleteZone(zone._id)}
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
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="units" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Add New Unit</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createUnit} className="space-y-4">
              <div>
                <Label htmlFor="unitName">Unit Name</Label>
                <Input
                  id="unitName"
                  value={newUnit.name}
                  onChange={(e) =>
                    setNewUnit((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <Label>Zone</Label>
                <Select
                  value={newUnit.zone}
                  onValueChange={(value) =>
                    setNewUnit((prev) => ({ ...prev, zone: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.map((zone) => (
                      <SelectItem key={zone._id} value={zone._id}>
                        {zone.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="unitType">Type</Label>
                <Input
                  id="unitType"
                  value={newUnit.type}
                  onChange={(e) =>
                    setNewUnit((prev) => ({ ...prev, type: e.target.value }))
                  }
                />
              </div>
              <Button type="submit">Add Unit</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Units</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {units.map((unit) => (
                  <TableRow key={unit._id}>
                    <TableCell>{unit.name}</TableCell>
                    <TableCell>{unit.zone?.name}</TableCell>
                    <TableCell>{unit.type || "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog
                          open={editUnitOpen && editingUnit?._id === unit._id}
                          onOpenChange={setEditUnitOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingUnit(unit);
                                setEditUnitOpen(true);
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
                                      prev
                                        ? { ...prev, name: e.target.value }
                                        : null
                                    )
                                  }
                                  required
                                />
                              </div>
                              <div>
                                <Label>Zone</Label>
                                <Select
                                  value={editingUnit?.zone._id || ""}
                                  onValueChange={(value) => {
                                    const selectedZone = zones.find(
                                      (z) => z._id === value
                                    );
                                    if (selectedZone && editingUnit) {
                                      setEditingUnit({
                                        ...editingUnit,
                                        zone: {
                                          _id: selectedZone._id,
                                          name: selectedZone.name,
                                        },
                                      });
                                    }
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Zone" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {zones.map((zone) => (
                                      <SelectItem
                                        key={zone._id}
                                        value={zone._id}
                                      >
                                        {zone.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="editUnitType">Type</Label>
                                <Input
                                  id="editUnitType"
                                  value={editingUnit?.type || ""}
                                  onChange={(e) =>
                                    setEditingUnit((prev) =>
                                      prev
                                        ? { ...prev, type: e.target.value }
                                        : null
                                    )
                                  }
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button type="submit">Update Unit</Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingUnit(null);
                                    setEditUnitOpen(false);
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
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="stations" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Add New Police Station</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createStation} className="space-y-4">
              <div>
                <Label htmlFor="stationName">Station Name</Label>
                <Input
                  id="stationName"
                  value={newStation.name}
                  onChange={(e) =>
                    setNewStation((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <Label>Zone</Label>
                <Select
                  value={newStation.zone}
                  onValueChange={(value) =>
                    setNewStation((prev) => ({ ...prev, zone: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.map((zone) => (
                      <SelectItem key={zone._id} value={zone._id}>
                        {zone.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Unit (Optional)</Label>
                <Select
                  value={newStation.unit}
                  onValueChange={(value) =>
                    setNewStation((prev) => ({ ...prev, unit: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units
                      .filter((u) => u.zone._id === newStation.zone)
                      .map((unit) => (
                        <SelectItem key={unit._id} value={unit._id}>
                          {unit.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="stationAddress">Address</Label>
                <Input
                  id="stationAddress"
                  value={newStation.address}
                  onChange={(e) =>
                    setNewStation((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                />
              </div>
              <Button type="submit">Add Police Station</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Police Stations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stations.map((station) => (
                  <TableRow key={station._id}>
                    <TableCell>{station.name}</TableCell>
                    <TableCell>{station.zone?.name}</TableCell>
                    <TableCell>{station.unit?.name || "-"}</TableCell>
                    <TableCell>{station.address || "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog
                          open={
                            editStationOpen &&
                            editingStation?._id === station._id
                          }
                          onOpenChange={setEditStationOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingStation(station);
                                setEditStationOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Police Station</DialogTitle>
                            </DialogHeader>
                            <form
                              onSubmit={updateStation}
                              className="space-y-4"
                            >
                              <div>
                                <Label htmlFor="editStationName">
                                  Station Name
                                </Label>
                                <Input
                                  id="editStationName"
                                  value={editingStation?.name || ""}
                                  onChange={(e) =>
                                    setEditingStation((prev) =>
                                      prev
                                        ? { ...prev, name: e.target.value }
                                        : null
                                    )
                                  }
                                  required
                                />
                              </div>
                              <div>
                                <Label>Zone</Label>
                                <Select
                                  value={editingStation?.zone._id || ""}
                                  onValueChange={(value) => {
                                    const selectedZone = zones.find(
                                      (z) => z._id === value
                                    );
                                    if (selectedZone && editingStation) {
                                      setEditingStation({
                                        ...editingStation,
                                        zone: {
                                          _id: selectedZone._id,
                                          name: selectedZone.name,
                                        },
                                        unit: undefined, // Reset unit when zone changes
                                      });
                                    }
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Zone" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {zones.map((zone) => (
                                      <SelectItem
                                        key={zone._id}
                                        value={zone._id}
                                      >
                                        {zone.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
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
                                    {units
                                      .filter(
                                        (u) =>
                                          u.zone._id ===
                                          editingStation?.zone._id
                                      )
                                      .map((unit) => (
                                        <SelectItem
                                          key={unit._id}
                                          value={unit._id}
                                        >
                                          {unit.name}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="editStationAddress">
                                  Address
                                </Label>
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
                              <div className="flex gap-2">
                                <Button type="submit">Update Station</Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingStation(null);
                                    setEditStationOpen(false);
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
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="officers" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Add New Officer</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createOfficer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="officerName">Officer Name</Label>
                  <Input
                    id="officerName"
                    value={newOfficer.name}
                    onChange={(e) =>
                      setNewOfficer((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="badgeNumber">Badge Number</Label>
                  <Input
                    id="badgeNumber"
                    value={newOfficer.badgeNumber}
                    onChange={(e) =>
                      setNewOfficer((prev) => ({
                        ...prev,
                        badgeNumber: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rank">Rank</Label>
                  <Input
                    id="rank"
                    value={newOfficer.rank}
                    onChange={(e) =>
                      setNewOfficer((prev) => ({
                        ...prev,
                        rank: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="officerPhoto">Photo</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="officerPhoto"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePhotoUpload(file);
                      }}
                    />
                    <Upload className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Zone</Label>
                  <Select
                    value={newOfficer.zone}
                    onValueChange={(value) =>
                      setNewOfficer((prev) => ({
                        ...prev,
                        zone: value,
                        unit: "",
                        policeStation: "",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {zones.map((zone) => (
                        <SelectItem key={zone._id} value={zone._id}>
                          {zone.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Unit (Optional)</Label>
                  <Select
                    value={newOfficer.unit}
                    onValueChange={(value) =>
                      setNewOfficer((prev) => ({ ...prev, unit: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {units
                        .filter((u) => u.zone._id === newOfficer.zone)
                        .map((unit) => (
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
                    value={newOfficer.policeStation}
                    onValueChange={(value) =>
                      setNewOfficer((prev) => ({
                        ...prev,
                        policeStation: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Station" />
                    </SelectTrigger>
                    <SelectContent>
                      {stations
                        .filter((s) => s.zone._id === newOfficer.zone)
                        .map((station) => (
                          <SelectItem key={station._id} value={station._id}>
                            {station.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    value={newOfficer.contactNumber}
                    onChange={(e) =>
                      setNewOfficer((prev) => ({
                        ...prev,
                        contactNumber: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newOfficer.email}
                    onChange={(e) =>
                      setNewOfficer((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <Button type="submit">Add Officer</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Officers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Badge</TableHead>
                  <TableHead>Rank</TableHead>
                  <TableHead>Zone</TableHead>
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
                    <TableCell>{officer.name}</TableCell>
                    <TableCell>{officer.badgeNumber}</TableCell>
                    <TableCell>{officer.rank}</TableCell>
                    <TableCell>{officer.zone?.name}</TableCell>
                    <TableCell>{officer.unit?.name || "-"}</TableCell>
                    <TableCell>{officer.policeStation?.name || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={officer.isActive ? "default" : "secondary"}
                      >
                        {officer.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog
                          open={
                            editOfficerOpen &&
                            editingOfficer?._id === officer._id
                          }
                          onOpenChange={setEditOfficerOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingOfficer(officer);
                                setEditOfficerOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Officer</DialogTitle>
                            </DialogHeader>
                            <form
                              onSubmit={updateOfficer}
                              className="space-y-4"
                            >
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
                                  <Label htmlFor="editOfficerPhoto">
                                    Photo
                                  </Label>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      id="editOfficerPhoto"
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handlePhotoUpload(file, true);
                                      }}
                                    />
                                    {editingOfficer?.photo && (
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage
                                          src={
                                            editingOfficer.photo ||
                                            "/placeholder.svg"
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

                              <div className="flex gap-2">
                                <Button type="submit">Update Officer</Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingOfficer(null);
                                    setEditOfficerOpen(false);
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
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
