import ChorusAdapter from "../modules/providers/chorus/adapters/ChorusAdapter";
import { companyIdType, establishmentIdType, companyIdName, establishmentIdName } from "../valueObjects/typeIdentifier";

export default class PaymentFlatEntity {
    public regionAttachementComptable: string;
    public idVersement: string;
    public uniqueId: string;

    constructor(
        public exerciceBudgetaire: number,
        public typeIdEtablissementBeneficiaire: establishmentIdName,
        public idEtablissementBeneficiaire: establishmentIdType,
        public typeIdEntrepriseBeneficiaire: companyIdName,
        public idEntrepriseBeneficiaire: companyIdType,
        public amount: number,
        public operationDate: Date,
        public centreFinancierCode: string,
        public centreFinancierLibelle: string | null,
        public attachementComptable: string,
        public ej: string,
        public provider: string,
        public programName: string | null,
        public programNumber: number,
        public mission: string | null,
        public ministry: string | null,
        public ministryAcronym: string | null,
        public actionCode: string,
        public actionLabel: string | null,
        public activityCode: string | null,
        public activityLabel: string | null,
    ) {
        this.regionAttachementComptable = ChorusAdapter.getRegionAttachementComptable(attachementComptable);
        this.idVersement = `${idEtablissementBeneficiaire}-${ej}-${exerciceBudgetaire}`;
        this.uniqueId = `${
            this.idVersement
        }-${programNumber}-${actionCode}-${activityCode}-${operationDate.getTime()}-${attachementComptable}-${centreFinancierCode}`;
    }
}
