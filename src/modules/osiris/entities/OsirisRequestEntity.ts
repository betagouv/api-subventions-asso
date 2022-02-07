import { ObjectId } from "mongodb";
import { ParserInfo } from "../../../@types/ParserInfo";
import ParserPath from "../../../@types/ParserPath";
import ILegalInformations from "../../search/@types/ILegalInformations";
import RequestEntity from "../../search/entities/RequestEntity";
import IOsirisRequestInformations from "../@types/IOsirisRequestInformations";
import OsirisActionEntity from "./OsirisActionEntity";

export default class OsirisRequestEntity extends RequestEntity {
    public static defaultMainCategory = "Dossier";

    public static indexedProviderInformationsPath : {[key: string]: ParserPath | ParserInfo} = {
        osirisId: ["Dossier", "N° Dossier Osiris"],
        compteAssoId: ["Dossier", "N° Dossier Compte Asso"],
        ej: ["Dossier", 'N° EJ'],
        amountAwarded: {
            path: ["Montants", 'Accordé'],
            adapter: (value) => {
                if (!value) return value;

                return parseFloat(value);
            }
        },
        dateCommission: {
            path: ["Dossier", 'Date Commission'],
            adapter: (value) => {
                if (!value) return value;

                const [day, month, year] = value.split('/').map(v => parseInt(v, 10));
                return new Date(year, month - 1, day);
            }
        }
    }

    public static indexedLegalInformationsPath = {
        siret: [["Association", "Bénéficiaire"], "N° Siret"],
        rna: [["Association", "Bénéficiaire"], "N° RNA"],
        name: [["Association", "Bénéficiaire"], "Nom"],
    }

    public provider = "Osiris";
    
    public providerMatchingKeys: string[] = [
        "osirisId",
        "compteAssoId",
        "ej"
    ]

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