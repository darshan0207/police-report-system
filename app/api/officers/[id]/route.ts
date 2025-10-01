import { type NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Officer from "@/models/Officer";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      unit,
      policeStation,
      contactNumber,
      email,
      isActive,
    } = body;

    const officer = await Officer.findByIdAndUpdate(
      params.id,
      {
        name,
        badgeNumber,
        rank,
        photo,
        unit: unit || null,
        policeStation: policeStation || null,
        contactNumber,
        email,
        isActive,
      },
      { new: true, runValidators: true }
    );

    if (!officer) {
      return NextResponse.json({ error: "Officer not found" }, { status: 404 });
    }

    return NextResponse.json(officer);
  } catch (error: any) {
    console.error("Error updating officer:", error);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    await connectDB();

    // Soft delete - mark as inactive instead of removing
    const officer = await Officer.findByIdAndUpdate(
      params.id,
      { isActive: false },
      { new: true }
    );

    if (!officer) {
      return NextResponse.json({ error: "Officer not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Officer deactivated successfully" });
  } catch (error) {
    console.error("Error deleting officer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
