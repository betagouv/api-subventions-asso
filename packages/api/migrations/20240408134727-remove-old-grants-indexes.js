const {
    default: miscScdlGrantRepository,
} = require("../build/src/modules/providers/scdl/repositories/miscScdlGrant.repository");

module.exports = {
    async up(db) {
        await db.collection("misc-scdl-grant").dropIndexes();
        await miscScdlGrantRepository.createIndexes();
    },
};
