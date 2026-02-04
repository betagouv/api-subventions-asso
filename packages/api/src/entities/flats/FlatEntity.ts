import { CompanyIdName, EstablishmentIdName } from "dto";
import { ProviderDataEntity } from "../../@types/ProviderData";
import { EstablishmentIdType, CompanyIdType } from "../../identifierObjects/@types/IdentifierType";

export interface MandatoryFlatEntity extends ProviderDataEntity {
    uniqueId: string;
    beneficiaryEstablishmentIdType: EstablishmentIdName;
    beneficiaryEstablishmentId: EstablishmentIdType;
    beneficiaryCompanyIdType: CompanyIdName;
    beneficiaryCompanyId: CompanyIdType;
    provider: string;
}
