import { ApplicationDto, ApplicationStatus, DemandeSubvention } from "dto";
import * as ParseHelper from "../../../../shared/helpers/ParserHelper";
import { ExcelDateToJSDate } from "../../../../shared/helpers/ParserHelper";

import subventiaService from "../subventia.service";
import SubventiaDto from "../@types/subventia.dto";
import SubventiaEntity, { SubventiaDbo } from "../@types/subventia.entity";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";

export default class SubventiaAdapter {
    static applicationToEntity(application: SubventiaDto, exportDate: Date): SubventiaEntity {
        return {
            ...ParseHelper.indexDataByPathObject(subventiaMapper, application),
            provider: subventiaService.provider.id,
            exportDate: exportDate,
        } as SubventiaEntity;
    }

    public static toDemandeSubventionDto(dbo: SubventiaDbo): DemandeSubvention {
        const lastUpdateDate = new Date(dbo["exportDate"]);
        const toPV = ProviderValueFactory.buildProviderValueAdapter(subventiaService.provider.name, lastUpdateDate);

        return {
            siret: toPV(dbo.siret),
            service_instructeur: toPV(dbo.service_instructeur),
            status: toPV(dbo.status),
            statut_label: toPV(dbo.statut_label),
            montants: {
                accorde: toPV(dbo.montants_accorde),
                demande: toPV(dbo.montants_demande),
            },
            date_commision: toPV(dbo.date_commission),
            annee_demande: toPV(dbo.annee_demande),
            dispositif: toPV(dbo.dispositif),
            sous_dispositif: toPV(dbo.sous_dispositif),
        };
    }

    public static toCommon(dbo: SubventiaDbo): ApplicationDto {
        return {
            dispositif: dbo["dispositif"],
            exercice: dbo["annee_demande"],
            montant_accorde: dbo["montants_accorde"],
            montant_demande: dbo["montants_demande"],
            objet: dbo["sous_dispositif"],
            service_instructeur: dbo["service_instructeur"],
            siret: dbo["siret"],
            statut: dbo["statut_label"],
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
    statut_label: {
        path: ["Statut - Dossier de financement"],
        adapter: value => {
            // an emtpy value of this attribute means the application is refused
            if (!value) return ApplicationStatus.REFUSED;
            return statusMapper[value];
        },
    },
    status: {
        path: ["Statut - Dossier de financement"],
        adapter: value => {
            if (!value) return "REFUSED";
            return value;
        },
    },
};
