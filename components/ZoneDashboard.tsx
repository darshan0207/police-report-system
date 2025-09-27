"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportForm from "./ReportForm";
import ReportsList from "./ReportsList";
import SummaryReport from "./SummaryReport";

export default function ZoneDashboard() {
  const [activeTab, setActiveTab] = useState("reports");

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Zone Dashboard</h1>
        <Button onClick={() => signOut()} variant="outline">
          Sign Out
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports">Zone Reports</TabsTrigger>
          <TabsTrigger value="create">Create Report</TabsTrigger>
          <TabsTrigger value="summary">Zone Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Zone Daily Reports</CardTitle>
              <CardDescription>
                View deployment reports for your zone
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReportsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Daily Report</CardTitle>
              <CardDescription>
                Enter deployment data for your zone
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReportForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="mt-6">
          <SummaryReport />
        </TabsContent>
      </Tabs>
    </div>
  );
}
