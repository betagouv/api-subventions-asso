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
                        search: { $push: "$meta.req.url" },
                    },
                },
            ])
            .forEach(r => {
                const userEmail = r._id;
                const search = r.search;

                const partialUser = {
                    email: userEmail,
                    stats: {
                        searchCount: search.length,
                    },
                };
                result.push(partialUser);
            });

        await asyncForEach(result, async partialUser => await userPort.update(partialUser));

        const users = await userPort.find({ stats: { $exists: false } });

        await asyncForEach(users, async user => await userPort.update({ ...user, stats: { searchCount: 0 } }));
    },
};
