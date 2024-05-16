module.exports = {
    async up(db) {
        const censoredField = "**********";

        const expandProps = fields => rootPath => fields.map(path => `${rootPath}.${path}`);

        const expandProps2Clean = expandProps(["firstName", "lastName", "phoneNumber", "email"]);
        const expandAuthProps2Clean = expandProps(["firstName", "lastName", "phoneNumber", "email", "jwt"]);

        const thingsToCleanByUrl = {
            "/auth/forget-password": ["meta.req.body.email"],
            "/auth/login": ["meta.req.body.email"],
            "/auth/signup": expandProps2Clean("meta.req.body"),
            "/auth/activate": ["meta.req.body.data.phoneNumber"],
            "/user/admin/roles": ["meta.req.body.email"],
            "/user/admin/create-user": ["meta.req.body.email", "meta.req.body.firstName", "meta.req.body.lastName"],
            "/user": expandAuthProps2Clean("meta.req.body"),
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

        // delete token in headers
        bulkWriteOps.push({
            updateMany: {
                filter: { "meta.req.headers.cookie": { $exists: true } },
                update: {
                    $set: {
                        "meta.req.headers.cookie": censoredField,
                    },
                },
            },
        });
        bulkWriteOps.push({
            updateMany: {
                filter: { "meta.req.headers.x-access-token": { $exists: true } },
                update: {
                    $set: {
                        "meta.req.headers.x-access-token": censoredField,
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
                        "meta.req.user.jwt": "",
                        "meta.req.user.hashPassword": "",
                    },
                },
            },
        });

        // delete data in specific routes' req bodies
        for (const [route, toClean] of Object.entries(thingsToCleanByUrl)) {
            bulkWriteOps.push({
                updateMany: {
                    filter: { "meta.req.url": { $regex: "^" + route } },
                    update: {
                        $set: toClean.reduce((propsToSet, prop) => {
                            propsToSet[prop] = censoredField;
                            return propsToSet;
                        }, {}),
                    },
                },
            });
        }
        const deletedUserIds = db.collection("users").find({ disable: true }, { _id: 1, email: 1 });
        await deletedUserIds.forEach(({ _id: userId, email }) => {
            bulkWriteOps.push({
                updateMany: {
                    filter: { "meta.req.user._id": userId.toString() },
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
