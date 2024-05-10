const { DEFAULT_PWD } = require("../build/src/modules/user/user.constant");
const { getHashPassword } = require("../build/src/modules/user/services/auth/user.auth.service");

module.exports = {
    async up(db) {
        await db.collection("users").updateMany(
            {
                active: false,
                disable: { $ne: true },
                agentConnectId: { $ne: undefined },
                lastActivityDate: undefined,
            },
            { $unset: { hashPassword: 1 } },
        );
    },

    async down(db) {
        const defaultHashPassword = await getHashPassword(DEFAULT_PWD);
        await db.collection("users").updateMany(
            {
                active: false,
                disable: { $ne: true },
                hashPassowrd: undefined,
                lastActivityDate: undefined,
                agentConnectId: { $ne: undefined },
            },
            { $set: { hashPassword: defaultHashPassword } },
        );
    },
};
