import { ProviderDataEntity } from "../../../../@types/ProviderData";
import Ridet from "../../../../identifierObjects/Ridet";
import Siret from "../../../../identifierObjects/Siret";
import Tahitiet from "../../../../identifierObjects/Tahitiet";

export default interface ChorusFseEntity extends ProviderDataEntity {
    ej: string;
    ejPostNum: string;
    identifier: Siret | Ridet | Tahitiet;
    branchCode: string;
    branch: string;
    programRef: string;
    programRefCode: string;
    paymentRequestNum: string;
    paymentRequestPostNum: string;
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
