import db from "../../../shared/MongoConnection";


export async function jointureHybride(){

    const threeYearsAgo = new Date();
    console.log(threeYearsAgo);
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
    console.log(threeYearsAgo);

    let paymentFlatCollection : any[]= [];
    try {
        const result = db.collection('payments-flat').aggregate([
            {
                $match: {
                    dateOperation: { $gt: threeYearsAgo } // Filtre pour les trois dernières années
                }
            },
            {
                $group: {
                    _id: "$siren", // Grouper par "siren"
                    last_three_years_subv: { $sum: "$montant" } // Somme du champ "montant"
                }
            }
        ]);
        paymentFlatCollection = await result.toArray();
    }
    catch (err) {
        console.error(err);
    }
    let sireneCollection : any[]= [];
    try {
        const result = db.collection('sirene').find({});
        sireneCollection = await result.toArray();
    }
    catch (err) {
        console.error(err);
    }

    // Jointure gauche
    const result = paymentFlatCollection.map(payment => {
        // Filtrer les subventions correspondant au SIREN de l'entreprise
        const assoInfo = sireneCollection.find(sirene => sirene.siren === payment._id);

        // Retourner un objet combiné
        return {
            ...payment,
             ...(assoInfo || {}),
        };
    });

    console.log(result.length);
    return  result;


}