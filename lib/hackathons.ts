import { mongoClientPromise } from '@/lib/mongo';

export type HackathonRecord = {
  name: string;
  startdate: string;
  enddate: string;
  location?: string;
  hybridinfo?: string;
  url?: string;
  bgimage?: string;
  fgimage?: string;
  source?: string;
  event_key: string;
};

const DB_NAME = process.env.MONGO_DB_NAME ?? 'hackathons';
const COLLECTION_NAME = process.env.MONGO_COLLECTION_NAME ?? 'events';

export async function getHackathons(): Promise<HackathonRecord[]> {
  const client = await mongoClientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  const docs = await collection
    .find({})
    .sort({ startdate: 1, name: 1 })
    .project({
      _id: 0,
      name: 1,
      startdate: 1,
      enddate: 1,
      location: 1,
      hybridinfo: 1,
      url: 1,
      bgimage: 1,
      fgimage: 1,
      source: 1,
      event_key: 1,
    })
    .toArray();

  return docs.map((doc) => ({
    name: String(doc.name ?? ''),
    startdate: String(doc.startdate ?? ''),
    enddate: String(doc.enddate ?? ''),
    location: doc.location ? String(doc.location) : undefined,
    hybridinfo: doc.hybridinfo ? String(doc.hybridinfo) : undefined,
    url: doc.url ? String(doc.url) : undefined,
    bgimage: doc.bgimage ? String(doc.bgimage) : undefined,
    fgimage: doc.fgimage ? String(doc.fgimage) : undefined,
    source: doc.source ? String(doc.source) : undefined,
    event_key: String(doc.event_key ?? ''),
  }));
}
