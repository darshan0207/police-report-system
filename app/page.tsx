"use client";

// import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
// import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  // const { data: session, status } = useSession();
  const router = useRouter();

  // useEffect(() => {
  //   if (status === "loading") return;
  //   if (session) {
  //     router.push("/dashboard");
  //   }
  // }, [session, status, router]);

  // if (status === "loading") {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       Loading...
  //     </div>
  //   );
  // }

  // if (session) {
  //   return null;
  // }
  // router.push("/dashboard");
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            Police Report System
          </CardTitle>
          <CardDescription>
            Daily deployment management system for Home Guards units
          </CardDescription>
        </CardHeader>
        {/* <CardContent className="text-center">
          <Button onClick={() => router.push("/login")} className="w-full">
            Sign In to Continue
          </Button>
        </CardContent> */}
      </Card>
    </div>
  );
}
