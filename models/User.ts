// import mongoose, { Schema, type Document, type Types } from "mongoose";
// import bcrypt from "bcryptjs";
// export interface IUser extends Document {
//   name: string;
//   email: string;
//   password: string;
//   role: "admin" | "user";
//   isActive: boolean;
//   createdAt: Date;
//   updatedAt: Date;
//   comparePassword(candidate: string): Promise<boolean>;
// }

// const UserSchema = new Schema<IUser>(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     role: { type: String, enum: ["admin", "user"], required: true },
//     isActive: { type: Boolean, default: true },
//   },
//   {
//     timestamps: true,
//   }
// );

// UserSchema.methods.comparePassword = async function (
//   candidatePassword: string
// ) {
//   console.log("candidatePassword", candidatePassword);
//   return bcrypt.compare(candidatePassword, this.password);
// };

// export default mongoose.models.User ||
//   mongoose.model<IUser>("User", UserSchema);

import mongoose, { Schema, type Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "user"],
        message: "Role must be either 'admin' or 'user'",
      },
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
