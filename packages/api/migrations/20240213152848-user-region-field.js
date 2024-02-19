const userProfileService = require("../build/src/modules/user/services/profile/user.profile.service").default;
const geoService = require("../build/src/modules/providers/geoApi/geo.service").default;
const { connectDB } = require("../build/src/shared/MongoConnection");
const ExecutionSyncStack = require("../build/src/shared/ExecutionSyncStack").default;

module.exports = {
    async up(db) {
        // use task queue
        const collection = db.collection("users");
        await connectDB();

        const updateContactsStack = new ExecutionSyncStack(
            user => userProfileService.profileUpdate(user, user),
            100, // brevo limits calls to /contacts to 10 per second so 100 per ms https://developers.brevo.com/docs/api-limits#general-rate-limiting
        );

        await geoService.generateAndSaveEntities();
        const promises = [];

        // deduces region for decentralized agents
        const usersCursor = collection.find({ disable: { $ne: true }, decentralizedTerritory: { $exists: true } });
        for await (const user of usersCursor) {
            promises.push(updateContactsStack.addOperation(user));
        }
        await Promise.all(promises);
    },

    async down(db) {
        const collection = db.collection("users");
        collection.updateMany({}, { $unset: { region: 1 } });
    },
};
