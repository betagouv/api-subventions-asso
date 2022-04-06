import { ObjectId } from "mongodb";
import { DefaultObject, ParserInfo, ParserPath } from "../../../../@types";
import ILegalInformations from "../../../search/@types/ILegalInformations";
import RequestEntity from "../../../search/entities/RequestEntity";
import IGisproRequestInformations from '../@types/IGisproRequestInformations';

export default class GisproRequestEntity extends RequestEntity {

    public static indexedProviderInformationsPath : DefaultObject<ParserPath | ParserInfo> = {
        gisproId: ["Projet - Code dossier"],
        dispositif: ["Thème (1)"],
        sous_dispositif: ["Sous thème"],
        montantsTotal: ["Montant engagé"]
    }

    public static indexedLegalInformationsPath = {
        siret: ["Code SIRET"],
        name: ["Tiers"]
    }

    public provider = "Gispro";

    constructor(
        public legalInformations: ILegalInformations,
        public providerInformations: IGisproRequestInformations,
        public data: unknown,
        public _id?: ObjectId
    ) {
        super(legalInformations);
    }
}