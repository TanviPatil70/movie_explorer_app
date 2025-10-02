import { MongoClient, MongoClientOptions } from "mongodb";

const uri = process.env.MONGO_URL || process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    "❌ MongoDB connection string not found. Please define MONGO_URL or MONGODB_URI in your environment variables."
  );
}

const options: MongoClientOptions = {
  tls: true, // keep this only if your MongoDB Atlas requires TLS (usually yes)
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Use cached connection in development to avoid too many open handles
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
