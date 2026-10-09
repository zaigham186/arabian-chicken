import mongoose from "mongoose";

const MONGODB_URI = process.env["MONGODB_URI"];

if (!MONGODB_URI) {
  console.warn("MONGODB_URI is not defined in environment variables");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseConnection: MongooseCache | undefined;
}

const cached: MongooseCache =
  global.mongooseConnection || (global.mongooseConnection = { conn: null, promise: null });

export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from environment variables");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

/* ---------------- Models with recompilation protection ---------------- */

const priceSchema = new mongoose.Schema({ label: String, value: Number }, { _id: false });

const itemSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true },
    name: String,
    category: String,
    group: String,
    description: String,
    tag: String,
    imageUrl: String,
    prices: [priceSchema],
    available: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const dealSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true },
    badge: String,
    title: String,
    contents: String,
    price: Number,
    group: String, // "deal" | "double" | "family"
    imageUrl: String,
    available: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Item: mongoose.Model<any> =
  (mongoose.models["Item"] as mongoose.Model<any>) || mongoose.model("Item", itemSchema);

export const Deal: mongoose.Model<any> =
  (mongoose.models["Deal"] as mongoose.Model<any>) || mongoose.model("Deal", dealSchema);
