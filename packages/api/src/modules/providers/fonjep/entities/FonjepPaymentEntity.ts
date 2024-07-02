import { Siret } from "dto";
import { DefaultObject, ParserInfo, ParserPath } from "../../../../@types";
import IFonjepVersementIndexedInformations from "../@types/IFonjepPaymentIndexedInformations";
import * as ParseHelper from "../../../../shared/helpers/ParserHelper";

export default class FonjepPaymentEntity {
    public static indexedLegalInformationsPath: DefaultObject<ParserPath | ParserInfo> = {
        siret: {
            path: ["siret"],
            adapter: value => {
                if (!value) return value;
                return value.replace(/ /g, "");
            },
        },
    };

    public static indexedProviderInformationsPath: DefaultObject<ParserPath | ParserInfo> = {
        // TODO <string|number>
        unique_id: ["id"],
        updated_at: ["updated_at"],
        code_poste: ["PosteCode"],
        bop: ["bop"],
        periode_debut: {
            path: ["PeriodeDebut"],
            adapter: value => {
                if (!value) return value;
                return ParseHelper.ExcelDateToJSDate(Number(value));
            },
        },
        periode_fin: {
            path: ["PeriodeFin"],
            adapter: value => {
                if (!value) return value;
                return ParseHelper.ExcelDateToJSDate(Number(value));
            },
        },
        date_versement: {
            path: ["DateVersement"],
            adapter: value => {
                if (!value) return value;
                return ParseHelper.ExcelDateToJSDate(Number(value));
            },
        },
        montant_a_payer: ["MontantAPayer"],
        montant_paye: ["MontantPaye"],
    };

    constructor(
        public legalInformations: {
            siret: Siret;
        },
        public indexedInformations: IFonjepVersementIndexedInformations,
        public data: unknown,
    ) {}
}
