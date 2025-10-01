import { type NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import DutyType from "@/models/DutyType";

export async function GET() {
  try {
    // const session = await getServerSession(authOptions)
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }
    const session = {
      user: {
        role: "admin",
      },
    };

    await connectDB();

    if (session.user.role === "admin") {
      const DutyTypes = await DutyType.find().sort({ name: 1 });
      return NextResponse.json(DutyTypes);
    }

    return NextResponse.json([]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch duty types" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const dutyType = await DutyType.create(body);
    return NextResponse.json(dutyType, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create duty types" },
      { status: 500 }
    );
  }
}
