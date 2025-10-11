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

export default function AdminDashboard({ role }: { role: string }) {
  const [activeTab, setActiveTab] = useState("reports");

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">ડેશબોર્ડ</h1>
        <Button onClick={() => signOut()} variant="outline">
          સાઇન આઉટ
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:grid-cols-1 lg:grid-cols-3">
          <TabsTrigger value="reports">દૈનિક રિપોર્ટ</TabsTrigger>
          <TabsTrigger value="create">રિપોર્ટ બનાવો</TabsTrigger>
          <TabsTrigger value="master">માસ્ટર ડેટા</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>દૈનિક રિપોર્ટ</CardTitle>
              <CardDescription>
                બધા દૈનિક રિપોર્ટ જુઓ અને મેનેજ કરો
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
              <CardTitle>રિપોર્ટ બનાવો</CardTitle>
              <CardDescription>આજના રિપોર્ટ માટે ડેટા દાખલ કરો</CardDescription>
            </CardHeader>
            <CardContent>
              <ReportForm role={role} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="master" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>માસ્ટર ડેટા</CardTitle>
              <CardDescription>
                યુનિટ, પોલીસ સ્ટેશન, અધિકારી, ફરજના પ્રકારો અને યુઝરઓનું સંચાલન
                કરો
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
