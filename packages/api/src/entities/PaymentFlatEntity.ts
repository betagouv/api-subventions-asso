import {
    idEntrepriseType,
    idEtablissementType,
    typeIdEntreprise,
    typeIdEtablissement,
} from "../valueObjects/typeIdentifier";

export default class PaymentFlatEntity {
    constructor(
        public uniqueId: string,
        public idVersement: string,
        public exerciceBudgetaire: number,
        public typeIdEtablissementBeneficiaire: typeIdEtablissement,
        public idEtablissementBeneficiaire: idEtablissementType<typeIdEtablissement>,
        public typeIdEntrepriseBeneficiaire: typeIdEntreprise,
        public idEntrepriseBeneficiaire: idEntrepriseType<typeIdEntreprise>,
        public amount: number,
        public operationDate: Date,
        public programName: string | null,
        public programNumber: number,
        public mission: string | null,
        public ministry: string | null,
        public ministryAcronym: string | null,
        public ej: string,
        public provider: string,
        public actionCode: string,
        public actionLabel: string | null,
        public activityCode: string | null,
        public activityLabel: string | null,
    ) {}
}
