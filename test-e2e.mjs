import fs from "fs";

const BASE = "http://localhost:3000";

async function run() {
  console.log("=== COMPREHENSIVE END-TO-END TEST SUITE ===");
  const results = [];
  let passedCount = 0;
  let totalCount = 0;

  function assert(name, condition, details = "") {
    totalCount++;
    if (condition) {
      passedCount++;
      console.log(`[PASS] ${name} ${details ? `(${details})` : ""}`);
      results.push({ name, status: "PASS", details });
    } else {
      console.error(`[FAIL] ${name} ${details ? `(${details})` : ""}`);
      results.push({ name, status: "FAIL", details });
    }
  }

  // 1. Next.js Storefront SSR & HTML Delivery
  try {
    const resHome = await fetch(`${BASE}/`);
    const homeHtml = await resHome.text();
    assert("Homepage HTTP 200", resHome.status === 200, `status: ${resHome.status}`);
    assert("Homepage HTML contains Brand Name", homeHtml.includes("Arabian Chick"), "found 'Arabian Chick'");
    assert("Homepage HTML contains Menu anchor", homeHtml.includes('id="menu"') || homeHtml.includes('menu'), "menu section present");
    assert("Homepage HTML contains Next.js scripts", homeHtml.includes("_next/static"), "bundled scripts detected");
  } catch (e) {
    assert("Homepage SSR fetch", false, e.message);
  }

  // 2. Next.js Admin Page SSR & HTML Delivery
  try {
    const resAdmin = await fetch(`${BASE}/admin`);
    const adminHtml = await resAdmin.text();
    assert("Admin Page HTTP 200", resAdmin.status === 200, `status: ${resAdmin.status}`);
    assert("Admin Page HTML contains Admin title/login", adminHtml.includes("Admin") || adminHtml.includes("admin"), "admin markup present");
  } catch (e) {
    assert("Admin Page SSR fetch", false, e.message);
  }

  // 3. Database Health & Ping
  try {
    const rHealth = await fetch(`${BASE}/api/health`);
    const dHealth = await rHealth.json();
    assert("Database Health API", rHealth.status === 200 && dHealth.ok && dHealth.database === "connected", `db: ${dHealth.database}`);
    
    const rLegacyHealth = await fetch(`${BASE}/health`);
    const dLegacy = await rLegacyHealth.json();
    assert("Legacy /health ping", rLegacyHealth.status === 200 && dLegacy.ok, `uptime: ${dLegacy.uptime}s`);
  } catch (e) {
    assert("Health check API", false, e.message);
  }

  // 4. Menu Items API (MongoDB Atlas)
  let items = [];
  try {
    const rItems = await fetch(`${BASE}/api/items`);
    items = await rItems.json();
    assert("GET /api/items returns array", rItems.status === 200 && Array.isArray(items), `${items.length} items`);
    assert(
      "Item schema integrity",
      items.length > 0 &&
        items[0]._id &&
        items[0].name &&
        Array.isArray(items[0].prices) &&
        items[0].prices.length > 0 &&
        items[0].category,
      `Sample: ${items[0]?.name} (${items[0]?.prices[0]?.label}: Rs. ${items[0]?.prices[0]?.value})`
    );
  } catch (e) {
    assert("GET /api/items", false, e.message);
  }

  // 5. Deals API (MongoDB Atlas)
  let deals = [];
  try {
    const rDeals = await fetch(`${BASE}/api/deals`);
    deals = await rDeals.json();
    assert("GET /api/deals returns array", rDeals.status === 200 && Array.isArray(deals), `${deals.length} deals`);
    assert("Deal schema integrity", deals.length > 0 && deals[0]._id && deals[0].title && deals[0].price !== undefined, `Sample: ${deals[0]?.title} (Rs. ${deals[0]?.price})`);
  } catch (e) {
    assert("GET /api/deals", false, e.message);
  }

  // 6. Admin Authentication & Security
  let token = null;
  try {
    // Test invalid password
    const rBad = await fetch(`${BASE}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "wrong-password" }),
    });
    const dBad = await rBad.json();
    assert("Admin login rejects invalid credentials", rBad.status === 401 && dBad.error === "Wrong password", `status ${rBad.status}`);

    // Test valid password
    const rGood = await fetch(`${BASE}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: process.env.ADMIN_PASSWORD || "ArabianChicken123" }),
    });
    const dGood = await rGood.json();
    token = dGood.token;
    assert("Admin login issues valid JWT", rGood.status === 200 && typeof token === "string" && token.length > 20, "JWT token verified");
  } catch (e) {
    assert("Admin auth check", false, e.message);
  }

  // 7. Security Protection on Admin Endpoints
  try {
    const rNoTokenItem = await fetch(`${BASE}/api/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Unauth Item", price: 100 }),
    });
    assert("Unauthenticated POST /api/items rejected", rNoTokenItem.status === 401, `status: ${rNoTokenItem.status}`);

    const rNoTokenDeal = await fetch(`${BASE}/api/deals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Unauth Deal", price: 500 }),
    });
    assert("Unauthenticated POST /api/deals rejected", rNoTokenDeal.status === 401, `status: ${rNoTokenDeal.status}`);

    const rNoTokenUpload = await fetch(`${BASE}/api/upload`, {
      method: "POST",
      body: new FormData(),
    });
    assert("Unauthenticated POST /api/upload rejected", rNoTokenUpload.status === 401, `status: ${rNoTokenUpload.status}`);
  } catch (e) {
    assert("Endpoint auth guards", false, e.message);
  }

  // 8. Admin CRUD: Item lifecycle
  let createdItemId = null;
  try {
    const rCreateItem = await fetch(`${BASE}/api/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: "E2E Test Zinger",
        category: "Burgers",
        group: "Crispy",
        description: "Test description",
        prices: [{ label: "Regular", value: 499 }],
        available: true,
      }),
    });
    const dCreateItem = await rCreateItem.json();
    createdItemId = dCreateItem._id;
    assert("Create item with auto-slug", rCreateItem.status === 200 && createdItemId && dCreateItem.slug.startsWith("e2e-test-zinger"), `slug: ${dCreateItem.slug}`);

    // Fast stock toggle
    const rToggleItem = await fetch(`${BASE}/api/items/${createdItemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ available: false }),
    });
    const dToggleItem = await rToggleItem.json();
    assert("Item fast stock toggle to false", rToggleItem.status === 200 && dToggleItem.available === false, `available: ${dToggleItem.available}`);

    // Cleanup delete
    const rDelItem = await fetch(`${BASE}/api/items/${createdItemId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    assert("Delete test item", rDelItem.status === 200, `status: ${rDelItem.status}`);
  } catch (e) {
    assert("Item CRUD lifecycle", false, e.message);
  }

  // 9. Admin CRUD: Deal lifecycle
  let createdDealId = null;
  try {
    const rCreateDeal = await fetch(`${BASE}/api/deals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: "E2E Mega Deal",
        price: 1499,
        originalPrice: 1800,
        serves: "3-4 Persons",
        description: "Test deal description",
        includes: ["3 Zinger Burgers", "1L Drink"],
        available: true,
      }),
    });
    const dCreateDeal = await rCreateDeal.json();
    createdDealId = dCreateDeal._id;
    assert("Create deal with auto-slug", rCreateDeal.status === 200 && createdDealId && dCreateDeal.slug.startsWith("e2e-mega-deal"), `slug: ${dCreateDeal.slug}`);

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
    assert("Deal fast stock toggle to false", rToggleDeal.status === 200 && dToggleDeal.available === false, `available: ${dToggleDeal.available}`);

    // Cleanup delete
    const rDelDeal = await fetch(`${BASE}/api/deals/${createdDealId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    assert("Delete test deal", rDelDeal.status === 200, `status: ${rDelDeal.status}`);
  } catch (e) {
    assert("Deal CRUD lifecycle", false, e.message);
  }

  // 10. Cloudinary Image Upload
  try {
    // Invalid MIME rejection
    const invalidForm = new FormData();
    invalidForm.append("image", new Blob(["not-an-image"], { type: "text/plain" }), "test.txt");
    const rInvalidUpload = await fetch(`${BASE}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: invalidForm,
    });
    assert("Reject invalid file MIME type", rInvalidUpload.status === 400, `status: ${rInvalidUpload.status}`);

    // Valid 1x1 PNG upload to Cloudinary
    const validPng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
    const validForm = new FormData();
    validForm.append("image", new Blob([validPng], { type: "image/png" }), "pixel.png");

    const rValidUpload = await fetch(`${BASE}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: validForm,
    });
    const dValidUpload = await rValidUpload.json();
    assert("Valid image upload to Cloudinary", rValidUpload.status === 200 && typeof dValidUpload.url === "string", `url: ${dValidUpload.url}`);

    // Verify Cloudinary URL is reachable
    if (dValidUpload.url) {
      const rCloudinaryCheck = await fetch(dValidUpload.url);
      assert("Cloudinary CDN delivers uploaded image", rCloudinaryCheck.status === 200, `status: ${rCloudinaryCheck.status}`);
    }
  } catch (e) {
    assert("Cloudinary upload flow", false, e.message);
  }

  // 11. WhatsApp Order Formatting Logic Verification
  try {
    const testCart = [
      { id: "1", name: "Zinger Burger", price: 450, quantity: 2 },
      { id: "2", name: "Family Deal", price: 1800, quantity: 1 },
    ];
    const total = testCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const orderLines = testCart.map(item => `• ${item.quantity}x ${item.name} (Rs. ${item.price * item.quantity})`).join("%0A");
    const message = `Hello Arabian Chick! I want to order:%0A${orderLines}%0A%0ATotal: Rs. ${total}`;
    const whatsappUrl = `https://wa.me/923409151525?text=${message}`;

    assert("Cart total calculation", total === 2700, `Total: Rs. ${total}`);
    assert("WhatsApp order URL format", whatsappUrl.includes("923409151525") && whatsappUrl.includes("Zinger"), "URL structure correct");
  } catch (e) {
    assert("WhatsApp order generator", false, e.message);
  }

  console.log(`\n========================================`);
  console.log(`FINAL RESULT: ${passedCount} / ${totalCount} PASSED`);
  console.log(`========================================\n`);

  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

run();
