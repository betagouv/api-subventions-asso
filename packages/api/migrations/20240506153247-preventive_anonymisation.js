const { ObjectId } = require("mongodb");

module.exports = {
    async up(db) {
        const censoredField = "**********";

        const expandProps2Clean = rootPath =>
            ["firstName", "lastName", "phoneNumber", "email"].map(path => rootPath + path);

        const thingsToCleanByUrl = {
            "/auth/forget-password": ["meta.req.body.email"],
            "/auth/login": ["meta.req.body.email"],
            "/auth/signup": ["meta.req.body.email", ...expandProps2Clean("meta.req.body")],
            "/auth/activate": ["meta.req.body.data.phoneNumber"],
            "/user/admin/roles": ["meta.req.body.email"],
            "/user/admin/create-user": ["meta.req.body.email", "meta.req.body.firstName", "meta.req.body.lastName"],
            "/user": [...expandProps2Clean("meta.req.body")],
        };
        const bulkWriteOps = [];

        // delete res bodies
        bulkWriteOps.push({
            updateMany: {
                filter: { "meta.res.body": { $exists: true } },
                update: {
                    $unset: {
                        "meta.res.body": "",
                    },
                },
            },
        });

        // delete data from all authenticated user
        bulkWriteOps.push({
            updateMany: {
                filter: { "meta.req.user.email": { $exists: true } },
                update: {
                    $unset: {
                        "meta.req.user.phoneNumber": "",
                        "meta.req.user.firstName": "",
                        "meta.req.user.lastName": "",
                        "meta.req.user.jwt.token": "",
                        "meta.req.user.hashPassword": "",
                    },
                },
            },
        });

        // delete data in specific routes' req bodies
        for (const [route, toClean] of thingsToCleanByUrl) {
            bulkWriteOps.push({
                updateMany: {
                    filter: { "meta.req.url": { $regex: "^" + route } },
                    update: {
                        $set: toClean.reduce((propsToSet, prop) => {
                            propsToSet[prop] = censoredField;
                            return propsToSet;
                        }),
                    },
                },
            });
        }

        const deletedUserIds = await db.collection("users").find({ disable: true }, { _id: 1, email: 1 });
        deletedUserIds.forEach(({ _id: userId, email }) => {
            bulkWriteOps.push({
                updateMany: {
                    filter: { "meta.req.user._id": new ObjectId(userId) },
                    update: {
                        $set: { "meta.req.user.email": email },
                    },
                },
            });
        });

        await db.collection("log").bulkWrite(bulkWriteOps);
    },

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async down() {},
};
