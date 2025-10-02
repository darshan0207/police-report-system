"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import ReportForm from "./forms/ReportForm";

export default function UnitDashboard() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Unit Dashboard</h1>
        <Button onClick={() => signOut()} variant="outline">
          Sign Out
        </Button>
      </div>
      <ReportForm />
    </div>
  );
}
