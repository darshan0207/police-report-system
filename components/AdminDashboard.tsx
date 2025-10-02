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
import ReportForm from "./forms/ReportForm";
import ReportsList from "./ReportsList";
import MasterDataManager from "./MasterDataManager";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("reports");

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={() => signOut()} variant="outline">
          Sign Out
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:grid-cols-1 lg:grid-cols-3">
          <TabsTrigger value="reports">Daily Reports</TabsTrigger>
          <TabsTrigger value="create">Create Report</TabsTrigger>
          <TabsTrigger value="master">Master Data</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Reports</CardTitle>
              <CardDescription>
                View and manage all daily deployment reports
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
              <CardDescription>Enter deployment data for today</CardDescription>
            </CardHeader>
            <CardContent>
              <ReportForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="master" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Master Data Management</CardTitle>
              <CardDescription>
                Manage units, police stations, officers and duty types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MasterDataManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
