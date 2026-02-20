import { Db, MongoClient } from "mongodb";

const dbName = process.env.MONGODB_DB || "elevateatletism";

type GlobalMongo = typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
  _inMemoryDb?: Map<string, any[]>;
};

const globalWithMongo = globalThis as GlobalMongo;

// Minimal in-memory collection cursor helpers to satisfy common patterns used
function createCursor(arr: any[]) {
  let items = arr.slice();
  return {
    sort(spec: Record<string, number>) {
      const key = Object.keys(spec)[0];
      const dir = spec[key] === -1 ? -1 : 1;
      items.sort((a: any, b: any) => (a[key] > b[key] ? dir : a[key] < b[key] ? -dir : 0));
      return this;
    },
    limit(n: number) {
      items = items.slice(0, n);
      return this;
    },
    toArray() {
      return Promise.resolve(items.slice());
    },
  };
}

function matchesFilter(obj: any, filter: any) {
  if (!filter || Object.keys(filter).length === 0) return true;
  for (const k of Object.keys(filter)) {
    const v = filter[k];
    if (v && typeof v === 'object' && v.$in) {
      if (!v.$in.includes(obj[k])) return false;
    } else if (obj[k] !== v) return false;
  }
  return true;
}

class InMemoryDb {
  private store: Map<string, any[]>;
  constructor(store?: Map<string, any[]>) {
    this.store = store || new Map();
  }
  collection(name: string) {
    if (!this.store.has(name)) this.store.set(name, []);
    const arr = this.store.get(name)!;
    return {
      find: (filter: any = {}) => createCursor(arr.filter((d: any) => matchesFilter(d, filter))),
      findOne: (filter: any = {}) => Promise.resolve(arr.find((d: any) => matchesFilter(d, filter)) || null),
      insertOne: (doc: any) => {
        const copy = { ...doc };
        if (!copy._id) copy._id = `${Date.now()}_${Math.random().toString(36).slice(2,9)}`;
        arr.unshift(copy);
        return Promise.resolve({ insertedId: copy._id });
      },
      insertMany: (docs: any[]) => {
        const insertedIds: Record<number, string> = {};
        docs.forEach((doc, index) => {
          const copy = { ...doc };
          if (!copy._id) copy._id = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
          arr.unshift(copy);
          insertedIds[index] = copy._id;
        });
        return Promise.resolve({ insertedCount: docs.length, insertedIds });
      },
      countDocuments: (filter: any = {}) => {
        return Promise.resolve(arr.filter((d: any) => matchesFilter(d, filter)).length);
      },
      deleteMany: (filter: any = {}) => {
        const before = arr.length;
        for (let i = arr.length - 1; i >= 0; i--) if (matchesFilter(arr[i], filter)) arr.splice(i, 1);
        return Promise.resolve({ deletedCount: before - arr.length });
      },
      deleteOne: (filter: any = {}) => {
        const idx = arr.findIndex((d:any) => matchesFilter(d, filter));
        if (idx >= 0) { arr.splice(idx,1); return Promise.resolve({ deletedCount: 1 }); }
        return Promise.resolve({ deletedCount: 0 });
      },
      updateOne: (filter: any = {}, update: any = {}) => {
        const idx = arr.findIndex((d:any) => matchesFilter(d, filter));
        if (idx >= 0) {
          if (update.$set) arr[idx] = { ...arr[idx], ...update.$set };
          return Promise.resolve({ matchedCount: 1, modifiedCount: 1 });
        }
        return Promise.resolve({ matchedCount: 0, modifiedCount: 0 });
      },
    };
  }
}

export async function getDb(): Promise<Db | InMemoryDb> {
  const uri = process.env.MONGODB_URI;
  // Allow forcing the in-memory DB for local development/testing.
  if (String(process.env.MONGODB_FORCE_INMEMORY || "").toLowerCase() === "true") {
    if (!globalWithMongo._inMemoryDb) globalWithMongo._inMemoryDb = new Map();
    return new InMemoryDb(globalWithMongo._inMemoryDb);
  }
  if (!uri) {
    if (!globalWithMongo._inMemoryDb) globalWithMongo._inMemoryDb = new Map();
    return new InMemoryDb(globalWithMongo._inMemoryDb);
  }

  // Provide an opt-in insecure TLS mode for local development when the
  // environment cannot complete the TLS handshake with the remote server
  // (e.g. corporate TLS interception, self-signed certs). Set
  // `MONGODB_ALLOW_INVALID_TLS=true` to enable. This should NEVER be used
  // in production.
  const allowInvalid = String(process.env.MONGODB_ALLOW_INVALID_TLS || "").toLowerCase() === "true";

  if (!globalWithMongo._mongoClientPromise) {
    const opts: any = {};
    if (allowInvalid) {
      opts.tls = true;
      // Driver accepts these flags to allow invalid certs/hostnames.
      opts.tlsAllowInvalidCertificates = true;
      opts.tlsAllowInvalidHostnames = true;
    }

    const client = new MongoClient(uri, opts);
    // Try to connect but if it fails due to TLS/Network issues, fall back
    // to the in-memory DB so the app can still run for local development.
    globalWithMongo._mongoClientPromise = client.connect().catch((err) => {
      // eslint-disable-next-line no-console
      console.error("MongoClient connect failed, falling back to in-memory DB:", err?.message || err);
      // clear the promise so subsequent calls return in-memory DB
      delete globalWithMongo._mongoClientPromise;
      if (!globalWithMongo._inMemoryDb) globalWithMongo._inMemoryDb = new Map();
      // throw to allow caller to handle — we'll return in-memory below
      throw err;
    });
  }

  try {
    const client = await globalWithMongo._mongoClientPromise!;
    return client.db(process.env.MONGODB_DB || dbName);
  } catch (e) {
    // If a connection error occurred, use the in-memory fallback.
    if (!globalWithMongo._inMemoryDb) globalWithMongo._inMemoryDb = new Map();
    return new InMemoryDb(globalWithMongo._inMemoryDb);
  }
}
