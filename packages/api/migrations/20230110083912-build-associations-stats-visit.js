/* eslint-disable @typescript-eslint/no-var-requires */
const { connectDB } = require("../build/src/shared/MongoConnection");
const { default: statsRepository } = require("../build/src/modules/stats/repositories/stats.repository");
const {
    default: statsAssociationsVisitRepository,
} = require("../build/src/modules/stats/repositories/statsAssociationsVisit.repository");
const { default: userRepository } = require("../build/src/modules/user/repositories/user.repository");
const { getIdentifierType } = require("../build/src/shared/helpers/IdentifierHelper");
const { siretToSiren } = require("../build/src/shared/helpers/SirenHelper");
const {
    default: rnaSirenRepository,
} = require("../build/src/modules/open-data/rna-siren/repositories/rnaSiren.repository");
/* eslint-enable @typescript-eslint/no-var-requires */

module.exports = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async up(db, client) {
        await connectDB();
        const logsCursor = await statsRepository.getLogsWithRegexUrl(/\/(association|etablissement)\/.{9,14}$/);

        await statsAssociationsVisitRepository.createIndexes();
        await rnaSirenRepository.createIndexes();

        while (await logsCursor.hasNext()) {
            const log = await logsCursor.next();
            if (!log.meta.req.user?.email || log.meta.res.statusCode !== 200) continue;
            const identifier = log.meta.req.url.split("/").pop();

            const typeIdentifier = getIdentifierType(identifier);
            if (typeIdentifier === null) {
                continue;
            }

            const user = await userRepository.findByEmail(log.meta.req.user.email);

            if (!user || user.roles.includes("admin")) {
                continue;
            }

            await statsAssociationsVisitRepository.add({
                associationIdentifier: typeIdentifier === "SIRET" ? siretToSiren(identifier) : identifier,
                userId: user._id,
                date: log.timestamp,
            });
        }
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async down(db, client) {
        await connectDB();
        db.collection(statsAssociationsVisitRepository.collectionName).drop();
    },
};
