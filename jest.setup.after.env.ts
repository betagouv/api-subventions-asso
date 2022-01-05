// eslint-disable-next-line @typescript-eslint/no-empty-function
jest.spyOn(console, 'info').mockImplementation(() => {});

import db from "./src/shared/MongoConnection";


afterEach(async () => { // Clear database between test
    const collections = await db.listCollections().toArray();
    await Promise.all(collections.map(async collection => {
        await db.collection(collection.name).deleteMany({});
    }))
});