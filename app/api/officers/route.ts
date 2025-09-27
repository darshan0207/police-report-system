import { type NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Officer from "@/models/Officer";

export async function GET(request: NextRequest) {
  try {
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

    await connectDB();

    const { searchParams } = new URL(request.url);
    const zone = searchParams.get("zone");
    const unit = searchParams.get("unit");
    const station = searchParams.get("station");

    const query: any = { isActive: true };

    // Apply role-based filtering
    if (session.user.role === "zone" && session.user.zone) {
      query.zone = session.user.zone;
    } else if (session.user.role === "unit" && session.user.unit) {
      query.unit = session.user.unit;
    }

    // Apply additional filters
    if (zone) query.zone = zone;
    if (unit) query.unit = unit;
    if (station) query.policeStation = station;

    const officers = await Officer.find(query).sort({ name: 1 });
    return NextResponse.json(officers);
  } catch (error) {
    console.error("Error fetching officers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    await connectDB();

    const body = await request.json();
    const {
      name,
      badgeNumber,
      rank,
      photo,
      zone,
      unit,
      policeStation,
      contactNumber,
      email,
    } = body;

    if (!name || !badgeNumber || !rank || !zone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const officer = new Officer({
      name,
      badgeNumber,
      rank,
      photo,
      zone,
      unit: unit || null,
      policeStation: policeStation || null,
      contactNumber,
      email,
    });

    await officer.save();
    return NextResponse.json(officer, { status: 201 });
  } catch (error: any) {
    console.error("Error creating officer:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Badge number already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
