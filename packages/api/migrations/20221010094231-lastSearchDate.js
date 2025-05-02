const { connectDB } = require("../build/src/shared/MongoConnection");

const userPort = require("../build/src/dataProviders/db/user/user.port").default;
const asyncForEach = require("../build/src/shared/helpers/ArrayHelper").asyncForEach;

module.exports = {
    async up(db) {
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
            const user = await userPort.findByEmail(partialUser.email);
            if (!user) return;

            user.stats.lastSearchDate = partialUser.stats.lastSearchDate;
            await userPort.update(user);
        });
        const users = await userPort.find({
            "stats.lastSearchDate": { $exists: false },
        });

        await asyncForEach(
            users,
            async user =>
                await userPort.update({
                    ...user,
                    stats: { searchCount: 0, lastSearchDate: null },
                }),
        );
    },
};
