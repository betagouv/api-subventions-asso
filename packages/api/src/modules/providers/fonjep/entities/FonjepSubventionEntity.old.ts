import { SiretDto } from "dto";
import { ParserInfo, ParserPath, DefaultObject } from "../../../../@types";
import type FonjepIndexedInformations from "../@types/FonjepIndexedInformations";
import { formatCP } from "../../../../shared/helpers/DataFormatHelper";
import { GenericParser } from "../../../../shared/GenericParser";

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
        // TODO <string|number>
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
                return GenericParser.ExcelDateToJSDate(Number(value));
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
    };

    constructor(
        public legalInformations: {
            siret: SiretDto;
            name: string;
        },
        public indexedInformations: FonjepIndexedInformations,
        public data: unknown,
    ) {}
}
