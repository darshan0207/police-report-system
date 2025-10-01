import { type NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import PoliceStation from "@/models/PoliceStation";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // const session = await getServerSession(authOptions);
  // if (
  //   !session ||
  //   (session.user.role !== "admin")
  // ) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  const session = {
    user: {
      role: "admin",
    },
  };

  const body = await request.json();
  await connectDB();

  try {
    const updateData: any = {
      name: body.name,
      address: body.address,
    };

    // Only set unit if provided, otherwise remove it
    if (body.unit) {
      updateData.unit = body.unit;
    } else {
      updateData.$unset = { unit: 1 };
    }

    const station = await PoliceStation.findByIdAndUpdate(
      params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("unit");

    if (!station) {
      return NextResponse.json(
        { error: "Police station not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(station);
  } catch (error) {
    console.error("Error updating police station:", error);
    return NextResponse.json(
      { error: "Failed to update police station" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // const session = await getServerSession(authOptions);
  // if (
  //   !session ||
  //   (session.user.role !== "admin")
  // ) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  await connectDB();

  try {
    const station = await PoliceStation.findByIdAndDelete(params.id);

    if (!station) {
      return NextResponse.json(
        { error: "Police station not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Police station deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting police station:", error);
    return NextResponse.json(
      { error: "Failed to delete police station" },
      { status: 500 }
    );
  }
}
