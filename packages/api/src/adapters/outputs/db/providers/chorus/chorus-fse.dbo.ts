import { ProviderDataEntity } from "../../../../../@types/ProviderData";
import { Ridet, Siret, Tahitiet } from "../../../../../identifier-objects";

export default interface ChorusFseDbo extends ProviderDataEntity {
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
