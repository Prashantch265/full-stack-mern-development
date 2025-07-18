import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

// Before all tests run, create a new in-memory server and connect Mongoose to it.
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// After all tests have run, disconnect Mongoose and stop the in-memory server.
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Before each test, clear all data from every collection.
// This ensures each test starts with a clean slate.
beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
});
