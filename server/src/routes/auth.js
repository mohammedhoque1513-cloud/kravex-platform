import express from "express";
import { body } from "express-validator";
import { login, me, register, requestPasswordReset, resetPassword } from "../controllers/authController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.post(
  "/register",
  requireAuth,
  requireRole("ADMIN"),
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  body("name").notEmpty(),
  register
);
router.get("/me", requireAuth, me);
router.post("/password-reset/request", requestPasswordReset);
router.post("/password-reset/confirm", body("password").isLength({ min: 8 }), resetPassword);

export default router;
