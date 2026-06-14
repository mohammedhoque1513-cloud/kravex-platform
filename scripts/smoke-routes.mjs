const baseUrl = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000";
const routes = [
  "/",
  "/how-it-works",
  "/services",
  "/industries",
  "/results",
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/cookie-policy",
  "/get-started",
  "/signup",
  "/login",
  "/forgot-password",
  "/reset-password?token=test",
  "/activate?token=test",
];

const failures = [];
for (const route of routes) {
  const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
  console.log(`${response.status} ${route}`);
  if (response.status !== 200) failures.push({ route, status: response.status });
}

if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exit(1);
}
