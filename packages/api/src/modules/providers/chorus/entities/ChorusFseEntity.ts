import { ProviderDataEntity } from "../../../../@types/ProviderData";
import Ridet from "../../../../identifier-objects/Ridet";
import Siret from "../../../../identifier-objects/Siret";
import Tahitiet from "../../../../identifier-objects/Tahitiet";

export default interface ChorusFseEntity extends ProviderDataEntity {
    ej: "#";
    ejPostNum: "#";
    identifier: Siret | Ridet | Tahitiet;
    branchCode: string;
    branch: string;
    programRef: string;
    programRefCode: string;
    paymentRequestNum: string;
    paymentRequestPostNum: number;
    societyCode: string;
    budgetaryYear: number;
    paidSupplierId: string;
    beneficiaryName: string;
    financialCenter: string;
    financialCenterCode: string;
    functionalDomain: string;
    functionalDomainCode: string;
    amount: number;
    operationDate: Date;
}
