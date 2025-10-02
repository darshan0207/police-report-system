import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import DeploymentRecord from "@/models/DeploymentRecord";
import "@/models/Unit";
import "@/models/PoliceStation";
import "@/models/DutyType";
import "@/models/Officer";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    const filter: any = {};
    if (date) filter.date = date;

    const deployments = await DeploymentRecord.find(filter)
      .populate("unit policeStation dutyType verifyingOfficer")
      .sort({ createdAt: -1 });
    return NextResponse.json(deployments);
  } catch (error) {
    console.error("Error updating user:", error);

    let errorMessage = "An unexpected error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else if (error && typeof error === "object" && "message" in error) {
      errorMessage = String(error.message);
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
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
    console.log(body);
    await connectDB();

    const dailyDoc = await DeploymentRecord.create(body);
    return NextResponse.json(dailyDoc, { status: 201 });
  } catch (error) {
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else if (error && typeof error === "object" && "message" in error) {
      errorMessage = String(error.message);
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
