module.exports = {
    async up(db) {
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

    async down(db) {
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
