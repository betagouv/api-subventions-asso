const { connectDB } = require("../build/src/shared/MongoConnection");
const UserMigration = require("../build/src/modules/user/user.migrations").default;

module.exports = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async up(db, client) {
        await connectDB();
        const userMigration = new UserMigration();

        await userMigration.migrationUserEmailToLowerCase();
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async down(db, client) {
        //
    },
};
