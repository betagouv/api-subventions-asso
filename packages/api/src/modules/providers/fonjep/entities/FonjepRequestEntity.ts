import * as ParseHelper from "../../../../shared/helpers/ParserHelper";
import { ParserInfo } from "../../../../@types/ParserInfo";
import ParserPath from "../../../../@types/ParserPath";
import { Siret } from "../../../../@types/Siret";
import { DefaultObject } from "../../../../@types/utils";
import IFonjepIndexedInformations from "../@types/IFonjepIndexedInformations";

export default class FonjepRequestEntity {

    public static indexedLegalInformationsPath: DefaultObject<ParserPath | ParserInfo> = {
        siret: ["ACT_SIRET"],
        name: ["raison sociale association bénéficiaire"],
    }

    public static indexedProviderInformationsPath: DefaultObject<ParserPath | ParserInfo> = {
        montant_paye: ["MTT_PAYE"],
        status: ["statut du poste"],
        service_instructeur: ["Service  qui\nattribue le poste"],
        annee_demande: ["ANNEE"],
        date_versement: {
            path: ["DT_VERS"],
            adapter: (value) => {
                if (!value) return value;
                return ParseHelper.ExcelDateToJSDate(value as unknown as number);
            }
        },

        date_fin_effet: {
            path: ["DT_FINEFFET"],
            adapter: (value) => {
                if (!value) return value;
                return ParseHelper.ExcelDateToJSDate(value as unknown as number);
            }
        },        
        date_fin_triennale: {
            path: ["DT_FINTRIENN"],
            adapter: (value) => {
                if (!value) return value;
                return ParseHelper.ExcelDateToJSDate(value as unknown as number);
            }
        },
        ville: ["Ville"],
        code_postal: ["Code postal"],
        financeur_principal: ["Financeur Principal"]
    }

    constructor(
        public legalInformations: {
            siret: Siret,
            name: string,
        },
        public indexedInformations: IFonjepIndexedInformations,
        public data: unknown
    ) {}
}