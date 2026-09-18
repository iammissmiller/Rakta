import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config. Used both by the full config in lib/auth.ts and,
 * on its own, by proxy.ts for route protection.
 *
 * This file must NEVER import Prisma, bcrypt, or anything else that needs
 * the Node.js runtime — proxy.ts runs on the Edge Runtime, and pulling in
 * lib/prisma.ts there is exactly what caused the "node:path"/"node:url
 * not supported in Edge Runtime" errors.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [], // real providers are added in lib/auth.ts, not here
  callbacks: {
    authorized({ auth }) {
      // proxy.ts's matcher already restricts which routes this runs on,
      // so all that's needed here is "is there a session at all".
      return !!auth?.user;
    },
  },
} satisfies NextAuthConfig;
