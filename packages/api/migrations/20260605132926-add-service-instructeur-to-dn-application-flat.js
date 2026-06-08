module.exports = {
    async up(db) {
        await db.collection("applications-flat").updateMany(
            {
                fournisseur: {
                    $in: [
                        "demarches-simplifiees-62744",
                        "demarches-simplifiees-62746",
                        "demarches-simplifiees-62747",
                        "demarches-simplifiees-74747",
                        "demarches-simplifiees-78102",
                        "demarches-simplifiees-78125",
                        "demarches-simplifiees-78126",
                        "demarches-simplifiees-78128",
                        "demarches-simplifiees-86113",
                    ],
                },
            },
            {
                $set: {
                    nomServiceInstructeur: "Direction Régionale des Affaires Culturelles",
                },
            },
        );
    },
};
