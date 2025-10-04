"use client";

import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>લોડ કરી રહ્યું છે...</div>}>
      <SessionProvider>{children}</SessionProvider>
    </Suspense>
  );
}
