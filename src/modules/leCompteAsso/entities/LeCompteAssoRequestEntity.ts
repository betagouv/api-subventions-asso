import { ObjectId } from "mongodb";
import ILegalInformations from "../../search/@types/ILegalInformations";
import RequestEntity from "../../search/entities/RequestEntity";
import ILeCompteAssoRequestInformations from "../@types/ILeCompteAssoRequestInformations";

export default class LeCompteAssoRequestEntity extends RequestEntity {
    public provider = "Le Compte Asso";

    public static indexedProviderInformationsPath = {
        compteAssoId: ["Numéro dossier LCA"],
    }

    public static indexedLegalInformationsPath = {
        siret: ["Numéro Siret"],
        name: ["Nom association"],
    }

    public providerMatchingKeys: string[] = [
        "compteAssoId",
    ]

    constructor(
        public legalInformations: ILegalInformations,
        public providerInformations: ILeCompteAssoRequestInformations,
        public data: unknown,
        public _id?: ObjectId,
    ) {
        super(legalInformations);
    }
}