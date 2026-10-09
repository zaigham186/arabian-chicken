import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const BASE = "http://localhost:3000";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ArabianChicken123";

async function isServerRunning() {
  try {
    const res = await fetch(`${BASE}/api/health`, { signal: AbortSignal.timeout(2000) });
    return res.status === 200;
  } catch {
    return false;
  }
}

async function waitForServer(timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isServerRunning()) return true;
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

async function runProductionSimulation() {
  console.log("=========================================================");
  console.log("   PHASE 6: NEXT.JS PRODUCTION RUNTIME SIMULATION        ");
  console.log("=========================================================\n");

  let spawned = null;
  const running = await isServerRunning();
  if (!running) {
    console.log("Starting Next.js production server (next start -p 3000)...");
    const cmd = process.platform === "win32" ? "npx.cmd" : "npx";
    spawned = spawn(cmd, ["next", "start", "-p", "3000"], {
      stdio: "ignore",
      shell: true,
    });

    const ready = await waitForServer(30000);
    if (!ready) {
      console.error("Failed to start production server within 30 seconds.");
      if (spawned) {
        if (process.platform === "win32") {
          spawn("taskkill", ["/pid", String(spawned.pid), "/f", "/t"], { shell: true });
        } else {
          spawned.kill();
        }
      }
      process.exit(1);
    }
    console.log("Production server is ready and listening on http://localhost:3000!\n");
  } else {
    console.log("Connected to existing server on http://localhost:3000.\n");
  }

  let passed = 0;
  let total = 0;

  function assert(name, ok, details = "") {
    total++;
    if (ok) {
      passed++;
      console.log(`[PASS] ${name} ${details ? `(${details})` : ""}`);
    } else {
      console.error(`[FAIL] ${name} ${details ? `(${details})` : ""}`);
    }
  }

  try {
    // 1. Homepage Production Render
    const rHome = await fetch(`${BASE}/`);
    const tHome = await rHome.text();
    assert("Production Homepage HTTP 200", rHome.status === 200, `status: ${rHome.status}`);
    assert("Security header X-Content-Type-Options", rHome.headers.get("x-content-type-options") === "nosniff", "nosniff present");
    assert("Security header X-Frame-Options", rHome.headers.get("x-frame-options") === "SAMEORIGIN", "SAMEORIGIN present");
    assert("Production Homepage HTML content", tHome.includes("Arabian Chick"), "brand text verified");
    assert("Production Homepage Next scripts", tHome.includes("/_next/static"), "optimized assets verified");

    // 2. Admin Page Production Render
    const rAdmin = await fetch(`${BASE}/admin`);
    const tAdmin = await rAdmin.text();
    assert("Production Admin Page HTTP 200", rAdmin.status === 200, `status: ${rAdmin.status}`);
    assert("Production Admin Page markup", tAdmin.includes("Checking authorization...") || tAdmin.includes("Admin") || tAdmin.includes("Password"), "admin UI verified");

    // 3. Health & Public API Endpoints
    const rHealth = await fetch(`${BASE}/api/health`);
    const dHealth = await rHealth.json();
    assert("Production Health API", rHealth.status === 200 && dHealth.database === "connected", `db: ${dHealth.database}`);

    const rLegHealth = await fetch(`${BASE}/health`);
    const dLegHealth = await rLegHealth.json();
    assert("Production Legacy /health ping", rLegHealth.status === 200 && dLegHealth.ok === true, "ok: true");

    const rItems = await fetch(`${BASE}/api/items`);
    const dItems = await rItems.json();
    assert("Production GET /api/items", rItems.status === 200 && Array.isArray(dItems) && dItems.length > 0, `${dItems.length} items`);

    const rDeals = await fetch(`${BASE}/api/deals`);
    const dDeals = await rDeals.json();
    assert("Production GET /api/deals", rDeals.status === 200 && Array.isArray(dDeals) && dDeals.length > 0, `${dDeals.length} deals`);

    // 4. Admin Authentication in Production Runtime
    const rWrongLogin = await fetch(`${BASE}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "invalid_password" }),
    });
    assert("Production login rejects invalid password", rWrongLogin.status === 401, `status: ${rWrongLogin.status}`);

    const rLogin = await fetch(`${BASE}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: ADMIN_PASSWORD }),
    });
    const dLogin = await rLogin.json();
    const token = dLogin.token;
    const setCookie = rLogin.headers.get("set-cookie") || "";
    assert("Production login succeeds with valid password", rLogin.status === 200 && !!token, "token acquired");
    assert("Production login issues admin_token cookie", setCookie.includes("admin_token="), "cookie verified");

    const cookieMatch = setCookie.match(/admin_token=([^;]+)/);
    const cookieHeader = cookieMatch ? `admin_token=${cookieMatch[1]}` : "";

    // 5. Session Verification
    const rVerifyHeader = await fetch(`${BASE}/api/admin/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const dVerifyHeader = await rVerifyHeader.json();
    assert("Session verification via Bearer token", rVerifyHeader.status === 200 && dVerifyHeader.authenticated === true, "authenticated: true");

    const rVerifyCookie = await fetch(`${BASE}/api/admin/verify`, {
      headers: { Cookie: cookieHeader },
    });
    const dVerifyCookie = await rVerifyCookie.json();
    assert("Session verification via HttpOnly cookie", rVerifyCookie.status === 200 && dVerifyCookie.authenticated === true, "authenticated: true");

    // 6. Production Staging Database CRUD: Items
    const newItem = {
      name: `Prod Sim Test Burger ${Date.now()}`,
      category: "burgers",
      prices: [{ label: "Single", value: 399 }],
      available: true,
      description: "Production simulation test item",
    };
    const rCreateItem = await fetch(`${BASE}/api/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newItem),
    });
    const dCreateItem = await rCreateItem.json();
    const createdItemId = dCreateItem._id;
    assert("Production item creation", rCreateItem.status === 200 && !!createdItemId, `id: ${createdItemId}`);

    // Fast stock toggle via Cookie
    const rToggleItem = await fetch(`${BASE}/api/items/${createdItemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
        Origin: BASE,
      },
      body: JSON.stringify({ available: false }),
    });
    const dToggleItem = await rToggleItem.json();
    assert("Production item stock toggle via Cookie", rToggleItem.status === 200 && dToggleItem.available === false, "available: false");

    // Delete item
    const rDelItem = await fetch(`${BASE}/api/items/${createdItemId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    assert("Production item cleanup", rDelItem.status === 200, "deleted successfully");

    // 7. Production Staging Database CRUD: Deals
    const newDeal = {
      title: `Prod Sim Test Deal ${Date.now()}`,
      price: 899,
      badge: "PROD-TEST",
      contents: "Burger + Drink",
      available: true,
    };
    const rCreateDeal = await fetch(`${BASE}/api/deals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newDeal),
    });
    const dCreateDeal = await rCreateDeal.json();
    const createdDealId = dCreateDeal._id;
    assert("Production deal creation", rCreateDeal.status === 200 && !!createdDealId, `id: ${createdDealId}`);

    // Fast stock toggle
    const rToggleDeal = await fetch(`${BASE}/api/deals/${createdDealId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ available: false }),
    });
    const dToggleDeal = await rToggleDeal.json();
    assert("Production deal stock toggle", rToggleDeal.status === 200 && dToggleDeal.available === false, "available: false");

    // Delete deal
    const rDelDeal = await fetch(`${BASE}/api/deals/${createdDealId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    assert("Production deal cleanup", rDelDeal.status === 200, "deleted successfully");

    // 8. Production Cloudinary Upload & Delivery
    const pngBuffer = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
      0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae,
      0x42, 0x60, 0x82,
    ]);
    const formData = new FormData();
    formData.append("image", new Blob([pngBuffer], { type: "image/png" }), "prod_sim_test.png");

    const rUpload = await fetch(`${BASE}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const dUpload = await rUpload.json();
    assert("Production Cloudinary upload", rUpload.status === 200 && dUpload.url?.startsWith("https://res.cloudinary.com"), `url: ${dUpload.url}`);

    if (dUpload.url) {
      const rCdn = await fetch(dUpload.url);
      assert("Cloudinary CDN serves image with HTTP 200", rCdn.status === 200, "CDN verified");
    }

    // 9. Session Revocation / Logout
    const rLogout = await fetch(`${BASE}/api/admin/logout`, {
      method: "POST",
      headers: { Cookie: cookieHeader, Origin: BASE },
    });
    const logoutCookie = rLogout.headers.get("set-cookie") || "";
    assert("Production logout clears session cookie", rLogout.status === 200 && logoutCookie.includes("Max-Age=0"), "Max-Age=0 verified");

    // 10. Security Audit: Client bundle check
    const staticDir = path.join(process.cwd(), ".next", "static");
    let secretLeakFound = false;
    if (fs.existsSync(staticDir)) {
      function scanDir(dir) {
        for (const file of fs.readdirSync(dir)) {
          const full = path.join(dir, file);
          if (fs.statSync(full).isDirectory()) {
            scanDir(full);
          } else if (file.endsWith(".js")) {
            const content = fs.readFileSync(full, "utf8");
            if (
              (process.env.MONGODB_URI && content.includes(process.env.MONGODB_URI)) ||
              (process.env.CLOUDINARY_API_SECRET && content.includes(process.env.CLOUDINARY_API_SECRET)) ||
              (process.env.JWT_SECRET && process.env.JWT_SECRET !== "default-secret-change-in-prod" && content.includes(process.env.JWT_SECRET))
            ) {
              secretLeakFound = true;
            }
          }
        }
      }
      scanDir(staticDir);
    }
    assert("Zero server secrets leaked in production client bundles", !secretLeakFound, ".next/static clean");

  } finally {
    if (spawned) {
      console.log("\nStopping production test server...");
      if (process.platform === "win32") {
        spawn("taskkill", ["/pid", String(spawned.pid), "/f", "/t"], { shell: true });
      } else {
        spawned.kill();
      }
    }
  }

  console.log("\n=========================================================");
  console.log(`PRODUCTION SIMULATION RESULT: ${passed} / ${total} PASSED`);
  console.log("=========================================================\n");

  if (passed !== total) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runProductionSimulation();
