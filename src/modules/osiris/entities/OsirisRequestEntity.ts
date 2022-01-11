import { ObjectId } from "mongodb";
import ILegalInformations from "../../search/@types/ILegalInformations";
import RequestEntity from "../../search/entities/RequestEntity";
import IOsirisRequestInformations from "../@types/IOsirisRequestInformations";
import OsirisActionEntity from "./OsirisActionEntity";

export default class OsirisRequestEntity extends RequestEntity {
    public static defaultMainCategory = "Dossier";

    public static indexedProviderInformationsPath = {
        osirisId: ["Dossier", "N° Dossier Osiris"],
        compteAssoId: ["Dossier", "N° Dossier Compte Asso"],
    }

    public static indexedLegalInformationsPath = {
        siret: ["Association", "N° Siret"],
        rna: ["Association", "N° RNA"],
        name: ["Association", "Nom"],
    }

    public provider = "Osiris";

    constructor(
        public legalInformations: ILegalInformations,
        public providerInformations: IOsirisRequestInformations,
        public data: unknown,
        public _id?: ObjectId,
        public actions?: OsirisActionEntity[]
    ) {
        super(legalInformations);
    }
}