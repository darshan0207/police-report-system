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

  // await connectDB();

  const session = {
    user: {
      role: "admin",
      unit: {},
    },
  };

  let filter = {};
  if (session.user.role === "unit") {
    filter = { _id: session.user.unit };
  }

  const units = await Unit.find(filter).sort({ name: 1 });
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

    const body = await request.json();
    console.log(body);
    await connectDB();

    const unit = await Unit.create(body);
    return NextResponse.json(unit, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
