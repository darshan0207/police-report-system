import { type NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Arrangement from "@/models/Arrangement";

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
    const station = await Arrangement.findByIdAndUpdate(
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
        { error: "Arrangement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(station);
  } catch (error) {
    console.error("Error updating Arrangement:", error);
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else if (error && typeof error === "object" && "message" in error) {
      errorMessage = String(error.message);
    }
    return NextResponse.json(
      { error: errorMessage || "Failed to update Arrangement" },
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
    const station = await Arrangement.findByIdAndDelete(params.id);

    if (!station) {
      return NextResponse.json(
        { error: "Arrangement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Arrangement deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting Arrangement:", error);

    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else if (error && typeof error === "object" && "message" in error) {
      errorMessage = String(error.message);
    }

    return NextResponse.json(
      { error: errorMessage || "Failed to delete Arrangement" },
      { status: 500 }
    );
  }
}
