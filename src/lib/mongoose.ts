import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URL || process.env.MONGODB_URI;

if (!MONGO_URI) {
  throw new Error(
    "❌ MongoDB connection string not found. Please define MONGO_URL or MONGODB_URI in your environment variables."
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Prevent Next.js hot reload issues in dev
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    // ✅ Add "as string" so TS knows it's not undefined
    cached.promise = mongoose.connect(MONGO_URI as string, {
      tls: true, // keep if your Atlas cluster requires it
    });
  }

  cached.conn = await cached.promise;
  global.mongooseCache = cached;

  return cached.conn;
}

export default dbConnect;
