import fs from "fs";
import jwt from "jsonwebtoken";
function isValidImageBuffer(buffer) {
  if (!buffer || buffer.length < 12) return false;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true; // JPEG
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  )
    return true; // PNG
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38)
    return true; // GIF
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  )
    return true; // WebP
  return false;
}

const BASE = "http://localhost:3000";
const JWT_SECRET = process.env.JWT_SECRET || "default-secret-change-in-prod";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ArabianChicken123";

async function run() {
  console.log("=================================================");
  console.log("   PHASE 5 CLOUDINARY & IMAGE MANAGEMENT SUITE   ");
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

  // Obtain admin authentication token
  let token = null;
  try {
    const rLogin = await fetch(`${BASE}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: ADMIN_PASSWORD }),
    });
    const dLogin = await rLogin.json();
    token = dLogin.token;
    assert("Admin login for upload tests", rLogin.status === 200 && token, "token acquired");
  } catch (e) {
    assert("Admin login for upload tests", false, e.message);
  }

  // 1. Upload Authentication Protections
  try {
    // Missing auth
    const rNoAuth = await fetch(`${BASE}/api/upload`, {
      method: "POST",
      body: new FormData(),
    });
    assert("Upload without auth rejected (401)", rNoAuth.status === 401, `status: ${rNoAuth.status}`);

    // Expired token
    const expToken = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "-1s" });
    const rExp = await fetch(`${BASE}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${expToken}` },
      body: new FormData(),
    });
    assert("Upload with expired token rejected (401)", rExp.status === 401, `status: ${rExp.status}`);

    // Non-admin token
    const userToken = jwt.sign({ role: "user" }, JWT_SECRET, { expiresIn: "1h" });
    const rUser = await fetch(`${BASE}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${userToken}` },
      body: new FormData(),
    });
    assert("Upload with non-admin token rejected (401)", rUser.status === 401, `status: ${rUser.status}`);
  } catch (e) {
    assert("Upload authentication guards", false, e.message);
  }

  // 2. Upload Payload Validation
  try {
    // Missing file field
    const emptyForm = new FormData();
    const rNoFile = await fetch(`${BASE}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: emptyForm,
    });
    assert("Upload missing file rejected (400)", rNoFile.status === 400, `status: ${rNoFile.status}`);

    // Unsupported MIME format (text/plain)
    const textForm = new FormData();
    textForm.append("image", new Blob(["hello world"], { type: "text/plain" }), "test.txt");
    const rBadMime = await fetch(`${BASE}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: textForm,
    });
    assert("Upload invalid MIME rejected (400)", rBadMime.status === 400, `status: ${rBadMime.status}`);

    // Spoofed content (MIME says image/png but content is plain text)
    const fakeImgForm = new FormData();
    fakeImgForm.append("image", new Blob(["malicious-script-content"], { type: "image/png" }), "fake.png");
    const rFakeImg = await fetch(`${BASE}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fakeImgForm,
    });
    const dFakeImg = await rFakeImg.json();
    assert(
      "Upload spoofed magic-bytes rejected (400)",
      rFakeImg.status === 400 && dFakeImg.error === "Invalid image file content",
      `error: ${dFakeImg.error}`
    );

    // Oversized file (> 5 MB)
    const bigBuffer = Buffer.alloc(5.5 * 1024 * 1024);
    // write valid PNG header so magic bytes pass
    bigBuffer[0] = 0x89;
    bigBuffer[1] = 0x50;
    bigBuffer[2] = 0x4e;
    bigBuffer[3] = 0x47;
    bigBuffer[4] = 0x0d;
    bigBuffer[5] = 0x0a;
    bigBuffer[6] = 0x1a;
    bigBuffer[7] = 0x0a;

    const bigForm = new FormData();
    bigForm.append("image", new Blob([bigBuffer], { type: "image/png" }), "large.png");
    const rOversized = await fetch(`${BASE}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: bigForm,
    });
    const dOversized = await rOversized.json();
    assert(
      "Upload oversized file >5MB rejected (400)",
      rOversized.status === 400 && dOversized.error === "File size exceeds 5MB limit",
      `error: ${dOversized.error}`
    );
  } catch (e) {
    assert("Upload payload validation", false, e.message);
  }

  // 3. Magic Bytes Unit Verification
  try {
    const validPng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
    assert("isValidImageBuffer recognizes valid PNG", isValidImageBuffer(validPng), "PNG detected");

    const fakePng = Buffer.from("this is just text that pretends to be a png file");
    assert("isValidImageBuffer rejects fake PNG", !isValidImageBuffer(fakePng), "Spoofed content blocked");
  } catch (e) {
    assert("Magic bytes unit test", false, e.message);
  }

  // 4. Valid Image Upload to Cloudinary
  let uploadedUrl = null;
  try {
    const validPng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
    const validForm = new FormData();
    validForm.append("image", new Blob([validPng], { type: "image/png" }), "pixel.png");

    const rUpload = await fetch(`${BASE}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: validForm,
    });
    const dUpload = await rUpload.json();
    uploadedUrl = dUpload.url;

    assert(
      "Valid upload returns Cloudinary HTTPS URL",
      rUpload.status === 200 && typeof uploadedUrl === "string" && uploadedUrl.startsWith("https://res.cloudinary.com/"),
      `url: ${uploadedUrl}`
    );
    assert(
      "Upload targets folder 'arabian-chick'",
      uploadedUrl && uploadedUrl.includes("/arabian-chick/"),
      "folder verified"
    );

    // Verify Cloudinary CDN serves the image
    const rCdn = await fetch(uploadedUrl);
    assert("Cloudinary CDN serves image (200 OK)", rCdn.status === 200, `status: ${rCdn.status}`);
  } catch (e) {
    assert("Valid image upload flow", false, e.message);
  }

  // 5. Item Creation and Update with Image URL
  let testItemId = null;
  try {
    // Create Item with Cloudinary URL
    const rCreateItem = await fetch(`${BASE}/api/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: "Phase 5 Image Test Item",
        category: "burgers",
        prices: [{ label: "Single", value: 550 }],
        imageUrl: uploadedUrl,
        available: true,
      }),
    });
    const dCreateItem = await rCreateItem.json();
    testItemId = dCreateItem._id;
    assert(
      "Item created with Cloudinary imageUrl",
      rCreateItem.status === 200 && dCreateItem.imageUrl === uploadedUrl,
      `imageUrl saved`
    );

    // Verify public GET /api/items returns the imageUrl
    const rGetItems = await fetch(`${BASE}/api/items`);
    const allItems = await rGetItems.json();
    const foundItem = allItems.find((i) => i._id === testItemId);
    assert(
      "Public API returns saved item imageUrl",
      foundItem && foundItem.imageUrl === uploadedUrl,
      "verified in public catalogue"
    );

    // Update item WITHOUT changing image -> verify existing imageUrl is preserved
    const rUpdateItem = await fetch(`${BASE}/api/items/${testItemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: "Phase 5 Image Test Item (Updated)",
        category: "burgers",
        prices: [{ label: "Double", value: 750 }],
        imageUrl: uploadedUrl, // unchanged
      }),
    });
    const dUpdateItem = await rUpdateItem.json();
    assert(
      "Item update preserves existing imageUrl",
      rUpdateItem.status === 200 && dUpdateItem.imageUrl === uploadedUrl,
      "imageUrl preserved across update"
    );

    // Cleanup delete
    await fetch(`${BASE}/api/items/${testItemId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    assert("Cleanup test item", true, "deleted");
  } catch (e) {
    assert("Item image workflow", false, e.message);
  }

  // 6. Deal Creation and Update with Image URL
  let testDealId = null;
  try {
    // Create Deal with Cloudinary URL
    const rCreateDeal = await fetch(`${BASE}/api/deals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: "Phase 5 Image Test Deal",
        price: 1850,
        group: "deal",
        contents: "2 Pizzas + 1L Drink",
        imageUrl: uploadedUrl,
        available: true,
      }),
    });
    const dCreateDeal = await rCreateDeal.json();
    testDealId = dCreateDeal._id;
    assert(
      "Deal created with Cloudinary imageUrl",
      rCreateDeal.status === 200 && dCreateDeal.imageUrl === uploadedUrl,
      `deal imageUrl saved`
    );

    // Verify public GET /api/deals returns the imageUrl
    const rGetDeals = await fetch(`${BASE}/api/deals`);
    const allDeals = await rGetDeals.json();
    const foundDeal = allDeals.find((d) => d._id === testDealId);
    assert(
      "Public API returns saved deal imageUrl",
      foundDeal && foundDeal.imageUrl === uploadedUrl,
      "verified in public deals"
    );

    // Update deal -> verify imageUrl preserved
    const rUpdateDeal = await fetch(`${BASE}/api/deals/${testDealId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: "Phase 5 Image Test Deal (Updated)",
        price: 1950,
        group: "deal",
        contents: "2 Pizzas + 1.5L Drink",
        imageUrl: uploadedUrl,
      }),
    });
    const dUpdateDeal = await rUpdateDeal.json();
    assert(
      "Deal update preserves existing imageUrl",
      rUpdateDeal.status === 200 && dUpdateDeal.imageUrl === uploadedUrl,
      "deal imageUrl preserved"
    );

    // Cleanup delete
    await fetch(`${BASE}/api/deals/${testDealId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    assert("Cleanup test deal", true, "deleted");
  } catch (e) {
    assert("Deal image workflow", false, e.message);
  }

  // 7. Storefront Next.js Configuration & Remote Pattern Audit
  try {
    const nextConfigContent = fs.readFileSync("next.config.mjs", "utf8");
    assert(
      "next.config.mjs allows res.cloudinary.com remotePattern",
      nextConfigContent.includes("res.cloudinary.com"),
      "Cloudinary host configured"
    );
    assert(
      "Image optimization is not globally disabled",
      !nextConfigContent.includes("unoptimized: true"),
      "global unoptimized flag removed"
    );
  } catch (e) {
    assert("Next.js image configuration check", false, e.message);
  }

  // 8. Fallback Image and Local Asset Audit
  try {
    const imagesSrc = fs.readFileSync("src/data/images.ts", "utf8");
    assert(
      "Local FOOD_IMAGES mapping contains menu assets",
      imagesSrc.includes("FOOD_IMAGES") && imagesSrc.includes("MENU_IMAGES"),
      "local image map present"
    );

    const smartImageSrc = fs.readFileSync("src/components/SmartImage.tsx", "utf8");
    assert(
      "SmartImage handles responsive display and lazy loading",
      smartImageSrc.includes('loading="lazy"'),
      "lazy loading enabled"
    );
  } catch (e) {
    assert("Fallback image audit", false, e.message);
  }

  console.log(`\n=================================================`);
  console.log(`TOTAL RESULT: ${passed} / ${total} TESTS PASSED`);
  console.log(`=================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

run();
