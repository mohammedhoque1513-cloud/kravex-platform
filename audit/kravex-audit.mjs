import fs from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer";

const baseUrl = "http://localhost:3000";
const outDir = path.resolve("audit", "kravex-report-assets");
const screenshotsDir = path.join(outDir, "screenshots");

const adminEmail = "emdadul.hoque@kravex.co.uk";
const adminPassword = process.env.E2E_ADMIN_PASSWORD;
const clientEmail = "patel@pateldental.co.uk";
const clientPassword = process.env.E2E_CLIENT_PASSWORD;

if (!adminPassword || !clientPassword) {
  throw new Error("E2E_ADMIN_PASSWORD and E2E_CLIENT_PASSWORD are required.");
}

const publicRoutes = [
  ["/", "Home"],
  ["/how-it-works", "How It Works"],
  ["/services", "Services"],
  ["/industries", "Industries"],
  ["/results", "Results"],
  ["/about", "About"],
  ["/contact", "Contact"],
  ["/privacy-policy", "Privacy Policy"],
  ["/terms", "Terms"],
  ["/cookie-policy", "Cookie Policy"],
  ["/get-started", "Get Started"],
  ["/signup", "Sign Up"],
  ["/login", "Login"],
  ["/forgot-password", "Forgot Password"],
  ["/reset-password?token=test", "Reset Password"],
  ["/activate?token=test", "Activate"],
];

const adminRoutes = [
  ["/admin/dashboard", "Admin Dashboard"],
  ["/admin/prospects", "Admin Prospects"],
  ["/admin/prospects/local-prospect-1", "Admin Prospect Detail"],
  ["/admin/clients", "Admin Clients"],
  ["/admin/clients/local-client-1", "Admin Client Detail"],
  ["/admin/leads", "Admin Leads"],
  ["/admin/campaigns", "Admin Campaigns"],
  ["/admin/invoices", "Admin Invoices"],
  ["/admin/invoices/new", "Admin New Invoice"],
  ["/admin/invoices/local-invoice-1", "Admin Invoice Detail"],
  ["/admin/payments", "Admin Payments"],
  ["/admin/reports", "Admin Reports"],
  ["/admin/settings", "Admin Settings"],
  ["/admin/security", "Admin Security"],
];

const clientRoutes = [
  ["/client/dashboard", "Client Dashboard"],
  ["/client/leads", "Client Leads"],
  ["/client/invoices", "Client Invoices"],
  ["/client/invoices/local-invoice-1", "Client Invoice Detail"],
  ["/client/messages", "Client Messages"],
  ["/client/account", "Client Account"],
];

const apiChecks = [
  ["GET", "/api/admin/prospects", "admin"],
  ["GET", "/api/admin/clients", "admin"],
  ["GET", "/api/admin/leads", "admin"],
  ["GET", "/api/admin/campaigns", "admin"],
  ["GET", "/api/admin/invoices", "admin"],
  ["GET", "/api/admin/payments", "admin"],
  ["GET", "/api/admin/payments/overview", "admin"],
  ["GET", "/api/admin/reports/agency", "admin"],
  ["GET", "/api/admin/settings", "admin"],
  ["GET", "/api/admin/security/events", "admin"],
  ["GET", "/api/client/dashboard", "client"],
  ["GET", "/api/client/leads", "client"],
  ["GET", "/api/client/invoices", "client"],
  ["GET", "/api/client/messages", "client"],
];

const viewports = {
  desktop: { width: 1440, height: 1000 },
  tablet: { width: 768, height: 1024, isMobile: true },
  phone: { width: 390, height: 844, isMobile: true },
};

const mode = process.argv.find((arg) => arg.startsWith("--mode="))?.split("=")[1] || "all";

function safeName(label) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function ensureDirs() {
  await fs.mkdir(screenshotsDir, { recursive: true });
}

