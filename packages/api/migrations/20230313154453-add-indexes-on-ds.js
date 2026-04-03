const { connectDB } = require("../build/src/shared/MongoConnection");
const {
    default: demarchesSimplifieesDataPort,
} = require("../build/src/adapters/outputs/db/providers/demarchesSimplifiees/demarchesSimplifieesData.adapter");
const {
    default: demarchesSimplifieesMapperPort,
} = require("../build/src/adapters/outputs/db/providers/demarchesSimplifiees/demarchesSimplifieesMapper.port");

module.exports = {
    async up() {
        await connectDB();

        await demarchesSimplifieesDataPort.createIndexes();
        await demarchesSimplifieesMapperPort.createIndexes();
    },
};
