/* eslint-disable @typescript-eslint/no-var-requires */
const { connectDB } = require("../build/src/shared/MongoConnection");
const UserMigration = require("../build/src/modules/user/user.migrations").default;

module.exports = {
    async up(db, client) {
        await connectDB();
        const userMigration = new UserMigration();

        await userMigration.migrationUserEmailToLowerCase();
    },

    async down(db, client) {
        //
    }
};
