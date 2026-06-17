import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { verify } from "otplib";
import { prisma } from "@/lib/db";
import { listLocal } from "@/lib/local-store";
import { logSecurityEvent } from "@/lib/security-events";
import { decryptSecret } from "@/lib/encryption";

const loginBuckets = new Map<string, { failed: number; lockedUntil: number; resetAt: number }>();
const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

function loginKey(email: string) {
  return `login:${email}`;
}

function checkLoginAllowed(email: string) {
  const now = Date.now();
  const bucket = loginBuckets.get(loginKey(email));
  if (!bucket || bucket.resetAt <= now) return true;
  return bucket.lockedUntil <= now;
}

async function recordLoginFailure(email: string, description = "Invalid login attempt.") {
  const now = Date.now();
  const key = loginKey(email);
  const bucket = loginBuckets.get(key);
  const next = !bucket || bucket.resetAt <= now
    ? { failed: 1, lockedUntil: 0, resetAt: now + LOGIN_WINDOW_MS }
    : { ...bucket, failed: bucket.failed + 1 };
  if (next.failed >= LOGIN_LIMIT) next.lockedUntil = now + LOGIN_WINDOW_MS;
  loginBuckets.set(key, next);
  await logSecurityEvent({ type: "LOGIN_FAILURE", severity: next.lockedUntil > now ? "HIGH" : "MEDIUM", email, description });
}

function recordLoginSuccess(email: string) {
  loginBuckets.delete(loginKey(email));
}

function demoUsers() {
  const adminPassword = process.env.DEMO_ADMIN_PASSWORD;
  const clientPassword = process.env.DEMO_CLIENT_PASSWORD;
  if (!adminPassword || !clientPassword) return [];
  return [
    { id: "demo-admin", name: "Emdadul Hoque", email: "emdadul.hoque@kravex.co.uk", password: adminPassword, role: "ADMIN", clientId: null },
    { id: "demo-patel", name: "Dr. Ravi Patel", email: "patel@pateldental.co.uk", password: clientPassword, role: "CLIENT", clientId: "demo-patel-client" },
    { id: "demo-metro", name: "Mike Dawson", email: "mike@metroroofing.co.uk", password: clientPassword, role: "CLIENT", clientId: "demo-metro-client" },
  ] as const;
}

function demoAuthorize(email: string, password: string) {
  const user = demoUsers().find((item) => item.email === email && item.password === password);
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role, clientId: user.clientId };
}

function allowDemoLogin() {
  return process.env.NODE_ENV === "development" || process.env.ENABLE_LIVE_DEMO_LOGIN === "true";
}

async function localPortalAuthorize(email: string, password: string) {
  const users = listLocal("portalUsers");
  const user = users.find((item: any) => item.email === email && item.isActive !== false);
  if (!user?.passwordHash) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role, clientId: user.clientId };
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 15 * 60 },
  jwt: { maxAge: 15 * 60 },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        code: { label: "2FA code", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password || "";
        const code = credentials?.code?.trim();
        if (!email || !password) return null;
        if (!checkLoginAllowed(email)) {
          await logSecurityEvent({ type: "LOGIN_FAILURE", severity: "HIGH", email, description: "Account login temporarily locked after repeated failures." });
          return null;
        }

        const localDemoUser = allowDemoLogin() ? demoAuthorize(email, password) : null;
        if (localDemoUser) {
          recordLoginSuccess(email);
          return localDemoUser as any;
        }
        try {
          const localPortalUser = allowDemoLogin() ? await localPortalAuthorize(email, password) : null;
          if (localPortalUser) {
            recordLoginSuccess(email);
            return localPortalUser as any;
          }
        } catch (error) {
          console.error("Local portal authentication failed:", error);
        }

        try {
          const user = await prisma.user.findUnique({ where: { email } });
          if (user && user.isActive && !user.deletedAt) {
            const ok = await bcrypt.compare(password, user.passwordHash);
            if (!ok) {
              await recordLoginFailure(email, "Invalid password submitted.");
              return null;
            }
            if (user.twoFactorEnabled) {
              const validCode = Boolean(user.twoFactorSecret && code && verify({ token: code, secret: decryptSecret(user.twoFactorSecret) }));
              if (!validCode) {
                await recordLoginFailure(email, "Valid password submitted without a valid 2FA code.");
                return null;
              }
            }
            await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });
            recordLoginSuccess(email);
            return { id: user.id, name: user.name, email: user.email, role: user.role, clientId: user.clientId } as any;
          }
        } catch (error) {
          console.error("Database authentication failed:", error);
          return null;
        }

        await recordLoginFailure(email);
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.clientId = (user as any).clientId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
        (session.user as any).clientId = token.clientId;
      }
      return session;
    },
  },
};
