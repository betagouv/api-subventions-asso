const { connectDB } = require("../build/src/shared/MongoConnection");
const UserMigration = require("../build/src/modules/user/user.migrations").default;

module.exports = {
    async up() {
        await connectDB();
        const userMigration = new UserMigration();

        await userMigration.migrationUserEmailToLowerCase();
    },
};
