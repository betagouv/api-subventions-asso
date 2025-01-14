module.exports = {
    async up(db) {
        const collection = db.collection("users");
        await collection.updateMany(
            {},
            {
                $set: {
                    registrationSrc: [],
                    registrationSrcEmail: "",
                    registrationSrcDetails: "",
                },
            },
        );
    },

    async down(db) {
        db.collection("users").updateMany(
            {},
            {
                $unset: {
                    registrationSrc: "",
                    registrationSrcEmail: "",
                    registrationSrcDetails: "",
                },
            },
        );
    },
};
