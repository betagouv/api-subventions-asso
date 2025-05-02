const { connectDB } = require("../build/src/shared/MongoConnection");
const {
    default: demarchesSimplifieesDataPort,
} = require("../build/src/dataProviders/db/providers/demarchesSimplifiees/demarchesSimplifieesData.port");
const {
    default: demarchesSimplifieesMapperPort,
} = require("../build/src/dataProviders/db/providers/demarchesSimplifiees/demarchesSimplifieesMapper.port");

module.exports = {
    async up(db, client) {
        await connectDB();

        await demarchesSimplifieesDataPort.createIndexes();
        await demarchesSimplifieesMapperPort.createIndexes();
    },
};
