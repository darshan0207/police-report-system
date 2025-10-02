"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserForm from "./forms/UserForm";
import UsersTable from "./tables/UserTable";
import { toast } from "sonner";
interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  isActive: boolean;
}

export default function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const usersRes = await fetch("/api/users");
      setUsers(await usersRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New User</CardTitle>
        </CardHeader>
        <CardContent>
          <UserForm onCreated={fetchData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersTable
            users={users}
            onUpdated={fetchData}
            onDeleted={fetchData}
          />
        </CardContent>
      </Card>
    </div>
  );
}
