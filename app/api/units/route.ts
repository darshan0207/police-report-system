import { type NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Unit from "@/models/Unit";

export async function GET() {
  // const session = await getServerSession(authOptions);
  // if (!session) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  await connectDB();
  const units = await Unit.find().sort({ name: 1 });
  return NextResponse.json(units);
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

    await connectDB();
    const body = await request.json();
    const unit = await Unit.create(body);
    return NextResponse.json(unit, { status: 201 });
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
