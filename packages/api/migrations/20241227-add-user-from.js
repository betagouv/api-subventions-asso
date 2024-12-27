module.exports = {
    async up(db) {
        const collection = db.collection("users");
        await collection
            .aggregate([
                {
                    $addFields: {
                        from: [],
                        fromEmail: "",
                        fromOther: "",
                    },
                },
                { $out: "users" },
            ])
            .toArray();
    },
};
