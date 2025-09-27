import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import connectDB from "./mongodb"
import User from "@/models/User"

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
          return null
        }

        await connectDB()
        const user = await User.findOne({ email: credentials.email, isActive: true }).populate("zone unit")

        if (user && (await user.comparePassword(credentials.password))) {
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            zone: user.zone?._id?.toString() || null,
            unit: user.unit?._id?.toString() || null,
          }
        }
        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.zone = user.zone
        token.unit = user.unit
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.sub
      session.user.role = token.role as string
      session.user.zone = token.zone as string
      session.user.unit = token.unit as string
      return session
    },
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
}
