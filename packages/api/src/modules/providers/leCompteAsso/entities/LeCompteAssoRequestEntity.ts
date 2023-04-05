import { ObjectId } from "mongodb";
import { ParserInfo, ParserPath } from "../../../../@types";
import ILegalInformations from "../../../search/@types/ILegalInformations";
import RequestEntity from "../../../search/entities/RequestEntity";
import ILeCompteAssoRequestInformations from "../@types/ILeCompteAssoRequestInformations";

export default class LeCompteAssoRequestEntity extends RequestEntity {
    public provider = "Le Compte Asso";

    public static indexedProviderInformationsPath: {
        [key: string]: ParserPath | ParserInfo;
    } = {
        compteAssoId: ["Numéro dossier LCA"],
        transmis_le: {
            path: ["Transmis le"],
            adapter: value => {
                if (!value) return value;

                const [day, month, year] = value.split("/").map(v => parseInt(v, 10));
                return new Date(year, month - 1, day);
            },
        },
        createur_email: ["Compte du créateur"],
    };

    public static indexedLegalInformationsPath = {
        siret: ["Numéro Siret"],
        name: ["Nom association"],
    };

    public providerMatchingKeys: string[] = ["compteAssoId"];

    constructor(
        public legalInformations: ILegalInformations,
        public providerInformations: ILeCompteAssoRequestInformations,
        public data: unknown,
        public _id?: ObjectId,
    ) {
        super(legalInformations);
    }
}
