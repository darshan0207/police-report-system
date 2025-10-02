import { type NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { userCreateSchema } from "@/lib/schemas/user";
import bcrypt from "bcryptjs";
export async function GET() {
  // const session = await getServerSession(authOptions);
  // if (!session) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }
  try {
    await connectDB();
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// export async function GET(request: NextRequest) {
//   try {
//     // Check authentication
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     await connectDB();

//     // Optional: Check if user has permission to view users
//     // if (session.user.role !== "admin") {
//     //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     // }

//     // Get query parameters for filtering/pagination
//     const { searchParams } = new URL(request.url);
//     const page = parseInt(searchParams.get("page") || "1");
//     const limit = parseInt(searchParams.get("limit") || "50");
//     const search = searchParams.get("search") || "";
//     const role = searchParams.get("role") || "";

//     // Build filter object
//     const filter: any = {};
//     if (search) {
//       filter.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//       ];
//     }
//     if (role) {
//       filter.role = role;
//     }

//     // Get users with pagination
//     const skip = (page - 1) * limit;
//     const users = await User.find(filter)
//       .select("-password") // Exclude password field
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .lean();

//     // Get total count for pagination
//     const total = await User.countDocuments(filter);
//     const totalPages = Math.ceil(total / limit);

//     return NextResponse.json({
//       users,
//       pagination: {
//         page,
//         limit,
//         total,
//         totalPages,
//         hasNext: page < totalPages,
//         hasPrev: page > 1,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: NextRequest) {
  try {
    // // Check authentication and authorization
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // // Only admins can create users
    // if (session.user.role !== "admin") {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    await connectDB();

    const body = await request.json();

    // Validate request body
    let validatedData = userCreateSchema.parse(body);

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }
    const salt = await bcrypt.genSalt(10);
    validatedData.password = await bcrypt.hash(validatedData.password, salt);
    // Create user
    const user = await User.create(validatedData);

    // Return user without password
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);

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
