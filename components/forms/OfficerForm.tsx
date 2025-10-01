"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Upload, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Unit {
  _id: string;
  name: string;
}

interface PoliceStation {
  _id: string;
  name: string;
}

interface OfficerFormData {
  name: string;
  badgeNumber: string;
  rank: string;
  photo: string;
  unit: string;
  policeStation: string;
  contactNumber: string;
  email: string;
  isActive?: boolean;
}

interface OfficerFormProps {
  officer: OfficerFormData;
  units: Unit[];
  stations: PoliceStation[];
  onSubmit: (e: React.FormEvent) => void;
  onChange: (officer: OfficerFormData) => void;
  submitText: string;
  onPhotoUpload?: (file: File) => void;
  isEdit?: boolean;
}

export default function OfficerForm({
  officer,
  units,
  stations,
  onSubmit,
  onChange,
  submitText,
  onPhotoUpload,
  isEdit = false,
}: OfficerFormProps) {
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onPhotoUpload) {
      onPhotoUpload(file);
    }
  };

  const handleZoneChange = (zoneId: string) => {
    onChange({
      ...officer,
      unit: "", // Reset unit when zone changes
      policeStation: "", // Reset station when zone changes
    });
  };

  const handleUnitChange = (unitId: string) => {
    onChange({
      ...officer,
      unit: unitId,
    });
  };

  const handleStationChange = (stationId: string) => {
    onChange({
      ...officer,
      policeStation: stationId,
    });
  };

  const handleActiveChange = (active: boolean) => {
    onChange({
      ...officer,
      isActive: active,
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="officerName">
            Officer Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="officerName"
            value={officer.name}
            onChange={(e) => onChange({ ...officer, name: e.target.value })}
            placeholder="Enter full name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="badgeNumber">
            Badge Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="badgeNumber"
            value={officer.badgeNumber}
            onChange={(e) =>
              onChange({ ...officer, badgeNumber: e.target.value })
            }
            placeholder="Enter badge number"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rank">
            Rank <span className="text-red-500">*</span>
          </Label>
          <Input
            id="rank"
            value={officer.rank}
            onChange={(e) => onChange({ ...officer, rank: e.target.value })}
            placeholder="Enter rank"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="officerPhoto">Photo</Label>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input
                id="officerPhoto"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="cursor-pointer"
              />
            </div>
            <Upload className="h-4 w-4 text-muted-foreground" />
            <Avatar className="h-10 w-10 border">
              <AvatarImage
                src={officer.photo || "/placeholder.svg"}
                alt="Officer photo"
              />
              <AvatarFallback className="bg-muted">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </div>
          <p className="text-xs text-muted-foreground">
            Upload a profile photo (optional)
          </p>
        </div>
      </div>

      {/* Location Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Location Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Unit (Optional)</Label>
            <Select value={officer.unit} onValueChange={handleUnitChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Unit" />
              </SelectTrigger>
              <SelectContent>
                {units.length > 0 ? (
                  units.map((unit) => (
                    <SelectItem key={unit._id} value={unit._id}>
                      {unit.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-units" disabled>
                    No units
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Police Station (Optional)</Label>
            <Select
              value={officer.policeStation}
              onValueChange={handleStationChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Station" />
              </SelectTrigger>
              <SelectContent>
                {stations.length > 0 ? (
                  stations.map((station) => (
                    <SelectItem key={station._id} value={station._id}>
                      {station.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-stations" disabled>
                    No stations
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Contact Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input
              id="contactNumber"
              value={officer.contactNumber}
              onChange={(e) =>
                onChange({ ...officer, contactNumber: e.target.value })
              }
              placeholder="Enter phone number"
              type="tel"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={officer.email}
              onChange={(e) => onChange({ ...officer, email: e.target.value })}
              placeholder="Enter email address"
            />
          </div>
        </div>
      </div>

      {/* Status (for edit mode only) */}
      {isEdit && (
        <div className="flex items-center space-x-2 p-4 border rounded-lg bg-muted/50">
          <Switch
            checked={officer.isActive ?? true}
            onCheckedChange={handleActiveChange}
          />
          <Label htmlFor="active-status" className="cursor-pointer">
            Active Officer
          </Label>
          <span className="text-sm text-muted-foreground ml-2">
            {officer.isActive ? "Officer is active" : "Officer is inactive"}
          </span>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" size="lg" className="flex-1">
          {submitText}
        </Button>
      </div>

      {/* Required Fields Note */}
      <div className="text-xs text-muted-foreground">
        <span className="text-red-500">*</span> indicates required fields
      </div>
    </form>
  );
}
