import { MongoClient } from 'mongodb';

declare global {
  var __mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGO_URI ?? 'mongodb://localhost:27017';

if (!uri) {
  throw new Error('Missing MONGO_URI environment variable');
}

const client = new MongoClient(uri);

export const mongoClientPromise = global.__mongoClientPromise ?? client.connect();

if (process.env.NODE_ENV !== 'production') {
  global.__mongoClientPromise = mongoClientPromise;
}
