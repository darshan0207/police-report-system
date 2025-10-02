import { type NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import DutyType from "@/models/DutyType";

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

  await connectDB();
  const body = await request.json();

  try {
    const station = await DutyType.findByIdAndUpdate(
      params.id,
      {
        name: body.name,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!station) {
      return NextResponse.json(
        { error: "Duty type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(station);
  } catch (error) {
    console.error("Error updating duty type:", error);
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else if (error && typeof error === "object" && "message" in error) {
      errorMessage = String(error.message);
    }
    return NextResponse.json(
      { error: errorMessage || "Failed to update duty type" },
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
    const station = await DutyType.findByIdAndDelete(params.id);

    if (!station) {
      return NextResponse.json(
        { error: "Duty type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "duty type deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting duty type:", error);

    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else if (error && typeof error === "object" && "message" in error) {
      errorMessage = String(error.message);
    }

    return NextResponse.json(
      { error: errorMessage || "Failed to delete duty type" },
      { status: 500 }
    );
  }
}
