import { SubventiaDbo } from "../@types/ISubventiaIndexedInformation";
import { ParserInfo, ParserPath, DefaultObject } from "../../../../@types";
import { ExcelDateToJSDate } from "../../../../shared/helpers/ParserHelper";

// Est-ce qu'on souhaite replacer les nulls du dispositifs par FIPDR car on sait
// que toutes les données ici sont relatives au même dispositif ?

export default class SubventiaLineEntity {
    public provider = "Subventia";

    public static indexedInformationsPath: DefaultObject<ParserPath | ParserInfo> = {
        reference_demande: { path: ["Référence administrative - Demande"] },
        service_instructeur: { path: ["Financeur Principal"] },
        annee_demande: { path: ["annee_demande"] },
        siret: { path: ["SIRET - Demandeur"] },
        date_commision: {
            path: ["Date - Décision"],
            adapter: value => {
                if (!value) return value;
                return ExcelDateToJSDate(parseInt(value, 10));
            },
        },
        montants_accorde: { path: ["Montant voté TTC - Décision"] },
        montants_demande: { path: ["Montant Ttc"] },
        dispositif: { path: ["Dispositif - Dossier de financement"] },
        sous_dispositif: { path: ["Thematique Title"] },
        status: {
            path: ["Statut - Dossier de financement"],
            adapter: value => {
                if (!value) return "Refused";
                return value;
            },
        },
    };

    constructor(public subventiaDbo: SubventiaDbo) {}
}
