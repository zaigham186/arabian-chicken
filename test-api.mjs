const BASE = "http://localhost:3000";

async function runTests() {
  const results = [];
  function log(name, passed, details = "") {
    results.push({ name, passed, details });
    console.log(`${passed ? " PASS" : " FAIL"}: ${name} ${details ? `(${details})` : ""}`);
  }

  try {
    // 1. Health check
    const rHealth = await fetch(`${BASE}/api/health`);
    const dHealth = await rHealth.json();
    log("GET /api/health", rHealth.status === 200 && dHealth.ok === true, `status ${rHealth.status}, db: ${dHealth.database}`);

    // 2. Legacy health check
    const rLegacyHealth = await fetch(`${BASE}/health`);
    const dLegacyHealth = await rLegacyHealth.json();
    log("GET /health", rLegacyHealth.status === 200 && dLegacyHealth.ok === true, `status ${rLegacyHealth.status}`);

    // 3. GET /api/items
    const rItems = await fetch(`${BASE}/api/items`);
    const dItems = await rItems.json();
    log("GET /api/items", rItems.status === 200 && Array.isArray(dItems), `status ${rItems.status}, items count: ${dItems.length}`);

    // 4. GET /api/deals
    const rDeals = await fetch(`${BASE}/api/deals`);
    const dDeals = await rDeals.json();
    log("GET /api/deals", rDeals.status === 200 && Array.isArray(dDeals), `status ${rDeals.status}, deals count: ${dDeals.length}`);

    // 5. Admin login invalid credentials
    const rBadLogin = await fetch(`${BASE}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "wrong-password" }),
    });
    const dBadLogin = await rBadLogin.json();
    log("POST /api/admin/login (invalid)", rBadLogin.status === 401 && dBadLogin.error === "Wrong password", `status ${rBadLogin.status}`);

    // 6. Admin login valid credentials
    const rGoodLogin = await fetch(`${BASE}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: process.env.ADMIN_PASSWORD || "ArabianChicken123" }),
    });
    const dGoodLogin = await rGoodLogin.json();
    const token = dGoodLogin.token;
    log("POST /api/admin/login (valid)", rGoodLogin.status === 200 && typeof token === "string", `status ${rGoodLogin.status}, token issued`);

    // 7. Unauthorized protections
    const rUnauthItem = await fetch(`${BASE}/api/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Hacker Pizza", category: "pizza", prices: [{ label: "S", value: 100 }] }),
    });
    log("POST /api/items (no token rejected)", rUnauthItem.status === 401, `status ${rUnauthItem.status}`);

    const rUnauthUpload = await fetch(`${BASE}/api/upload`, { method: "POST" });
    log("POST /api/upload (no token rejected)", rUnauthUpload.status === 401, `status ${rUnauthUpload.status}`);

    // 8. CRUD Item
    let createdItemId = null;
    const rCreateItem = await fetch(`${BASE}/api/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: "Test Migration Pizza",
        category: "pizza",
        group: "hot",
        description: "Automated test item",
        prices: [{ label: "Regular", value: 750 }],
        available: true,
      }),
    });
    const dCreateItem = await rCreateItem.json();
    createdItemId = dCreateItem._id;
    log("POST /api/items (create test item)", rCreateItem.status === 200 && createdItemId, `created ID ${createdItemId}`);

    // 9. Stock toggle on Item
    const rToggleItem = await fetch(`${BASE}/api/items/${createdItemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ available: false }),
    });
    const dToggleItem = await rToggleItem.json();
    log("PUT /api/items/:id (stock toggle)", rToggleItem.status === 200 && dToggleItem.available === false, `available set to false`);

    // 10. Delete test item
    const rDeleteItem = await fetch(`${BASE}/api/items/${createdItemId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const dDeleteItem = await rDeleteItem.json();
    log("DELETE /api/items/:id", rDeleteItem.status === 200 && dDeleteItem.ok === true, `status ${rDeleteItem.status}`);

    // 11. CRUD Deal
    let createdDealId = null;
    const rCreateDeal = await fetch(`${BASE}/api/deals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: "Test Migration Combo",
        badge: "Test Deal",
        contents: "1 Test Burger + 1 Drink",
        price: 999,
        group: "deal",
        available: true,
      }),
    });
    const dCreateDeal = await rCreateDeal.json();
    createdDealId = dCreateDeal._id;
    log("POST /api/deals (create test deal)", rCreateDeal.status === 200 && createdDealId, `created ID ${createdDealId}`);

    // 12. Stock toggle on Deal
    const rToggleDeal = await fetch(`${BASE}/api/deals/${createdDealId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ available: false }),
    });
    const dToggleDeal = await rToggleDeal.json();
    log("PUT /api/deals/:id (stock toggle)", rToggleDeal.status === 200 && dToggleDeal.available === false, `available set to false`);

    // 13. Delete test deal
    const rDeleteDeal = await fetch(`${BASE}/api/deals/${createdDealId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const dDeleteDeal = await rDeleteDeal.json();
    log("DELETE /api/deals/:id", rDeleteDeal.status === 200 && dDeleteDeal.ok === true, `status ${rDeleteDeal.status}`);

    // 14. Upload invalid MIME test
    const textFormData = new FormData();
    textFormData.append("image", new Blob(["not an image"], { type: "text/plain" }), "test.txt");
    const rBadUpload = await fetch(`${BASE}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: textFormData,
    });
    log("POST /api/upload (invalid MIME rejected)", rBadUpload.status === 400, `status ${rBadUpload.status}`);

    // 15. Upload valid small image test (1x1 transparent PNG)
    const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    const pngBuffer = Buffer.from(pngBase64, "base64");
    const imgFormData = new FormData();
    imgFormData.append("image", new Blob([pngBuffer], { type: "image/png" }), "test.png");
    const rGoodUpload = await fetch(`${BASE}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: imgFormData,
    });
    const dGoodUpload = await rGoodUpload.json();
    log("POST /api/upload (valid PNG to Cloudinary)", rGoodUpload.status === 200 && typeof dGoodUpload.url === "string", `url: ${dGoodUpload.url}`);

    console.log("\n--- TEST SUMMARY ---");
    const passedCount = results.filter((r) => r.passed).length;
    console.log(`Passed: ${passedCount} / ${results.length}`);
  } catch (err) {
    console.error("Test execution exception:", err);
  }
}

runTests();
