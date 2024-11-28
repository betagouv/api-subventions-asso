/* eslint-disable @typescript-eslint/no-var-requires */
const { connectDB } = require("../build/src/shared/MongoConnection");

const userRepository = require("../build/src/dataProviders/db/user/user.port").default;
const asyncForEach = require("../build/src/shared/helpers/ArrayHelper").asyncForEach;

module.exports = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async up(db, client) {
        await connectDB();
        const result = [];
        await db
            .collection("log")
            .aggregate([
                {
                    $match: {
                        "meta.req.user.email": { $exists: true },
                        $or: [
                            {
                                "meta.req.url": new RegExp("^/association/[Ww0-9]{9,10}$", "g"),
                            },
                            { "meta.req.url": new RegExp("^/etablissement") },
                            { "meta.req.url": new RegExp("^/search") },
                        ],
                    },
                },
                {
                    $group: {
                        _id: "$meta.req.user.email",
                        date: { $last: "$timestamp" },
                    },
                },
            ])
            .forEach(r => {
                const userEmail = r._id;
                const date = r.date;

                const partialUser = {
                    email: userEmail,
                    stats: {
                        lastSearchDate: date,
                    },
                };
                result.push(partialUser);
            });

        await asyncForEach(result, async partialUser => {
            const user = await userRepository.findByEmail(partialUser.email);
            if (!user) return;

            user.stats.lastSearchDate = partialUser.stats.lastSearchDate;
            await userRepository.update(user);
        });
        const users = await userRepository.find({
            "stats.lastSearchDate": { $exists: false },
        });

        await asyncForEach(
            users,
            async user =>
                await userRepository.update({
                    ...user,
                    stats: { searchCount: 0, lastSearchDate: null },
                }),
        );
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async down(db, client) {
        // TODO write the statements to rollback your migration (if possible)
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    },
};
