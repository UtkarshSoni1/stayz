"use client";

import dynamic from "next/dynamic";

// Dynamically import next-auth's SessionProvider with ssr: false to prevent
// the /_global-error prerender from failing. During build-time static generation
// of /_global-error, next-auth/react calls useContext in a null React context.
// Loading it only on the client side avoids this issue.
const NextAuthSessionProvider = dynamic(
  () => import("next-auth/react").then((m) => m.SessionProvider),
  { ssr: false }
);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