async function textProbe(page) {
  return page.evaluate(() => {
    const body = document.body;
    const text = body?.innerText || "";
    const h1 = document.querySelector("h1")?.innerText || "";
    const buttons = [...document.querySelectorAll("button")].map((b) => b.innerText.trim()).filter(Boolean).slice(0, 20);
    const links = [...document.querySelectorAll("a")].map((a) => a.innerText.trim()).filter(Boolean).slice(0, 20);
    const forms = document.querySelectorAll("form").length;
    const inputs = document.querySelectorAll("input, textarea, select").length;
    const nav = document.querySelector("nav")?.innerText || "";
    const html = document.documentElement;
    const offenders = [...document.querySelectorAll("body *")]
      .filter((el) => {
        const style = getComputedStyle(el);
        if (style.position === "fixed") return false;
        if (style.overflowX === "auto" || style.overflowX === "scroll") return false;
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && (rect.left < -2 || rect.right > window.innerWidth + 2);
      })
      .slice(0, 8)
      .map((el) => ({
        tag: el.tagName.toLowerCase(),
        className: String(el.getAttribute("class") || "").slice(0, 120),
        text: String(el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 120),
      }));
    return {
      h1,
      title: document.title,
      textLength: text.length,
      hasCss: getComputedStyle(body).backgroundColor !== "rgba(0, 0, 0, 0)",
      forms,
      inputs,
      buttons,
      links,
      nav,
      bodyPreview: text.slice(0, 1000),
      viewport: { width: window.innerWidth, height: window.innerHeight },
      overflow: {
        pageOverflowX: html.scrollWidth > window.innerWidth + 2 || body.scrollWidth > window.innerWidth + 2,
        scrollWidth: Math.max(html.scrollWidth, body.scrollWidth),
        innerWidth: window.innerWidth,
        offenders,
      },
    };
  });
}

async function gotoAndRecord(page, route, label, role, viewportName, capture = false) {
  const result = { route, label, role, viewport: viewportName, ok: false, status: null, finalUrl: "", error: null, screenshot: null, probe: null };
  try {
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForNetworkIdle({ idleTime: 500, timeout: 15000 }).catch(() => {});
    result.status = response?.status() || null;
    result.finalUrl = page.url();
    result.probe = await textProbe(page);
    const expectedAreaReached = role === "public" || result.finalUrl.includes(route.split("?")[0]);
    const loginRedirect = role !== "public" && result.finalUrl.includes("/login");
    result.ok = Boolean(result.status && result.status < 400 && expectedAreaReached && !loginRedirect && result.probe.textLength > 40);
    if (capture) {
      await new Promise((resolve) => setTimeout(resolve, 1800));
      const file = path.join(screenshotsDir, `${safeName(role)}-${safeName(label)}-${viewportName}.png`);
      await page.screenshot({ path: file, fullPage: false });
      result.screenshot = file;
    }
    console.log(`${result.ok ? "PASS" : "FAIL"} ${role} ${viewportName} ${route} ${result.status || ""} ${result.finalUrl}`);
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
    console.log(`ERROR ${role} ${viewportName} ${route} ${result.error}`);
  }
  return result;
}

async function login(page, email, password) {
  await page.goto(`${baseUrl}/login`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForSelector("input[type='email']", { timeout: 20000 });
  await page.waitForFunction(() => Boolean(window.next), { timeout: 30000 }).catch(() => {});
  await new Promise((resolve) => setTimeout(resolve, 1500));
  await page.type("input[type='email']", email);
  await page.type("input[type='password']", password);
  const signInButton = await page.$("button");
  if (!signInButton) {
    throw new Error("No login button found");
  }
  await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 30000 }).catch(() => {}),
    signInButton.click(),
  ]);
  await page.waitForNetworkIdle({ idleTime: 500, timeout: 15000 }).catch(() => {});
  return page.url();
}

async function runFormChecks(browser) {
  const page = await browser.newPage();
  await page.setViewport(viewports.desktop);
  const checks = [];
  await page.goto(`${baseUrl}/contact`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForSelector("form", { timeout: 20000 }).catch(() => {});
  checks.push({
    name: "Contact form present",
    ok: (await page.$$("form")).length > 0 && (await page.$$("input, textarea, select")).length >= 4,
    evidence: await textProbe(page),
  });

  await page.goto(`${baseUrl}/get-started`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForSelector("form", { timeout: 20000 }).catch(() => {});
  checks.push({
    name: "Lead form present",
    ok: (await page.$$("form")).length > 0 && (await page.$$("input, textarea, select")).length >= 7,
    evidence: await textProbe(page),
  });

  const response = await page.evaluate(async () => {
    const res = await fetch("/api/lead-form", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "Audit Test Lead",
        email: "audit@example.com",
        phone: "07123456789",
        service: "Roofing & Trades",
        city: "Birmingham",
        businessName: "Audit Roofing Ltd",
        budget: "£1,000 — £2,000",
        referralSource: "Audit",
        message: "Automated audit submission.",
        source: "AUDIT",
      }),
    });
    return { status: res.status, text: await res.text() };
  });
  checks.push({
    name: "Lead form API accepts valid public enquiry",
    ok: response.status >= 200 && response.status < 300,
    evidence: response,
  });

  await page.close();
  return checks;
}

