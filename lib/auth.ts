import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { verify } from "otplib";
import { prisma } from "@/lib/db";
import { listLocal } from "@/lib/local-store";
import { logSecurityEvent } from "@/lib/security-events";
import { decryptSecret } from "@/lib/encryption";

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

        const localDemoUser = process.env.NODE_ENV === "development" ? demoAuthorize(email, password) : null;
        if (localDemoUser) return localDemoUser as any;
        try {
          const localPortalUser = process.env.NODE_ENV === "development" ? await localPortalAuthorize(email, password) : null;
          if (localPortalUser) return localPortalUser as any;
        } catch (error) {
          console.error("Local portal authentication failed:", error);
        }

        try {
          const user = await prisma.user.findUnique({ where: { email } });
          if (user && user.isActive && !user.deletedAt) {
            const ok = await bcrypt.compare(password, user.passwordHash);
            if (!ok) {
              await logSecurityEvent({ type: "LOGIN_FAILURE", severity: "MEDIUM", email, description: "Invalid password submitted." });
              return null;
            }
            if (user.twoFactorEnabled) {
              const validCode = Boolean(user.twoFactorSecret && code && verify({ token: code, secret: decryptSecret(user.twoFactorSecret) }));
              if (!validCode) {
                await logSecurityEvent({ type: "LOGIN_FAILURE", severity: "HIGH", email, userId: user.id, description: "Valid password submitted without a valid 2FA code." });
                return null;
              }
            }
            await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });
            return { id: user.id, name: user.name, email: user.email, role: user.role, clientId: user.clientId } as any;
          }
        } catch (error) {
          console.error("Database authentication failed:", error);
          return null;
        }

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
