import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { prisma } from "../utils/prisma.js";
import { signToken } from "../middleware/auth.js";

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  clientId: user.clientId,
  client: user.client
});

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  const { name, email, password, role = "CLIENT", clientId } = req.body;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ message: "Email is already registered" });

  const user = await prisma.user.create({
    data: { name, email, role, clientId, passwordHash: await bcrypt.hash(password, 12) },
    include: { client: true }
  });

  res.status(201).json({ user: publicUser(user), token: signToken(user) });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email }, include: { client: true } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  res.json({ user: publicUser(user), token: signToken(user) });
};

export const me = (req, res) => res.json({ user: publicUser(req.user) });

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    if (process.env.ALLOW_DEV_RESET_TOKENS === "true") {
      const resetToken = signToken({ ...user, clientId: user.clientId });
      return res.json({ message: "Password reset token generated", resetToken });
    }
  }
  res.json({ message: "If that email exists, a reset link has been generated" });
};

export const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) return res.status(404).json({ message: "Account not found" });
  await prisma.user.update({
    where: { email },
    data: { passwordHash: await bcrypt.hash(password, 12) }
  });
  res.json({ message: "Password updated" });
};
