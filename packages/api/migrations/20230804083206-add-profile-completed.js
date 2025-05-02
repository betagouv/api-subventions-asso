const { connectDB } = require("../build/src/shared/MongoConnection");

module.exports = {
    async up(db) {
        await connectDB();

        await db.collection("users").updateMany({}, { $set: { profileToComplete: false } });
    },
};
