import { ObjectId } from "mongodb";

export default class ApplicationsFlatAdapter {
    static toDbo(entity) {
        return {
            _id: new ObjectId(),
            provider: entity.provider,
            idSubvention: entity.idSubvention,
            nomAttribuant: entity.nomAttribuant,
            idAttribuant: entity.idAttribuant,
            nomServiceInstructeur: entity.nomServiceInstructeur,
            idServiceInstructeur: entity.idServiceInstructeur,
            nomBeneficiaire: entity.nomBeneficiaire,
            idBeneficiaire: entity.idBeneficiaire,
            exerciceBudgetaire: entity.exerciceBudgetaire,
            pluriannualite: entity.pluriannualite,
            anneesPluriannualites: entity.anneesPluriannualites,
            dateDecision: entity.dateDecision,
            dateConvention: entity.dateConvention,
            referenceDecision: entity.referenceDecision,
            dateCreation: entity.dateCreation,
            dateDebut: entity.dateDebut,
            dateFin: entity.dateFin,
            dispositif: entity.dispositif,
            sousDispositif: entity.sousDispositif,
            statutLabel: entity.statutLabel,
            objet: entity.objet,
            nature: entity.nature,
            montantDemande: entity.montantDemande,
            montantAccorde: entity.montantAccorde,
            ej: entity.ej,
            cleVersement: entity.cleVersement,
            conditionsVersement: entity.conditionsVersement,
            datesPeriodeVersement: entity.datesPeriodeVersement,
            cofinancement: entity.cofinancement,
            attribuantsCofinanceurs: entity.attribuantsCofinanceurs,
            idCofinancement: entity.idCofinancement,
            notificationUE: entity.notificationUE,
            evaluationCout: entity.evaluationCout,
            evaluation: entity.evaluation,
        };
    }
}
