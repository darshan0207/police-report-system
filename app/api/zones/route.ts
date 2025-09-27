import { type NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Zone from "@/models/Zone";

export async function GET() {
  // const session = await getServerSession(authOptions)
  // if (!session) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  // }
  const session = {
    user: {
      role: "admin",
      zone: {},
    },
  };

  await connectDB();

  if (session.user.role === "admin") {
    const zones = await Zone.find().sort({ name: 1 });
    return NextResponse.json(zones);
  } else if (session.user.role === "zone") {
    const zone = await Zone.findById(session.user.zone);
    return NextResponse.json([zone]);
  }

  return NextResponse.json([]);
}

export async function POST(request: NextRequest) {
  // const session = await getServerSession(authOptions);
  const session = {
    user: {
      role: "admin",
      zone: {},
    },
  };

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  await connectDB();

  const zone = await Zone.create(body);
  return NextResponse.json(zone, { status: 201 });
}
