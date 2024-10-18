module.exports = {
    async up(db) {
        const bulkWritePayment = [];
        const bulkWriteApplication = [];
        await Promise.all([
            db
                .collection("fonjepVersement")
                .find({})
                .forEach(payment => {
                    bulkWritePayment.push({
                        updateOne: {
                            filter: { _id: payment._id },
                            update: {
                                $set: {
                                    "indexedInformations.joinKey":
                                        payment.indexedInformations.periode_debut.getFullYear() +
                                        "-" +
                                        payment.indexedInformations.code_poste,
                                },
                            },
                        },
                    });
                }),
            db
                .collection("fonjepSubvention")
                .find({})
                .forEach(payment => {
                    bulkWriteApplication.push({
                        updateOne: {
                            filter: { _id: payment._id },
                            update: {
                                $set: {
                                    "indexedInformations.joinKey":
                                        payment.indexedInformations.annee_demande +
                                        "-" +
                                        payment.indexedInformations.code_poste,
                                },
                            },
                        },
                    });
                }),
        ]);

        await Promise.all([
            db.collection("fonjepVersement").bulkWrite(bulkWritePayment),
            db.collection("fonjepSubvention").bulkWrite(bulkWriteApplication),
        ]);
    },

    async down(db) {
        await db.collection("fonjepVersement").updateMany({}, { $set: { ["indexedInformations.joinKey"]: undefined } });
        await db
            .collection("fonjepSubventions")
            .updateMany({}, { $set: { ["indexedInformations.joinKey"]: undefined } });
    },
};
