// eslint-disable-next-line @typescript-eslint/no-empty-function
jest.spyOn(console, 'info').mockImplementation(() => {});

import db, { connectDB, client } from "./src/shared/MongoConnection";

beforeAll(async () => {
    await connectDB();
});

afterEach(async () => { // Clear database between test
    const collections = await db.listCollections().toArray();
    await Promise.all(collections.map(async collection => {
        await db.collection(collection.name).deleteMany({});
    }))
});

afterAll(async () => {
    client.close();
});