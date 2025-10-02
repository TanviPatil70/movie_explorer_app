import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URL || process.env.MONGODB_URI;

if (!MONGO_URI) {
  throw new Error("Please define MONGO_URL in your environment variables");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend NodeJS global to have mongoose cache
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

// Initialize cache if not defined
const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

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
