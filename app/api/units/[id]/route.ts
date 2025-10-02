import { type NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Unit from "@/models/Unit";

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

  const body = await request.json();
  await connectDB();

  try {
    const unit = await Unit.findByIdAndUpdate(
      params.id,
      { name: body.name, type: body.type },
      { new: true, runValidators: true }
    );

    if (!unit) {
      return NextResponse.json({ error: "Unit not found" }, { status: 404 });
    }

    return NextResponse.json(unit);
  } catch (error) {
    console.error("Error updating unit:", error);
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else if (error && typeof error === "object" && "message" in error) {
      errorMessage = String(error.message);
    }
    return NextResponse.json(
      { error: errorMessage || "Failed to update unit" },
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
    // Delete the unit
    const unit = await Unit.findByIdAndDelete(params.id);

    if (!unit) {
      return NextResponse.json({ error: "Unit not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Unit and associated police stations deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting unit:", error);
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else if (error && typeof error === "object" && "message" in error) {
      errorMessage = String(error.message);
    }

    return NextResponse.json(
      { error: errorMessage || "Failed to delete unit" },
      { status: 500 }
    );
  }
}
