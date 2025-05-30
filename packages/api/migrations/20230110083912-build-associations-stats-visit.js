const { connectDB } = require("../build/src/shared/MongoConnection");
const { default: logsPort } = require("../build/src/dataProviders/db/stats/stats.port");
const {
    default: statsAssociationsVisitPort,
} = require("../build/src/dataProviders/db/stats/statsAssociationsVisit.port");
const { default: userPort } = require("../build/src/dataProviders/db/user/user.port");
const { getIdentifierType } = require("../build/src/shared/helpers/IdentifierHelper");
const { siretToSiren } = require("../build/src/shared/helpers/SirenHelper");
const { default: rnaSirenPort } = require("../build/src/dataProviders/db/rnaSiren/rnaSiren.port");

module.exports = {
    async up() {
        await connectDB();
        const logsCursor = await logsPort.getLogsWithRegexUrl(/\/(association|etablissement)\/.{9,14}$/);

        await statsAssociationsVisitPort.createIndexes();
        await rnaSirenPort.createIndexes();

        while (await logsCursor.hasNext()) {
            const log = await logsCursor.next();
            if (!log.meta.req.user?.email || log.meta.res.statusCode !== 200) continue;
            const identifier = log.meta.req.url.split("/").pop();

            const typeIdentifier = getIdentifierType(identifier);
            if (typeIdentifier === null) {
                continue;
            }

            const user = await userPort.findByEmail(log.meta.req.user.email);

            if (!user || user.roles.includes("admin")) {
                continue;
            }

            await statsAssociationsVisitPort.add({
                associationIdentifier: typeIdentifier === "SIRET" ? siretToSiren(identifier) : identifier,
                userId: user._id,
                date: log.timestamp,
            });
        }
    },

    async down(db) {
        await connectDB();
        db.collection(statsAssociationsVisitPort.collectionName).drop();
    },
};
