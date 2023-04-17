/* eslint-disable @typescript-eslint/no-var-requires */
const { connectDB } = require("../build/src/shared/MongoConnection");
const configRepo = require("../build/src/modules/configurations/repositories/configurations.repository").default;
module.exports = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async up(db, client) {
        await connectDB();

        await configRepo.upsert("DAUPHIN-TOKEN-AVAILABLE", {
            data: 1000 * 60 * 60 * 12,
        }); // 12h
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async down(db, client) {
        // TODO write the statements to rollback your migration (if possible)
    },
};
