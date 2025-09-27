// import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import SummaryReport from "@/components/SummaryReport";

export default async function SummaryReportPage() {
  // const session = await getServerSession(authOptions);

  // if (!session) {
  //   redirect("/auth/signin");
  // }

  return (
    <div className="container mx-auto py-6">
      <SummaryReport />
    </div>
  );
}
