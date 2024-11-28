const { default: miscScdlGrantRepository } = require("../build/src/dataProviders/db/providers/scdl/miscScdlGrant.port");

module.exports = {
    async up(db) {
        await db.collection("misc-scdl-grant").dropIndexes();
        await miscScdlGrantRepository.createIndexes();
    },
};
