import * as ParseHelper from "../../../../shared/helpers/ParserHelper";
import { Siret } from "@api-subventions-asso/dto"
import { ParserInfo, ParserPath, DefaultObject } from "../../../../@types";
import IFonjepIndexedInformations from "../@types/IFonjepIndexedInformations";
import { formatCP } from "../../../../shared/helpers/DataFormatHelper";

export default class FonjepRequestEntity {

    public static indexedLegalInformationsPath: DefaultObject<ParserPath | ParserInfo> = {
        siret: {
            path: ["Association", "SiretOuRidet"],
            adapter: (value) =>  {
                if(!value) return value;

                return value.replace(/ /g, "");
            }
        },
        name: ["Association", "RaisonSociale"],
    }

    public static indexedProviderInformationsPath: DefaultObject<ParserPath | ParserInfo> = {
        montant_paye: {
            path: ["MontantSubvention"],
            adapter: (value) => {
                if(!value) return 0;

                return !value.length ? parseFloat(value) : 0
            }
        },
        status: ["PstStatutPosteLibelle"],
        service_instructeur: ["Financeur", "RaisonSociale"],
        annee_demande: ["Annee"],
        date_fin_triennale: {
            path: ["DateFinTriennalite"],
            adapter: (value) => {
                if (!value) return value;
                return ParseHelper.ExcelDateToJSDate(Number(value));
            }
        },
        updated_at: ["updated_at"],
        unique_id: ["id"],
        type_post: ["TypePoste", "Libelle"],
        ville: ["Association", "Ville"],
        code_postal: {
            path: ["Association", "CodePostal"],
            adapter: formatCP
        },
        contact: ["Association", "ContactEmail"],
        co_financeur: ["Co-Financeur", "RaisonSociale"],
        co_financeur_contact: ["Co-Financeur", "ContactEmail"],
        co_financeur_siret: ["Co-Financeur", "SiretOuRidet"],
        co_financeur_montant: ["Co-Financements", "MontantFinance"],
        plein_temps: ["PleinTemps"]
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