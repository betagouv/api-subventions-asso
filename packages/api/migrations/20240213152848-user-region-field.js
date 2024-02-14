const userProfileService = require("../build/src/modules/user/services/profile/user.profile.service").default;
const geoService = require("../build/src/modules/providers/geoApi/geo.service").default;
const { connectDB } = require("../build/src/shared/MongoConnection");

module.exports = {
    async up(db) {
        const collection = db.collection("users");
        await connectDB();

        await geoService.generateAndSaveEntities();

        // deduces region for decentralized agents
        const usersCursor = collection.find({ disable: { $ne: true }, decentralizedTerritory: { $exists: true } });
        for await (const user of usersCursor) {
            await userProfileService.profileUpdate(user, user);
        }
    },

    async down(db) {
        const collection = db.collection("users");
        collection.updateMany({}, { $unset: { region: 1 } });
    },
};
