const {
    default: miscScdlGrantPort,
} = require("../build/src/adapters/outputs/db/providers/scdl/misc-scdl-grant.adapter");

module.exports = {
    async up(db) {
        await db.collection("misc-scdl-grant").dropIndexes();
        await miscScdlGrantPort.createIndexes();
    },
};
