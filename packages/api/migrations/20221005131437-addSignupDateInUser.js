/* eslint-disable @typescript-eslint/no-var-requires */
const { connectDB } = require("../build/src/shared/MongoConnection");

const userRepository = require("../build/src/modules/user/repositoies/user.repository").default;
const asyncForEach = require("../build/src/shared/helpers/ArrayHelper").asyncForEach;

module.exports = {
    async up(db, client) {
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
                                "meta.res.statusCode": 200
                            },
                            {
                                "meta.req.url": new RegExp("/auth/signup"),
                                "meta.res.statusCode": 201
                            }
                        ]
                    }
                },
                {
                    $group: {
                        _id: "$meta.req.body.email",
                        email: { $first: "$meta.req.body.email" },
                        date: { $first: "$timestamp" }
                    }
                }
            ])
            .forEach(r => {
                const userEmail = r.email;
                const date = r.date;

                const partialUser = {
                    email: userEmail,
                    signupAt: date
                };
                result.push(partialUser);
            });

        await asyncForEach(result, async partialUser => await userRepository.update(partialUser));

        const users = await userRepository.find({ signupAt: { $exists: false } });

        await asyncForEach(
            users,
            async user =>
                await userRepository.update({
                    ...user,
                    signupAt: new Date("2022-01-01")
                })
        );
    },

    async down(db, client) {
        // TODO write the statements to rollback your migration (if possible)
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    }
};
