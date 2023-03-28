// eslint-disable-next-line @typescript-eslint/no-var-requires
const { connectDB } = require("../build/src/shared/MongoConnection");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ACCEPTED_EMAIL_DOMAINS } = require("../build/src/configurations/auth.conf");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { CONFIGURATION_NAMES } = require("../build/src/modules/configurations/configurations.service.js");

module.exports = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async up(db, client) {
        await connectDB();
        const collection = db.collection("configurations");
        collection.createIndex({ name: 1 });
        collection.insertOne({
            name: CONFIGURATION_NAMES.ACCEPTED_EMAIL_DOMAINS,
            data: ACCEPTED_EMAIL_DOMAINS,
            updatedAt: new Date()
        });
    }
};