async function runApiChecks(browser, role, cookies) {
  const page = await browser.newPage();
  await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 30000 }).catch(() => {});
  await page.setCookie(...cookies);
  const results = [];
  for (const [method, route, requiredRole] of apiChecks.filter((item) => item[2] === role)) {
    const result = await page.evaluate(async ({ method, route }) => {
      const res = await fetch(new URL(route, window.location.origin).toString(), { method });
      const contentType = res.headers.get("content-type") || "";
      const body = contentType.includes("json") ? await res.json().catch(() => null) : await res.text().catch(() => "");
      return { status: res.status, ok: res.ok, body };
    }, { method, route });
    results.push({ method, route, role, ...result });
  }
  await page.close();
  return results;
}

async function runUnauthChecks(browser) {
  const page = await browser.newPage();
  const checks = [];
  for (const route of ["/admin/dashboard", "/client/dashboard"]) {
    try {
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 45000 });
      checks.push({
        route,
        status: response?.status() || null,
        finalUrl: page.url(),
        redirectedToLogin: page.url().includes("/login"),
      });
    } catch (error) {
      checks.push({
        route,
        status: null,
        finalUrl: page.url(),
        redirectedToLogin: page.url().includes("/login"),
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
  await page.close();
  return checks;
}

async function run() {
  await ensureDirs();
  const browser = await puppeteer.launch({ headless: "new" });
  const summary = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    public: [],
    admin: [],
    client: [],
    unauth: [],
    auth: {},
    api: [],
    forms: [],
    screenshots: [],
    mobile: [],
  };

  try {
    if (["all", "public"].includes(mode)) for (const [viewportName, viewport] of Object.entries(viewports)) {
      const page = await browser.newPage();
      await page.setViewport(viewport);
      for (const [route, label] of publicRoutes) {
        const capture = viewportName === "phone" && ["/", "/how-it-works", "/services", "/industries", "/results", "/about", "/contact", "/login", "/get-started"].includes(route);
        const result = await gotoAndRecord(page, route, label, "public", viewportName, capture);
        summary.public.push(result);
        if (result.screenshot) summary.screenshots.push(result.screenshot);
        if (viewportName !== "desktop") summary.mobile.push({ route, label, viewport: viewportName, overflow: result.probe?.overflow, ok: result.ok && !result.probe?.overflow?.pageOverflowX });
      }
      await page.close();
    }

    if (["all", "auth", "admin", "client"].includes(mode)) {
      summary.unauth = await runUnauthChecks(browser);
    }

    if (["all", "admin"].includes(mode)) {
      const adminPage = await browser.newPage();
      await adminPage.setViewport(viewports.desktop);
      summary.auth.adminFinalUrl = await login(adminPage, adminEmail, adminPassword);
      console.log(`AUTH admin ${summary.auth.adminFinalUrl}`);
      const adminCookies = await adminPage.cookies();
      for (const [route, label] of adminRoutes) {
        const capture = ["/admin/dashboard", "/admin/prospects", "/admin/clients", "/admin/leads", "/admin/invoices", "/admin/payments", "/admin/security"].includes(route);
        const result = await gotoAndRecord(adminPage, route, label, "admin", "desktop", capture);
        summary.admin.push(result);
        if (result.screenshot) summary.screenshots.push(result.screenshot);
      }
      summary.api.push(...await runApiChecks(browser, "admin", adminCookies));
      await adminPage.close();
    }

    if (["all", "client"].includes(mode)) {
      const clientPage = await browser.newPage();
      await clientPage.setViewport(viewports.desktop);
      summary.auth.clientFinalUrl = await login(clientPage, clientEmail, clientPassword);
      console.log(`AUTH client ${summary.auth.clientFinalUrl}`);
      const clientCookies = await clientPage.cookies();
      for (const [route, label] of clientRoutes) {
        const capture = ["/client/dashboard", "/client/leads", "/client/invoices", "/client/messages", "/client/account"].includes(route);
        const result = await gotoAndRecord(clientPage, route, label, "client", "desktop", capture);
        summary.client.push(result);
        if (result.screenshot) summary.screenshots.push(result.screenshot);
      }
      summary.api.push(...await runApiChecks(browser, "client", clientCookies));
      await clientPage.close();
    }

    if (["all", "forms"].includes(mode)) {
      summary.forms = await runFormChecks(browser);
    }
  } finally {
    await browser.close();
  }

  await fs.writeFile(path.join(outDir, `audit-results-${mode}.json`), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify({
    outDir,
    public: summary.public.length,
    admin: summary.admin.length,
    client: summary.client.length,
    api: summary.api.length,
    screenshots: summary.screenshots.length,
  }, null, 2));
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
