/* eslint-disable @typescript-eslint/no-var-requires */
const { connectDB } = require("../build/src/shared/MongoConnection");
const { default: statsPort } = require("../build/src/dataProviders/db/stats/stats.port");
const {
    default: statsAssociationsVisitPort,
} = require("../build/src/dataProviders/db/stats/statsAssociationsVisit.port");
const { default: userPort } = require("../build/src/dataProviders/db/user/user.port");
const { getIdentifierType } = require("../build/src/shared/helpers/IdentifierHelper");
const { siretToSiren } = require("../build/src/shared/helpers/SirenHelper");
const { default: rnaSirenPort } = require("../build/src/dataProviders/db/rnaSiren/rnaSiren.port");
/* eslint-enable @typescript-eslint/no-var-requires */

module.exports = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async up(db, client) {
        await connectDB();
        const logsCursor = await statsPort.getLogsWithRegexUrl(/\/(association|etablissement)\/.{9,14}$/);

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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async down(db, client) {
        await connectDB();
        db.collection(statsAssociationsVisitPort.collectionName).drop();
    },
};
