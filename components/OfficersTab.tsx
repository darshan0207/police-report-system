"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import OfficersTable from "./tables/OfficersTable";
import OfficerForm from "./forms/OfficerForm";

interface Unit {
  _id: string;
  name: string;
  type?: string;
}

interface PoliceStation {
  _id: string;
  name: string;
  unit?: { _id: string; name: string };
  address?: string;
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

interface OfficersTabProps {
  units: Unit[];
}

export default function OfficersTab({ units }: OfficersTabProps) {
  const [newOfficer, setNewOfficer] = useState({
    name: "",
    badgeNumber: "",
    rank: "",
    photo: "",
    unit: "",
    policeStation: "",
    contactNumber: "",
    email: "",
  });

  const [stations, setStations] = useState<PoliceStation[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [stationsRes, officersRes] = await Promise.all([
        fetch("/api/police-stations"),
        fetch("/api/officers"),
      ]);

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

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Officer</CardTitle>
        </CardHeader>
        <CardContent>
          <OfficerForm
            officer={newOfficer}
            units={units}
            stations={stations}
            onSubmit={createOfficer}
            onChange={setNewOfficer}
            submitText="Add Officer"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Officers</CardTitle>
        </CardHeader>
        <CardContent>
          <OfficersTable
            officers={officers}
            units={units}
            stations={stations}
            onOfficerUpdated={fetchData}
            onOfficerDeleted={fetchData}
          />
        </CardContent>
      </Card>
    </div>
  );
}
