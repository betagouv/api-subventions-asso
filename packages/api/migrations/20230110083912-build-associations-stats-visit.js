const { connectDB } = require("../build/src/shared/MongoConnection");
const { default: logsPort } = require("../build/src/adapters/outputs/db/stats/stats.port");
const {
    default: statsAssociationsVisitAdapter,
} = require("../build/src/adapters/outputs/db/stats/statsAssociationsVisit.adapter");
const { default: userAdapter } = require("../build/src/adapters/outputs/db/user/user.adapter");
const { getIdentifierType } = require("../build/src/shared/helpers/IdentifierHelper");
const { siretToSiren } = require("../build/src/shared/helpers/SirenHelper");
const { default: rnaSirenAdapter } = require("../build/src/adapters/outputs/db/rnaSiren/rnaSiren.adapter");

module.exports = {
    async up() {
        await connectDB();
        const logsCursor = await logsPort.getLogsWithRegexUrl(/\/(association|etablissement)\/.{9,14}$/);

        await statsAssociationsVisitAdapter.createIndexes();
        await rnaSirenAdapter.createIndexes();

        while (await logsCursor.hasNext()) {
            const log = await logsCursor.next();
            if (!log.meta.req.user?.email || log.meta.res.statusCode !== 200) continue;
            const identifier = log.meta.req.url.split("/").pop();

            const typeIdentifier = getIdentifierType(identifier);
            if (typeIdentifier === null) {
                continue;
            }

            const user = await userAdapter.findByEmail(log.meta.req.user.email);

            if (!user || user.roles.includes("admin")) {
                continue;
            }

            await statsAssociationsVisitAdapter.add({
                associationIdentifier: typeIdentifier === "SIRET" ? siretToSiren(identifier) : identifier,
                userId: user._id,
                date: log.timestamp,
            });
        }
    },

    async down(db) {
        await connectDB();
        db.collection(statsAssociationsVisitAdapter.collectionName).drop();
    },
};
