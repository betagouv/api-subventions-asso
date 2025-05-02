const { connectDB } = require("../build/src/shared/MongoConnection");
const OsirisMigration = require("../build/src/modules/providers/osiris/osiris.migrations").default;

module.exports = {
    async up() {
        await connectDB();
        const migration = new OsirisMigration();

        await migration.setExtractYearOnOsirisEntities(2021);
    },
};
