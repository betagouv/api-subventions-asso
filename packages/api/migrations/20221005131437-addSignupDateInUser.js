const { connectDB } = require("../build/src/shared/MongoConnection");

const userAdapter = require("../build/src/adapters/outputs/db/user/user.adapter").default;
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
                        $or: [
                            {
                                "meta.req.url": new RegExp("/user/admin/create-user"),
                                "meta.res.statusCode": 200,
                            },
                            {
                                "meta.req.url": new RegExp("/auth/signup"),
                                "meta.res.statusCode": 201,
                            },
                        ],
                    },
                },
                {
                    $group: {
                        _id: "$meta.req.body.email",
                        email: { $first: "$meta.req.body.email" },
                        date: { $first: "$timestamp" },
                    },
                },
            ])
            .forEach(r => {
                const userEmail = r.email;
                const date = r.date;

                const partialUser = {
                    email: userEmail,
                    signupAt: date,
                };
                result.push(partialUser);
            });

        await asyncForEach(result, async partialUser => await userAdapter.update(partialUser));

        const users = await userAdapter.find({ signupAt: { $exists: false } });

        await asyncForEach(
            users,
            async user =>
                await userAdapter.update({
                    ...user,
                    signupAt: new Date("2022-01-01"),
                }),
        );
    },
};
