import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// A separate, edge-safe NextAuth instance built only from authConfig — no
// Prisma adapter, no bcrypt, no Node.js-only imports. This is what avoids
// the Edge Runtime errors that came from lib/auth.ts's full config.
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: [
    "/onboarding",
    "/welcome",
    "/dashboard/:path*",
    "/saheli/:path*",
    "/tracker/:path*",
    "/settings/:path*",
    "/family/:path*",
    "/invite/:path*",
    "/learn/:path*",
  ],
};