import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { startEmbeddedDatabase } from "./utils/embeddedPostgres.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const port = process.env.PORT || 5000;

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection", error);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception", error);
});

async function bootstrap() {
  await startEmbeddedDatabase();

  const [
    { default: authRoutes },
    { default: dashboardRoutes },
    { default: prospectRoutes },
    { default: clientRoutes },
    { default: campaignRoutes },
    { default: leadRoutes },
    { default: invoiceRoutes },
    { default: paymentRoutes },
    { default: reportRoutes },
    { default: settingRoutes },
    { default: messageRoutes },
    { requireAuth }
  ] = await Promise.all([
    import("./routes/auth.js"),
    import("./routes/dashboard.js"),
    import("./routes/prospects.js"),
    import("./routes/clients.js"),
    import("./routes/campaigns.js"),
    import("./routes/leads.js"),
    import("./routes/invoices.js"),
    import("./routes/payments.js"),
    import("./routes/reports.js"),
    import("./routes/settings.js"),
    import("./routes/messages.js"),
    import("./middleware/auth.js")
  ]);

  const app = express();
  const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";
  const authAttempts = new Map();

  app.disable("x-powered-by");
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    res.setHeader("Cross-Origin-Resource-Policy", "same-site");
    next();
  });
  app.use(cors({ origin: allowedOrigin, credentials: true }));
  app.use(express.json({ limit: "2mb" }));
  app.use((req, res, next) => {
    if (req.path !== "/api/auth/login") return next();
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const windowMs = 15 * 60 * 1000;
    const limit = 10;
    const entry = authAttempts.get(ip) || { count: 0, resetAt: now + windowMs };
    if (now > entry.resetAt) {
      entry.count = 0;
      entry.resetAt = now + windowMs;
    }
    entry.count += 1;
    authAttempts.set(ip, entry);
    if (entry.count > limit) {
      return res.status(429).json({ message: "Too many login attempts. Try again later." });
    }
    next();
  });

  app.get("/health", (_req, res) => res.json({ status: "ok", service: "KRAVEX API" }));
  app.use("/api/auth", authRoutes);
  app.use("/api/dashboard", requireAuth, dashboardRoutes);
  app.use("/api/prospects", requireAuth, prospectRoutes);
  app.use("/api/clients", requireAuth, clientRoutes);
  app.use("/api/campaigns", requireAuth, campaignRoutes);
  app.use("/api/leads", requireAuth, leadRoutes);
  app.use("/api/invoices", requireAuth, invoiceRoutes);
  app.use("/api/payments", requireAuth, paymentRoutes);
  app.use("/api/reports", requireAuth, reportRoutes);
  app.use("/api/settings", requireAuth, settingRoutes);
  app.use("/api/messages", requireAuth, messageRoutes);

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  });

  app.listen(port, () => console.log(`KRAVEX API running on port ${port}`));
}

bootstrap().catch((error) => {
  console.error("Failed to start KRAVEX API", error);
  process.exit(1);
});
