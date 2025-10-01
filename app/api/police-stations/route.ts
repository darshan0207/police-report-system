import { type NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import PoliceStation from "@/models/PoliceStation";

export async function GET() {
  // const session = await getServerSession(authOptions);
  // if (!session) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }
  const session = {
    user: {
      role: "admin",
      unit: {},
    },
  };

  await connectDB();

  let filter = {};
  if (session.user.role === "unit") {
    filter = { unit: session.user.unit };
  }

  const stations = await PoliceStation.find(filter)
    .populate("unit")
    .sort({ name: 1 });
  return NextResponse.json(stations);
}

export async function POST(request: NextRequest) {
  // const session = await getServerSession(authOptions);
  const session = {
    user: {
      role: "admin",
    },
  };

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  await connectDB();

  const station = await PoliceStation.create(body);
  return NextResponse.json(station, { status: 201 });
}
