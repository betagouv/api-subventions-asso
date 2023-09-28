import { Siret } from "dto";
import * as ParseHelper from "../../../../shared/helpers/ParserHelper";
import { ParserInfo, ParserPath, DefaultObject } from "../../../../@types";
import IFonjepIndexedInformations from "../@types/IFonjepIndexedInformations";
import { formatCP } from "../../../../shared/helpers/DataFormatHelper";

export default class FonjepSubventionEntity {
    public static indexedLegalInformationsPath: DefaultObject<ParserPath | ParserInfo> = {
        siret: {
            path: ["Association", "SiretOuRidet"],
            adapter: value => {
                if (!value) return value;

                return value.replace(/ /g, "");
            },
        },
        name: ["Association", "RaisonSociale"],
    };

    public static indexedProviderInformationsPath: DefaultObject<ParserPath | ParserInfo> = {
        code_poste: ["Code"],
        dispositif: ["Dispositif", "Libelle"],
        montant_paye: {
            path: ["MontantSubvention"],
            adapter: value => {
                if (!value) return 0;

                return !value.length ? parseFloat(value) : 0;
            },
        },
        status: ["PstStatutPosteLibelle"],
        raison: ["PstRaisonStatutLibelle"],
        service_instructeur: ["Financeur", "RaisonSociale"],
        annee_demande: ["Annee"],
        date_fin_triennale: {
            path: ["DateFinTriennalite"],
            adapter: value => {
                if (!value) return value;
                return ParseHelper.ExcelDateToJSDate(Number(value));
            },
        },
        updated_at: ["updated_at"],
        unique_id: ["id"],
        type_post: ["TypePoste", "Libelle"],
        ville: ["Association", "Ville"],
        code_postal: {
            path: ["Association", "CodePostal"],
            adapter: formatCP,
        },
        contact: ["Association", "ContactEmail"],
        plein_temps: ["PleinTemps"],
        bop: {
            path: ["FinanceurPrincipalCode"],
            adapter: code => {
                if (!code) return code;
                return this.getBopFromFounderCode(code);
            },
        },
    };

    private static getBopFromFounderCode(code: string) {
        const fonjepBopMap = {
            "10004": 163,
            "10005": 163,
            "10008": 147,
            "10009": 163,
            "10010": 209,
            "10012": 361,
            "10016": 163,
            "10017": 163,
        };
        return fonjepBopMap[code];
    }

    constructor(
        public legalInformations: {
            siret: Siret;
            name: string;
        },
        public indexedInformations: IFonjepIndexedInformations,
        public data: unknown,
    ) {}
}
