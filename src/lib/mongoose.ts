import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URL || process.env.MONGODB_URI;

if (!MONGO_URI) {
  throw new Error("Please define MONGO_URL or MONGODB_URI environment variable");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  // Type assertion here ensures MONGO_URI is string
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI as string, {
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
