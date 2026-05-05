// Fix document 69e62c77c30c9d3a5d13ec23 stored without "data" and "providerInformations" (required by the next migration 20260428231703-osiris-request-raw-entity.js)

const COLLECTION = "osiris-requests";
const TARGET_ID = "69e62c77c30c9d3a5d13ec23";

module.exports = {
    async up(db) {
        const { ObjectId } = require("mongodb");
        const collection = db.collection(COLLECTION);
        const doc = await collection.findOne({ _id: new ObjectId(TARGET_ID) });

        if (!doc || doc.data) return;

        const {
            dossier,
            association,
            coordonneesCorrespondance: coord,
            representantLegal,
            montants,
            versements,
            nbActions,
        } = doc;

        await collection.updateOne(
            { _id: new ObjectId(TARGET_ID) },
            {
                $set: {
                    providerInformations: { exercise: dossier.exerciceBudgetaire },
                    data: {
                        Dossier: {
                            "N° Dossier Osiris": dossier.numeroDossierOsiris,
                            "N° Dossier Compte Asso": dossier.numeroDossierCompteAsso,
                            "N° EJ": dossier.numeroEj,
                            "Date Commission": dossier.dateCommission,
                            "Exercice Debut": dossier.exerciceDebut,
                            "Exercice Fin": dossier.exerciceFin,
                            "Etat Dossier": dossier.etatDossier,
                            Service: dossier.service,
                            "N° Programme Type Financement": dossier.programmeTypeFinancement,
                            "Sous Type Financement": dossier.sousTypeFinancement,
                            Pluriannualite: dossier.pluriannualite,
                        },
                        Association: {
                            "N° RNA": association.numeroRna,
                            "N° Siret": association.numeroSiret,
                            Nom: association.nom,
                            Siege: association.siege,
                            IBAN: association.iban,
                            BIC: association.bic,
                        },
                        "Coordonnées correspondance (publipostage)": {
                            Voie: coord.voie,
                            "Code Postal": coord.codePostal,
                            Commune: coord.commune,
                        },
                        "Représentant légal": {
                            Nom: representantLegal.nom,
                            Prénom: representantLegal.prenom,
                            Civilité: representantLegal.civilite,
                            Fonction: representantLegal.fonction,
                            Courriel: representantLegal.courriel,
                            Téléphone: representantLegal.telephone,
                        },
                        Montants: {
                            "Coût Total des Charges": montants.coutTotalDesCharges,
                            Demandé: montants.demande,
                            Proposé: montants.propose,
                            Accordé: montants.accorde,
                        },
                        Versements: {
                            Acompte: versements.acompte,
                            Solde: versements.solde,
                            Réalisé: versements.realise,
                            "Compensation N-1": versements.compensationN1,
                            "Reversement Compensation": versements.reversementCompensation,
                        },
                        "Nb Actions": {
                            "Nombre Actions": nbActions.nombreActions,
                        },
                    },
                },
            },
        );
    },
};
