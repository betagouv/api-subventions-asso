import { SiretDto } from "dto";
import { DefaultObject, ParserInfo, ParserPath } from "../../../../@types";
import IFonjepVersementIndexedInformations from "../@types/IFonjepPaymentIndexedInformations";
import { GenericParser } from "../../../../shared/GenericParser";

export default class FonjepPaymentEntity {
    public static indexedLegalInformationsPath: DefaultObject<ParserPath | ParserInfo> = {
        siret: {
            path: ["siret"],
            adapter: value => {
                if (!value) return value;
                return String(value).replace(/ /g, "");
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
                return GenericParser.ExcelDateToJSDate(Number(value));
            },
        },
        periode_fin: {
            path: ["PeriodeFin"],
            adapter: value => {
                if (!value) return value;
                return GenericParser.ExcelDateToJSDate(Number(value));
            },
        },
        date_versement: {
            path: ["DateVersement"],
            adapter: value => {
                if (!value) return value;
                return GenericParser.ExcelDateToJSDate(Number(value));
            },
        },
        montant_a_payer: ["MontantAPayer"],
        montant_paye: ["MontantPaye"],
    };

    constructor(
        public legalInformations: {
            siret: SiretDto;
        },
        public indexedInformations: IFonjepVersementIndexedInformations,
        public data: unknown,
    ) {}
}
