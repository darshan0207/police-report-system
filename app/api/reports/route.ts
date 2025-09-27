import { type NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import DeploymentRecord from "@/models/DeploymentRecord";

export async function GET(request: NextRequest) {
  // const session = await getServerSession(authOptions)
  // if (!session) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  // }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  await connectDB();

  const session = {
    user: {
      role: "admin",
      zone: {},
      unit: {},
    },
  };

  const filter: any = {};
  if (date) filter.date = date;

  // Apply role-based filtering
  if (session.user.role === "zone") {
    filter.zone = session.user.zone;
  } else if (session.user.role === "unit") {
    filter.unit = session.user.unit;
  }

  const deployments = await DeploymentRecord.find(filter)
    .populate("zone unit policeStation verifyingOfficer")
    .sort({ createdAt: -1 });

  return NextResponse.json({ deployments });
}

export async function POST(request: NextRequest) {
  // const session = await getServerSession(authOptions);
  // if (!session) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  const session = {
    user: {
      role: "admin",
      zone: {},
      unit: {},
    },
  };

  const body = await request.json();
  const { date, deployments } = body;

  await connectDB();
  console.log(deployments);
  console.log(date);
  // Create deployment records
  // const deploymentDocs = await DeploymentRecord.insertMany(
  //   deployments.map((d: any) => ({ ...d, date }))
  // );

  const dailyDoc = await DeploymentRecord.findOneAndUpdate(
    {
      date: date,
      zone: deployments.zone,
      unit: deployments.unit,
      policeStation: deployments.policeStation,
    },
    { ...deployments, date },
    { upsert: true, new: true }
  );

  return NextResponse.json({ data: dailyDoc }, { status: 201 });
}
