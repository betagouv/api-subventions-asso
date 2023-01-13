// eslint-disable-next-line @typescript-eslint/no-var-requires
const { connectDB } = require("../build/src/shared/MongoConnection");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { default: statsRepository } = require("../build/src/modules/stats/repositories/stats.repository");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {
    default: statsAssociationsVisitRepository
} = require("../build/src/modules/stats/repositories/statsAssociationsVisit.repository");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { default: userRepository } = require("../build/src/modules/user/repositories/user.repository");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { asyncForEach } = require("../build/src/shared/helpers/ArrayHelper");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getIdentifierType } = require("../build/src/shared/helpers/IdentifierHelper");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { siretToSiren } = require("../build/src/shared/helpers/SirenHelper");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {
    default: rnaSirenRepository
} = require("../build/src/modules/open-data/rna-siren/repositories/rnaSiren.repository");

module.exports = {
    async up(db, client) {
        await connectDB();
        const logs = await statsRepository.getLogsWithRegexUrl(/\/(association|etablissement)\/.{9,14}$/);

        await statsAssociationsVisitRepository.createIndexes();
        await rnaSirenRepository.createIndexes();

        await asyncForEach(logs, async log => {
            if (!log.meta.req.user?.email || log.meta.res.statusCode !== 200) return;
            const identifier = log.meta.req.url.split("/").pop();

            const typeIdentifier = getIdentifierType(identifier);
            if (typeIdentifier === null) {
                console.log(log.meta.req.url);
                return;
            }

            const user = await userRepository.findByEmail(log.meta.req.user.email);

            if (!user || user.roles.includes("admin")) {
                console.log("Rejected user:", log.meta.req.user.email);
                return;
            }

            await statsAssociationsVisitRepository.add({
                associationIndentifier: typeIdentifier === "SIRET" ? siretToSiren(identifier) : identifier,
                userId: user._id,
                date: log.timestamp
            });
        });
    },

    async down(db, client) {
        // TODO write the statements to rollback your migration (if possible)
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    }
};
