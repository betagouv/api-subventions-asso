const { connectDB } = require("../build/src/shared/MongoConnection");
const {
    default: demarchesSimplifieesDataPort,
} = require("../build/src/adapters/outputs/db/providers/demarches-simplifiees/demarches-simplifiees-data.adapter");
const {
    default: demarchesSimplifieesMapperPort,
} = require("../build/src/adapters/outputs/db/providers/demarches-simplifiees/demarchesSimplifieesMapper.port");

module.exports = {
    async up() {
        await connectDB();

        await demarchesSimplifieesDataPort.createIndexes();
        await demarchesSimplifieesMapperPort.createIndexes();
    },
};
