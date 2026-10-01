import "dotenv/config";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import multer from "multer";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { Item, Deal } from "./models.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

/* ---------- auth ---------- */
function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}

app.post("/api/admin/login", (req, res) => {
  if (req.body?.password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Wrong password" });
  }
  const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
});

/* ---------- public (customers) ---------- */
app.get("/api/items", async (_req, res) => {
  res.json(await Item.find().sort({ order: 1, createdAt: 1 }));
});
app.get("/api/deals", async (_req, res) => {
  res.json(await Deal.find().sort({ order: 1, createdAt: 1 }));
});

/* ---------- admin: items ---------- */
app.post("/api/items", requireAdmin, async (req, res) => {
  const body = req.body;
  body.slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
  res.json(await Item.create(body));
});
app.put("/api/items/:id", requireAdmin, async (req, res) => {
  res.json(await Item.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});
app.delete("/api/items/:id", requireAdmin, async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

/* ---------- admin: deals ---------- */
app.post("/api/deals", requireAdmin, async (req, res) => {
  const body = req.body;
  body.slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
  res.json(await Deal.create(body));
});
app.put("/api/deals/:id", requireAdmin, async (req, res) => {
  res.json(await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});
app.delete("/api/deals/:id", requireAdmin, async (req, res) => {
  await Deal.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

/* ---------- admin: image upload ---------- */
app.post("/api/upload", requireAdmin, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file" });
  cloudinary.uploader
    .upload_stream({ folder: "arabian-chick" }, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ url: result.secure_url });
    })
    .end(req.file.buffer);
});

await mongoose.connect(process.env.MONGODB_URI);
app.listen(4000, () => console.log("API running on http://localhost:4000"));