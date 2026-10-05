import "dotenv/config";
import crypto from "node:crypto";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import multer from "multer";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { Item, Deal } from "./models.js";

const {
  MONGODB_URI,
  JWT_SECRET,
  ADMIN_PASSWORD,
  CLIENT_ORIGIN,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  PORT = 4000,
} = process.env;

for (const [k, v] of Object.entries({ MONGODB_URI, JWT_SECRET, ADMIN_PASSWORD, CLIENT_ORIGIN })) {
  if (!v) {
    console.error(`Missing env variable: ${k}`);
    process.exit(1);
  }
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const app = express();
app.set("trust proxy", 1); // Render proxy ke peeche hai
app.use(helmet());
app.use(
  cors({
    origin: CLIENT_ORIGIN.split(",").map((s) => s.trim()),
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use(express.json({ limit: "100kb" }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) =>
    cb(null, /^image\/(jpeg|png|webp|avif|gif)$/.test(file.mimetype)),
});

/* ---------- helpers ---------- */
const bad = (res, msg) => res.status(400).json({ error: msg });
const str = (v, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : undefined);

function safeEqual(a, b) {
  const x = crypto.createHash("sha256").update(String(a)).digest();
  const y = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
}

function cleanItem(b) {
  const prices = Array.isArray(b.prices)
    ? b.prices
        .map((p) => ({ label: str(p?.label, 40), value: Number(p?.value) }))
        .filter((p) => p.label && Number.isFinite(p.value) && p.value >= 0)
    : [];
  const name = str(b.name, 120);
  if (!name) return { error: "Name is required" };
  if (!str(b.category, 40)) return { error: "Category is required" };
  if (prices.length === 0) return { error: "At least one valid price is required" };
  return {
    data: {
      name,
      category: str(b.category, 40),
      group: str(b.group, 20),
      description: str(b.description, 500),
      tag: str(b.tag, 40),
      imageUrl: str(b.imageUrl, 500),
      prices,
      available: b.available !== false,
      ...(Number.isFinite(Number(b.order)) && b.order !== "" ? { order: Number(b.order) } : {}),
    },
  };
}

function cleanDeal(b) {
  const title = str(b.title, 120);
  const price = Number(b.price);
  if (!title) return { error: "Title is required" };
  if (!Number.isFinite(price) || price < 0) return { error: "Valid price is required" };
  return {
    data: {
      title,
      badge: str(b.badge, 60),
      contents: str(b.contents, 400) ?? "",
      price,
      group: ["deal", "double", "family"].includes(b.group) ? b.group : "deal",
      imageUrl: str(b.imageUrl, 500),
      available: b.available !== false,
      ...(Number.isFinite(Number(b.order)) && b.order !== "" ? { order: Number(b.order) } : {}),
    },
  };
}

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const validId = (req, res, next) =>
  mongoose.isValidObjectId(req.params.id) ? next() : bad(res, "Invalid id");

/* ---------- auth ---------- */
function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}

app.use(
  "/api/admin/login",
  rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { error: "Too many attempts, try later" } }),
);

app.post("/api/admin/login", (req, res) => {
  if (!safeEqual(req.body?.password ?? "", ADMIN_PASSWORD)) {
    return res.status(401).json({ error: "Wrong password" });
  }
  const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
});

/* ---------- health (UptimeRobot / Render ke liye) ---------- */
app.get("/health", (_req, res) => res.json({ ok: true }));

/* ---------- public ---------- */
app.get("/api/items", async (_req, res) => {
  res.json(await Item.find().sort({ order: 1, createdAt: 1 }));
});
app.get("/api/deals", async (_req, res) => {
  res.json(await Deal.find().sort({ order: 1, createdAt: 1 }));
});

/* ---------- admin: items ---------- */
app.post("/api/items", requireAdmin, async (req, res) => {
  const { data, error } = cleanItem(req.body);
  if (error) return bad(res, error);
  const slug = `${slugify(data.name)}-${Date.now()}`;
  res.json(await Item.create({ ...data, slug }));
});
app.put("/api/items/:id", requireAdmin, validId, async (req, res) => {
  // Sirf available toggle (sold out) ke liye poori validation nahi chahiye
  const keys = Object.keys(req.body);
  if (keys.length === 1 && keys[0] === "available") {
    return res.json(
      await Item.findByIdAndUpdate(req.params.id, { available: !!req.body.available }, { new: true }),
    );
  }
  const { data, error } = cleanItem(req.body);
  if (error) return bad(res, error);
  const updated = await Item.findByIdAndUpdate(req.params.id, data, { new: true });
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json(updated);
});
app.delete("/api/items/:id", requireAdmin, validId, async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

/* ---------- admin: deals ---------- */
app.post("/api/deals", requireAdmin, async (req, res) => {
  const { data, error } = cleanDeal(req.body);
  if (error) return bad(res, error);
  const slug = `${slugify(data.title)}-${Date.now()}`;
  res.json(await Deal.create({ ...data, slug }));
});
app.put("/api/deals/:id", requireAdmin, validId, async (req, res) => {
  const keys = Object.keys(req.body);
  if (keys.length === 1 && keys[0] === "available") {
    return res.json(
      await Deal.findByIdAndUpdate(req.params.id, { available: !!req.body.available }, { new: true }),
    );
  }
  const { data, error } = cleanDeal(req.body);
  if (error) return bad(res, error);
  const updated = await Deal.findByIdAndUpdate(req.params.id, data, { new: true });
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json(updated);
});
app.delete("/api/deals/:id", requireAdmin, validId, async (req, res) => {
  await Deal.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

/* ---------- admin: image upload ---------- */
app.post("/api/upload", requireAdmin, upload.single("image"), (req, res) => {
  if (!req.file) return bad(res, "Please choose a valid image (jpg, png, webp, avif)");
  cloudinary.uploader
    .upload_stream({ folder: "arabian-chick" }, (err, result) => {
      if (err) return res.status(500).json({ error: "Upload failed" });
      res.json({ url: result.secure_url });
    })
    .end(req.file.buffer);
});

/* ---------- errors ---------- */
app.use((_req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => app.listen(PORT, () => console.log(`API running on port ${PORT}`)))
  .catch((e) => {
    console.error("Mongo error:", e.message);
    process.exit(1);
  });