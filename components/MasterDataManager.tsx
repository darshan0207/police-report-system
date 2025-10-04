"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DutyTypesTab from "./DutyTypesTab";
import UnitsTab from "./UnitsTab";
import StationsTab from "./StationsTab";
import OfficersTab from "./OfficersTab";
import UsersTab from "./UsersTab";

export default function MasterDataManager() {
  return (
    <Tabs defaultValue="units">
      <TabsList className="grid w-full md:grid-cols-1 lg:grid-cols-5">
        <TabsTrigger value="units">યુનિટ</TabsTrigger>
        <TabsTrigger value="stations">પોલીસ સ્ટેશન</TabsTrigger>
        <TabsTrigger value="officers">અધિકારી</TabsTrigger>
        <TabsTrigger value="dutytypes">ફરજના પ્રકારો</TabsTrigger>
        <TabsTrigger value="users">યુઝર</TabsTrigger>
      </TabsList>

      <TabsContent value="units">
        <UnitsTab />
      </TabsContent>

      <TabsContent value="stations">
        <StationsTab />
      </TabsContent>

      <TabsContent value="officers">
        <OfficersTab />
      </TabsContent>

      <TabsContent value="dutytypes">
        <DutyTypesTab />
      </TabsContent>

      <TabsContent value="users">
        <UsersTab />
      </TabsContent>
    </Tabs>
  );
}
