const { default: miscScdlGrantPort } = require("../build/src/adapters/outputs/db/providers/scdl/miscScdlGrant.adapter");

module.exports = {
    async up(db) {
        await db.collection("misc-scdl-grant").dropIndexes();
        await miscScdlGrantPort.createIndexes();
    },
};
