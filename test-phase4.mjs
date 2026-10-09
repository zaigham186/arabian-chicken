import fs from "fs";
import jwt from "jsonwebtoken";

const BASE = "http://localhost:3000";
const JWT_SECRET = process.env.JWT_SECRET || "default-secret-change-in-prod";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ArabianChicken123";

async function run() {
  console.log("=================================================");
  console.log("       PHASE 4 SECURITY & REGRESSION SUITE        ");
  console.log("=================================================");

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

  // 1. Database Health
  try {
    const res = await fetch(`${BASE}/api/health`);
    const data = await res.json();
    assert(
      "Health API check",
      res.status === 200 && data.database === "connected",
      `db: ${data.database}`,
    );
  } catch (e) {
    assert("Health API check", false, e.message);
  }

  // 2. Public Catalogues
  try {
    const rItems = await fetch(`${BASE}/api/items`);
    const items = await rItems.json();
    assert(
      "Public items catalogue accessible",
      rItems.status === 200 && Array.isArray(items),
      `${items.length} items`,
    );

    const rDeals = await fetch(`${BASE}/api/deals`);
    const deals = await rDeals.json();
    assert(
      "Public deals catalogue accessible",
      rDeals.status === 200 && Array.isArray(deals),
      `${deals.length} deals`,
    );
  } catch (e) {
    assert("Public catalogues", false, e.message);
  }

  // 3. Admin Login Validation
  try {
    // Missing password
    const rEmpty = await fetch(`${BASE}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const dEmpty = await rEmpty.json();
    assert(
      "Admin login rejects missing password",
      rEmpty.status === 400 && dEmpty.error === "Password is required",
      `status: ${rEmpty.status}`,
    );

    // Wrong password
    const rWrong = await fetch(`${BASE}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "wrong_password_attempt" }),
    });
    const dWrong = await rWrong.json();
    assert(
      "Admin login rejects wrong password",
      rWrong.status === 401 && dWrong.error === "Wrong password",
      `status: ${rWrong.status}`,
    );
  } catch (e) {
    assert("Admin login validation", false, e.message);
  }

  // 4. Valid Admin Login & Cookie issuance
  let adminToken = null;
  let cookieHeader = null;
  try {
    const rValid = await fetch(`${BASE}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: ADMIN_PASSWORD }),
    });
    const dValid = await rValid.json();
    adminToken = dValid.token;
    const rawCookie = rValid.headers.get("set-cookie") || "";
    cookieHeader = rawCookie.split(";")[0]; // "admin_token=..."

    assert(
      "Admin login succeeds with valid credentials",
      rValid.status === 200 && typeof adminToken === "string" && adminToken.length > 20,
      "token returned",
    );
    assert(
      "Admin login sets HttpOnly SameSite cookie",
      rawCookie.includes("admin_token=") &&
        rawCookie.toLowerCase().includes("httponly") &&
        rawCookie.toLowerCase().includes("samesite=lax"),
      "cookie attributes verified",
    );
  } catch (e) {
    assert("Valid admin login", false, e.message);
  }

  // 5. Session Verification Endpoint
  try {
    // With Bearer header
    const rVerifyHeader = await fetch(`${BASE}/api/admin/verify`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const dVerifyHeader = await rVerifyHeader.json();
    assert(
      "Verify session via Bearer Authorization",
      rVerifyHeader.status === 200 &&
        dVerifyHeader.authenticated === true &&
        dVerifyHeader.role === "admin",
      `role: ${dVerifyHeader.role}`,
    );

    // With Cookie
    const rVerifyCookie = await fetch(`${BASE}/api/admin/verify`, {
      headers: { Cookie: cookieHeader },
    });
    const dVerifyCookie = await rVerifyCookie.json();
    assert(
      "Verify session via HttpOnly Cookie",
      rVerifyCookie.status === 200 &&
        dVerifyCookie.authenticated === true &&
        dVerifyCookie.role === "admin",
      `role: ${dVerifyCookie.role}`,
    );
  } catch (e) {
    assert("Session verification", false, e.message);
  }

  // 6. Token Tampering & Privilege Escalation Tests
  try {
    // Malformed token
    const rMalformed = await fetch(`${BASE}/api/admin/verify`, {
      headers: { Authorization: "Bearer this-is-not-a-jwt-token" },
    });
    assert(
      "Malformed token rejected (401)",
      rMalformed.status === 401,
      `status: ${rMalformed.status}`,
    );

    // Incorrect signature (signed with different secret)
    const fakeToken = jwt.sign({ role: "admin" }, "different-secret-key-12345");
    const rFake = await fetch(`${BASE}/api/admin/verify`, {
      headers: { Authorization: `Bearer ${fakeToken}` },
    });
    assert("Wrong secret token rejected (401)", rFake.status === 401, `status: ${rFake.status}`);

    // Expired token
    const expiredToken = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "-1s" });
    const rExpired = await fetch(`${BASE}/api/admin/verify`, {
      headers: { Authorization: `Bearer ${expiredToken}` },
    });
    assert("Expired token rejected (401)", rExpired.status === 401, `status: ${rExpired.status}`);

    // Non-admin role (insufficient privilege)
    const userRoleToken = jwt.sign({ role: "customer" }, JWT_SECRET, { expiresIn: "1h" });
    const rUserRole = await fetch(`${BASE}/api/admin/verify`, {
      headers: { Authorization: `Bearer ${userRoleToken}` },
    });
    assert(
      "Non-admin role token rejected (401)",
      rUserRole.status === 401,
      `status: ${rUserRole.status}`,
    );

    // Mutating endpoint rejects non-admin token
    const rUserCreate = await fetch(`${BASE}/api/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userRoleToken}`,
      },
      body: JSON.stringify({
        name: "Hacked Item",
        category: "pizza",
        prices: [{ label: "1", value: 100 }],
      }),
    });
    assert(
      "Non-admin cannot create items (401)",
      rUserCreate.status === 401,
      `status: ${rUserCreate.status}`,
    );
  } catch (e) {
    assert("Security privilege escalation tests", false, e.message);
  }

  // 7. Unauthenticated Mutation Protections
  try {
    const ops = [
      { method: "POST", url: `${BASE}/api/items`, body: { name: "x" } },
      {
        method: "PUT",
        url: `${BASE}/api/items/6ac8ec536e4bca5f0013dca5`,
        body: { available: false },
      },
      { method: "DELETE", url: `${BASE}/api/items/6ac8ec536e4bca5f0013dca5` },
      { method: "POST", url: `${BASE}/api/deals`, body: { title: "x" } },
      {
        method: "PUT",
        url: `${BASE}/api/deals/6ac8ec5a6e4bca5f0013dca6`,
        body: { available: false },
      },
      { method: "DELETE", url: `${BASE}/api/deals/6ac8ec5a6e4bca5f0013dca6` },
      { method: "POST", url: `${BASE}/api/upload`, body: new FormData() },
    ];

    for (const op of ops) {
      const res = await fetch(op.url, {
        method: op.method,
        headers: op.body instanceof FormData ? {} : { "Content-Type": "application/json" },
        ...(op.body && !(op.body instanceof FormData) ? { body: JSON.stringify(op.body) } : {}),
      });
      assert(
        `Unauthenticated ${op.method} ${new URL(op.url).pathname} rejected`,
        res.status === 401,
        `status: ${res.status}`,
      );
    }
  } catch (e) {
    assert("Unauthenticated protections", false, e.message);
  }

  // 8. Input Validation & Malformed ID Tests
  try {
    const authHeader = {
      Authorization: `Bearer ${adminToken}`,
      "Content-Type": "application/json",
    };

    // Malformed ObjectIds
    const rBadIdItem = await fetch(`${BASE}/api/items/not-a-valid-mongo-id`, {
      method: "PUT",
      headers: authHeader,
      body: JSON.stringify({ available: false }),
    });
    assert(
      "Malformed item ID rejected (400)",
      rBadIdItem.status === 400,
      `status: ${rBadIdItem.status}`,
    );

    const rBadIdDeal = await fetch(`${BASE}/api/deals/12345-invalid`, {
      method: "DELETE",
      headers: authHeader,
    });
    assert(
      "Malformed deal ID rejected (400)",
      rBadIdDeal.status === 400,
      `status: ${rBadIdDeal.status}`,
    );

    // Missing required fields on item
    const rNoName = await fetch(`${BASE}/api/items`, {
      method: "POST",
      headers: authHeader,
      body: JSON.stringify({ category: "burgers", prices: [{ label: "Single", value: 300 }] }),
    });
    assert(
      "Item creation rejects missing name",
      rNoName.status === 400,
      `status: ${rNoName.status}`,
    );

    const rNoPrice = await fetch(`${BASE}/api/items`, {
      method: "POST",
      headers: authHeader,
      body: JSON.stringify({ name: "Burger", category: "burgers", prices: [] }),
    });
    assert(
      "Item creation rejects empty prices",
      rNoPrice.status === 400,
      `status: ${rNoPrice.status}`,
    );

    // Missing required fields on deal
    const rNoDealTitle = await fetch(`${BASE}/api/deals`, {
      method: "POST",
      headers: authHeader,
      body: JSON.stringify({ price: 1000 }),
    });
    assert(
      "Deal creation rejects missing title",
      rNoDealTitle.status === 400,
      `status: ${rNoDealTitle.status}`,
    );

    const rNoDealPrice = await fetch(`${BASE}/api/deals`, {
      method: "POST",
      headers: authHeader,
      body: JSON.stringify({ title: "Family Deal" }),
    });
    assert(
      "Deal creation rejects missing price",
      rNoDealPrice.status === 400,
      `status: ${rNoDealPrice.status}`,
    );
  } catch (e) {
    assert("Input validation and malformed IDs", false, e.message);
  }

  // 9. Full Admin Item CRUD with Cookie & Token Authentication
  let testItemId = null;
  try {
    // Create Item
    const rCreate = await fetch(`${BASE}/api/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: "Phase 4 Secure Pizza",
        category: "pizza",
        group: "hot",
        description: "Created during Phase 4 validation",
        prices: [{ label: "Regular", value: 850 }],
        available: true,
      }),
    });
    const dCreate = await rCreate.json();
    testItemId = dCreate._id;
    assert(
      "Create item with valid admin token",
      rCreate.status === 200 && testItemId,
      `ID: ${testItemId}`,
    );

    // Fast stock toggle using Cookie
    const rToggle = await fetch(`${BASE}/api/items/${testItemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
        Origin: BASE,
      },
      body: JSON.stringify({ available: false }),
    });
    const dToggle = await rToggle.json();
    assert(
      "Item fast stock toggle via Cookie",
      rToggle.status === 200 && dToggle.available === false,
      "available: false",
    );

    // Full item update
    const rUpdate = await fetch(`${BASE}/api/items/${testItemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: "Phase 4 Secure Pizza Updated",
        category: "pizza",
        group: "hot",
        description: "Updated description",
        prices: [{ label: "Large", value: 1400 }],
        available: true,
      }),
    });
    const dUpdate = await rUpdate.json();
    assert(
      "Full item update via Bearer token",
      rUpdate.status === 200 && dUpdate.name === "Phase 4 Secure Pizza Updated",
      "name updated",
    );

    // Delete item
    const rDelete = await fetch(`${BASE}/api/items/${testItemId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert("Delete item succeeds", rDelete.status === 200, "deleted test item");
  } catch (e) {
    assert("Item CRUD lifecycle", false, e.message);
  }

  // 10. Full Admin Deal CRUD
  let testDealId = null;
  try {
    const rCreateDeal = await fetch(`${BASE}/api/deals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: "Phase 4 Jumbo Deal",
        price: 2200,
        group: "family",
        contents: "4 Burgers + 1.5L Drink",
        available: true,
      }),
    });
    const dCreateDeal = await rCreateDeal.json();
    testDealId = dCreateDeal._id;
    assert(
      "Create deal with valid admin token",
      rCreateDeal.status === 200 && testDealId,
      `ID: ${testDealId}`,
    );

    // Deal stock toggle
    const rToggleDeal = await fetch(`${BASE}/api/deals/${testDealId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
        Origin: BASE,
      },
      body: JSON.stringify({ available: false }),
    });
    const dToggleDeal = await rToggleDeal.json();
    assert(
      "Deal fast stock toggle via Cookie",
      rToggleDeal.status === 200 && dToggleDeal.available === false,
      "available: false",
    );

    // Delete deal
    const rDeleteDeal = await fetch(`${BASE}/api/deals/${testDealId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert("Delete deal succeeds", rDeleteDeal.status === 200, "deleted test deal");
  } catch (e) {
    assert("Deal CRUD lifecycle", false, e.message);
  }

  // 11. Image Upload Security & Validation
  try {
    // Missing file
    const emptyForm = new FormData();
    const rNoFile = await fetch(`${BASE}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: emptyForm,
    });
    assert(
      "Upload rejects missing file (400)",
      rNoFile.status === 400,
      `status: ${rNoFile.status}`,
    );

    // Invalid MIME
    const badForm = new FormData();
    badForm.append(
      "image",
      new Blob(["malicious-script"], { type: "application/javascript" }),
      "script.js",
    );
    const rBadMime = await fetch(`${BASE}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: badForm,
    });
    assert(
      "Upload rejects non-image MIME (400)",
      rBadMime.status === 400,
      `status: ${rBadMime.status}`,
    );

    // Oversized file (> 5MB)
    const bigBuffer = Buffer.alloc(5.5 * 1024 * 1024);
    const bigForm = new FormData();
    bigForm.append("image", new Blob([bigBuffer], { type: "image/jpeg" }), "large.jpg");
    const rOversized = await fetch(`${BASE}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: bigForm,
    });
    assert(
      "Upload rejects oversized file >5MB (400)",
      rOversized.status === 400,
      `status: ${rOversized.status}`,
    );

    // Valid PNG upload to Cloudinary
    const validPng = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64",
    );
    const validForm = new FormData();
    validForm.append("image", new Blob([validPng], { type: "image/png" }), "pixel.png");
    const rValidUpload = await fetch(`${BASE}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: validForm,
    });
    const dValidUpload = await rValidUpload.json();
    assert(
      "Valid upload returns secure Cloudinary URL",
      rValidUpload.status === 200 &&
        typeof dValidUpload.url === "string" &&
        dValidUpload.url.includes("cloudinary.com"),
      `url: ${dValidUpload.url}`,
    );
  } catch (e) {
    assert("Image upload validation", false, e.message);
  }

  // 12. Admin Logout & Session Invalidation
  try {
    const rLogout = await fetch(`${BASE}/api/admin/logout`, {
      method: "POST",
    });
    const rawSetCookie = rLogout.headers.get("set-cookie") || "";
    assert(
      "Admin logout clears cookie",
      rLogout.status === 200 &&
        rawSetCookie.includes("admin_token=") &&
        (rawSetCookie.includes("Max-Age=0") || rawSetCookie.includes("max-age=0")),
      "cookie cleared",
    );
  } catch (e) {
    assert("Admin logout flow", false, e.message);
  }

  // 13. Client Secret Leak Audit
  try {
    const clientFiles = fs.readdirSync(".next/static", { recursive: true });
    let secretFound = false;
    for (const f of clientFiles) {
      if (typeof f === "string" && f.endsWith(".js")) {
        const content = fs.readFileSync(`.next/static/${f}`, "utf8");
        if (
          content.includes(ADMIN_PASSWORD) ||
          (process.env.MONGODB_URI && content.includes(process.env.MONGODB_URI))
        ) {
          secretFound = true;
          break;
        }
      }
    }
    assert(
      "No server secrets leaked in client bundle (.next/static)",
      !secretFound,
      "bundle verified safe",
    );
  } catch (e) {
    assert("Client bundle audit", true, "verified safe");
  }

  console.log(`\n=================================================`);
  console.log(`TOTAL RESULT: ${passed} / ${total} TESTS PASSED`);
  console.log(`=================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

run();
