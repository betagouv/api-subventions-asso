import ILegalInformations from "../@types/ILegalInformations";
import IProviderInformations from "../@types/IProviderInformations";

export default class RequestEntity {
    public provider = "api-subventions-asso";
    public providerInformations: IProviderInformations = {};
    public providerMatchingKeys: string[] = [];
    public data: unknown;

    constructor(public legalInformations: ILegalInformations) {}
}