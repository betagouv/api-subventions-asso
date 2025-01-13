module.exports = {
    async up(db, client) {
        const collection = db.collection("users");
        await collection.updateMany(
            {},
            {
                $set: {
                    from: [],
                    fromEmail: "",
                    fromOther: "",
                },
            },
        );
    },

    async down(db, client) {
        db.collection("users").updateMany(
            {},
            {
                $unset: {
                    from: "",
                    fromEmail: "",
                    fromOther: "",
                },
            },
        );
    },
};
