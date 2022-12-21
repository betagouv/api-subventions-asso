// eslint-disable-next-line @typescript-eslint/no-var-requires
const { connectDB } = require("../build/src/shared/MongoConnection");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ACCEPTED_EMAIL_DOMAIN } = require("../build/src/configurations/auth.conf");

module.exports = {
    async up(db, client) {
        await connectDB();
        const collection = db.collection("email-domains");
        const domains = ACCEPTED_EMAIL_DOMAIN.map(domain => ({ domain }));
        await collection.insertMany(domains);
        await collection.createIndex({ domain: 1 }, { unique: true });
    }
};
