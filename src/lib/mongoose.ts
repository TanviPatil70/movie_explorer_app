import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URL || process.env.MONGODB_URI;

if (!MONGO_URI) {
  throw new Error("Please define MONGO_URL in your environment variables");
}

declare global {
  // Extend NodeJS global
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Use cached connection or initialize if not exist
const cached = global.mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tls: true,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

global.mongoose = cached;

export default dbConnect;
