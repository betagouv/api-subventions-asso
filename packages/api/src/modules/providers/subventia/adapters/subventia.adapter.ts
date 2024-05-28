import { ApplicationStatus } from "dto";
import * as ParseHelper from "../../../../shared/helpers/ParserHelper";
import { ExcelDateToJSDate } from "../../../../shared/helpers/ParserHelper";

import subventiaService from "../subventia.service";

export default class SubventiaAdapter {
    static applicationToEntity(application) {
        return {
            ...ParseHelper.indexDataByPathObject(subventiaMapper, application),
            provider: subventiaService.provider.id,
        };
    }
}

const statusMapper = {
    INSTRUCTION: ApplicationStatus.PENDING,
    FININSTRUCTION: ApplicationStatus.PENDING,
    VOTE: ApplicationStatus.GRANTED,
    SOLDE: ApplicationStatus.GRANTED,
};

const subventiaMapper = {
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
            if (!value) return "REFUSED";
            return statusMapper[value];
        },
    },
};
