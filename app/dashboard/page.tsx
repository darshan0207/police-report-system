"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminDashboard from "@/components/AdminDashboard";
import UnitDashboard from "@/components/UnitDashboard";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const role = session?.user?.role;

  return (
    <div className="min-h-screen bg-gray-50">
      {role === "admin" && <AdminDashboard />}
      {role === "user" && <UnitDashboard />}
    </div>
  );
}
