declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      unit?: string;
    };
  }

  interface User {
    role: string;
    unit?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    unit?: string;
  }
}
