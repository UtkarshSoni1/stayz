import NextAuth, { type DefaultSession, CredentialsSignin } from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { validateLogin, normaliseLogin } from "@/lib/validations/auth";

// Custom error returned when a credentials user has not verified their email.
// Auth.js v5 passes error.code back to the client as result.code.
class EmailNotVerifiedError extends CredentialsSignin {
  code = "email_not_verified" as const
}

// Extend next-auth types to include custom fields
declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      // Force the account chooser every time so users can switch accounts
      authorization: {
        params: { prompt: "select_account" },
      },
    }),
    // Google automatically reads AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET from env
    Credentials({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        // ── Server-side validation before any DB work ────────────────────────
        const { valid } = validateLogin(credentials);
        if (!valid) return null;

        // ── Normalise (trim + lowercase email) ───────────────────────────────
        const { email, password } = normaliseLogin(
          credentials as Record<string, unknown>
        );

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        // ── Block unverified credentials users ──────────────────────────────
        // Google OAuth users are always verified by the OAuth adapter.
        if (!user.emailVerified) {
          throw new EmailNotVerifiedError();
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {

    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.id = user.id;
        // For OAuth providers (e.g. Google), the Auth.js user object does not
        // carry the DB role — fetch it explicitly on first sign-in.
        if (account?.provider === "google" && user.id) {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { role: true },
          });
          token.role = dbUser?.role ?? "USER";
        } else {
          token.role = user.role;
        }
      }
      // On session update trigger, re-fetch role from DB so role promotions
      // (USER → OWNER) are immediately reflected without a full re-login
      if (trigger === "update" && token.id) {
        const freshUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true },
        });
        if (freshUser) {
          token.role = freshUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
