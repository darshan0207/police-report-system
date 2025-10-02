import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "./mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectDB();
        const user = await User.findOne({
          email: credentials.email,
          isActive: true,
        });

        if (!user) {
          console.log("User not found or inactive:", credentials.email);
          return null;
        }

        console.log("Found user:", user.email);
        console.log("Stored password hash exists:", !!user.password);

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        console.log("Password valid:", isPasswordValid);

        if (isPasswordValid) {
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } else {
          console.log("Invalid password for user:", user.email);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.role = token.role as string;
      return session;
    },
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
};
