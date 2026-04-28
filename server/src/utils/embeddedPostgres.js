import bcrypt from "bcryptjs";
import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import pg from "pg";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(__dirname, "../..");
const workspaceRoot = path.resolve(serverRoot, "..");
const prismaSchemaPath = path.join(serverRoot, "prisma", "schema.prisma");
const prismaCliPath = path.join(workspaceRoot, "node_modules", "prisma", "build", "index.js");
const postgresRoot = path.join(workspaceRoot, "node_modules", "@embedded-postgres", "windows-x64", "native");
const postgresBin = path.join(postgresRoot, "bin");
const dbDirectory = path.join(serverRoot, "postgres-data");
const databaseName = "nexgen_leads";
const databasePort = 55432;
const superUser = "postgres";
const superPassword = "postgres";
const postgresLog = path.join(serverRoot, "postgres.log");
const pwFile = path.join(serverRoot, "postgres-pw.txt");

let started = false;

function shouldUseEmbeddedDatabase() {
  if (process.env.KRAVEX_USE_EMBEDDED_DB === "true") return true;
  if (process.env.KRAVEX_USE_EMBEDDED_DB === "false") return false;
  return !process.env.DATABASE_URL && process.env.NODE_ENV !== "production";
}

function postgresEnv() {
  return {
    ...process.env,
    PATH: `${postgresBin};${process.env.PATH || ""}`,
    PGPASSWORD: superPassword
  };
}

async function run(command, args, options = {}) {
  return execFileAsync(path.join(postgresBin, command), args, {
    cwd: serverRoot,
    env: postgresEnv(),
    ...options
  });
}

async function runPrisma(args) {
  return execFileAsync(process.execPath, [prismaCliPath, ...args], {
    cwd: workspaceRoot,
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL
    }
  });
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureCluster() {
  const versionFile = path.join(dbDirectory, "PG_VERSION");
  if (await fileExists(versionFile)) return;

  await fs.rm(dbDirectory, { recursive: true, force: true });
  await fs.mkdir(dbDirectory, { recursive: true });
  await fs.writeFile(pwFile, superPassword, "utf8");
  await run("initdb.exe", [
    "-D", dbDirectory,
    "-U", superUser,
    "-A", "scram-sha-256",
    `--pwfile=${pwFile}`,
    "--locale=C",
    "--encoding=UTF8"
  ]);
}

async function ensureServerRunning() {
  try {
    await run("pg_ctl.exe", ["-D", dbDirectory, "status"]);
    return;
  } catch {
    await run("pg_ctl.exe", [
      "-D", dbDirectory,
      "-l", postgresLog,
      "-o", `-p ${databasePort} -h 127.0.0.1`,
      "start"
    ]);
  }
}

async function ensureDatabase() {
  const client = new pg.Client({
    host: "127.0.0.1",
    port: databasePort,
    user: superUser,
    password: superPassword,
    database: "postgres"
  });
  await client.connect();
  try {
    await client.query(`CREATE DATABASE "${databaseName}"`);
  } catch (error) {
    if (error?.code !== "42P04") throw error;
  } finally {
    await client.end();
  }
}

async function ensurePrismaClient() {
  const queryEnginePath = path.join(workspaceRoot, "node_modules", ".prisma", "client", "query_engine-windows.dll.node");
  const tempEnginePath = path.join(workspaceRoot, "node_modules", ".prisma", "client", "query_engine-windows.dll.node.tmp39292");
  if (await fileExists(tempEnginePath)) {
    await fs.rm(tempEnginePath, { force: true });
  }
  if (!(await fileExists(queryEnginePath))) {
    await runPrisma(["generate", "--schema", prismaSchemaPath]);
  }
}

async function ensureSeedData() {
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  const passwordHash = await bcrypt.hash("Password123", 12);

  await prisma.agencySetting.upsert({
    where: { id: "kravex-primary" },
    update: {},
    create: { id: "kravex-primary", agencyName: "KRAVEX" }
  });

  await prisma.user.upsert({
    where: { email: "admin@kravex.co.uk" },
    update: {},
    create: {
      name: "KRAVEX Admin",
      email: "admin@kravex.co.uk",
      role: "ADMIN",
      passwordHash
    }
  });

  const client = await prisma.client.upsert({
    where: { email: "client@kravex.co.uk" },
    update: {},
    create: {
      businessName: "KRAVEX Demo Client",
      contactName: "Client User",
      email: "client@kravex.co.uk",
      phone: "",
      niche: "General",
      location: "United Kingdom",
      website: "",
      retainerAmount: 0,
      leadTarget: 0,
      status: "ACTIVE",
      contractStart: new Date()
    }
  });

  await prisma.user.upsert({
    where: { email: "client@kravex.co.uk" },
    update: { clientId: client.id, passwordHash },
    create: {
      name: "Client User",
      email: "client@kravex.co.uk",
      role: "CLIENT",
      clientId: client.id,
      passwordHash
    }
  });
  await prisma.$disconnect();
}

export async function startEmbeddedDatabase() {
  if (started) return;

  const usingEmbeddedDatabase = shouldUseEmbeddedDatabase();

  if (!usingEmbeddedDatabase) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is required when embedded database boot is disabled.");
    }
    started = true;
    return;
  }

  process.env.DATABASE_URL = process.env.DATABASE_URL || `postgresql://${superUser}:${superPassword}@127.0.0.1:${databasePort}/${databaseName}?schema=public`;

  if (process.env.KRAVEX_SKIP_DB_BOOT !== "true") {
    await ensureCluster();
    await ensureServerRunning();
    await ensureDatabase();
  }
  if (process.env.KRAVEX_SKIP_PRISMA_SYNC !== "true") {
    await ensurePrismaClient();
    await runPrisma(["db", "push", "--schema", prismaSchemaPath, "--skip-generate"]);
    if (process.env.KRAVEX_SEED_ON_BOOT !== "false") {
      await ensureSeedData();
    }
  }
  started = true;
}
