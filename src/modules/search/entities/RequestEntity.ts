import ILegalInformations from "../@types/ILegalInformations";
import IProviderInformations from "../@types/IProviderInformations";

export default class RequestEntity {
    public provider = "datasubvention";
    public providerInformations: IProviderInformations = {};
    public providerMatchingKeys: string[] = [];
    public data: unknown;

    constructor(public legalInformations: ILegalInformations) {}
}