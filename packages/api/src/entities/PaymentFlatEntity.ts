import Siren from "../valueObjects/Siren";
import Siret from "../valueObjects/Siret";

export default class PaymentFlatEntity {
    constructor(
        public uniqueId: string,
        public idVersement: string,
        public exerciceBudgetaire: number,
        public typeIdEtablissementBeneficiaire: string, // ceci peut prendre que les valeurs suivantes siret, ridet, thaiti-t
        public idEtablissementBeneficiaire: string, // ceci doit correspondre à un format précis en fonction de la valeur de typeIdEtablissement
        public typeIdEntrepriseBeneficiaire: string, // ceci peut prendre que les valeurs suivantes siren, rid, thaiti
        public IdEntrepriseBeneficiaire: string, // ceci doit correspondre à un format précis en fonction de la valeur de typeIdEntreprise
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
