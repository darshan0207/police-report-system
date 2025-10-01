import { type NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import DutyType from "@/models/DutyType";
import Unit from "@/models/Unit";
import PoliceStation from "@/models/PoliceStation";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // const session = await getServerSession(authOptions);
  // if (!session || session.user.role !== "admin") {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  const body = await request.json();
  await connectDB();

  try {
    const dutyType = await DutyType.findByIdAndUpdate(
      params.id,
      { name: body.name, description: body.description },
      { new: true, runValidators: true }
    );

    if (!dutyType) {
      return NextResponse.json(
        { error: "DutyType not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(dutyType);
  } catch (error) {
    console.error("Error updating duty type:", error);
    return NextResponse.json(
      { error: "Failed to update duty type" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // const session = await getServerSession(authOptions);
  // if (!session || session.user.role !== "admin") {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  await connectDB();

  try {
    // Delete all police stations in this dutyType
    await PoliceStation.deleteMany({ dutyType: params.id });

    // Delete all units in this dutyType
    await Unit.deleteMany({ dutyType: params.id });

    // Delete the dutyType
    const dutyType = await DutyType.findByIdAndDelete(params.id);

    if (!dutyType) {
      return NextResponse.json(
        { error: "dutyType not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "DutyType and associated data deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting dutyType:", error);
    return NextResponse.json(
      { error: "Failed to delete dutyType" },
      { status: 500 }
    );
  }
}
