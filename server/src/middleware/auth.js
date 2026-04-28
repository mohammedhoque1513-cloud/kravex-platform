import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma.js";

export const signToken = (user) =>
  jwt.sign(
    { id: user.id, role: user.role, clientId: user.clientId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

export const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Authentication required" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, name: true, email: true, role: true, clientId: true, client: true }
    });
    if (!user) return res.status(401).json({ message: "Invalid session" });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
  next();
};

export const restrictClientResource = (clientId) => {
  if (reqIsAdmin(clientId.req)) return true;
  return clientId.req.user.clientId && clientId.req.user.clientId === clientId.value;
};

export const reqIsAdmin = (req) => req.user?.role === "ADMIN";
