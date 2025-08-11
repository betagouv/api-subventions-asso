import { CommonApplicationDto, ApplicationStatus, DemandeSubvention } from "dto";

import subventiaService from "../subventia.service";
import SubventiaDto from "../@types/subventia.dto";
import SubventiaEntity, { SubventiaDbo } from "../@types/subventia.entity";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import { DefaultObject, ParserInfo } from "../../../../@types";
import { GenericParser } from "../../../../shared/GenericParser";
import { RawApplication } from "../../../grant/@types/rawGrant";
import { ApplicationFlatEntity, ApplicationNature } from "../../../../entities/ApplicationFlatEntity";
import { GenericAdapter } from "../../../../shared/GenericAdapter";
import Siret from "../../../../identifierObjects/Siret";

export default class SubventiaAdapter {
    static PROVIDER_NAME = "subventia";

    static applicationToEntity(application: SubventiaDto, exportDate: Date): SubventiaEntity {
        return {
            ...GenericParser.indexDataByPathObject<string | number>(
                subventiaMapper as DefaultObject<ParserInfo<number | string>>,
                application as DefaultObject<string | number>,
            ), // TODO <string|number>
            provider: subventiaService.provider.id,
            updateDate: exportDate,
        } as SubventiaEntity;
    }

    public static toDemandeSubventionDto(entity: SubventiaEntity): DemandeSubvention {
        const lastUpdateDate = new Date(entity["exportDate"]);
        const toPV = ProviderValueFactory.buildProviderValueAdapter(subventiaService.provider.name, lastUpdateDate);

        return {
            siret: toPV(entity.siret),
            service_instructeur: toPV(entity.service_instructeur),
            status: toPV(entity.status),
            statut_label: toPV(entity.statut_label),
            montants: {
                accorde: toPV(entity.montants_accorde),
                demande: toPV(entity.montants_demande),
            },
            date_commision: toPV(entity.date_commission),
            annee_demande: toPV(entity.annee_demande),
            dispositif: toPV(entity.dispositif),
            sous_dispositif: toPV(entity.sous_dispositif),
        };
    }

    // TODO: unit test
    public static rawToApplication(rawApplication: RawApplication<SubventiaEntity>) {
        return this.toDemandeSubventionDto(rawApplication.data);
    }

    public static toCommon(dbo: SubventiaDbo): CommonApplicationDto {
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

    public static getApplicatinStatus(status: string): ApplicationStatus {
        if (status === "INSTRUCTION") return ApplicationStatus.PENDING;
        if (status === "FININSTRUCTION") return ApplicationStatus.PENDING;
        if (status === "VOTE") return ApplicationStatus.GRANTED;
        return ApplicationStatus.REFUSED;
    }

    public static toApplicationFlat(dbo: SubventiaDbo): Omit<ApplicationFlatEntity, "updateDate"> {
        const provider = this.PROVIDER_NAME.toLowerCase(); // replace this with #3338
        const applicationProviderId = dbo.reference_demande;
        const applicationId = `${provider}-${applicationProviderId}`;
        const uniqueId = `${applicationId}-null`; // we cannot assert financial year so we set it to null for now

        const scheme = dbo.dispositif ? dbo.dispositif : "Subventions FIPD Intervention"; // null when application is rejected but seems always equal to "Subventions FIPD Intervention" when not

        return {
            uniqueId,
            applicationId,
            applicationProviderId,
            provider,
            joinKeyId: GenericAdapter.NOT_APPLICABLE_VALUE,
            joinKeyDesc: GenericAdapter.NOT_APPLICABLE_VALUE,
            allocatorName: "CIPDR",
            allocatorId: null,
            allocatorIdType: null,
            managingAuthorityName: GenericAdapter.NOT_APPLICABLE_VALUE,
            managingAuthorityId: GenericAdapter.NOT_APPLICABLE_VALUE,
            managingAuthorityIdType: GenericAdapter.NOT_APPLICABLE_VALUE,
            instructiveDepartmentName: dbo.service_instructeur,
            instructiveDepartmentIdType: null,
            instructiveDepartementId: null,
            beneficiaryEstablishmentId: dbo.siret,
            beneficiaryEstablishmentIdType: Siret.getName(),
            budgetaryYear: null,
            pluriannual: null,
            pluriannualYears: null, // null for now, see #3575 for updates
            decisionDate: dbo.date_commission,
            conventionDate: null,
            decisionReference: null,
            depositDate: null,
            requestYear: dbo.annee_demande,
            scheme,
            subScheme: dbo.sous_dispositif,
            statusLabel: this.getApplicatinStatus(dbo.statut_label),
            object: null,
            nature: ApplicationNature.MONEY,
            requestedAmount: dbo.montants_demande,
            grantedAmount: dbo.montants_accorde,
            totalAmount: GenericAdapter.NOT_APPLICABLE_VALUE,
            ej: null, // TODO: how to obtain this ?
            paymentId: null, // requires ej and financial year
            paymentCondition: null,
            paymentConditionDesc: null,
            paymentPeriodDates: null,
            cofinancingRequested: null,
            cofinancersNames: null,
            cofinancersIdType: null,
            confinancersId: null,
            idRAE: null,
            ueNotification: null,
            subventionPercentage: null,
        };
    }
}

const statusMapper = {
    INSTRUCTION: ApplicationStatus.PENDING,
    FININSTRUCTION: ApplicationStatus.PENDING,
    VOTE: ApplicationStatus.GRANTED,
    SOLDE: ApplicationStatus.GRANTED,
};

const subventiaMapper: DefaultObject<ParserInfo> = {
    // TODO <string|number>
    reference_demande: { path: ["Référence administrative - Demande"] },
    service_instructeur: { path: ["Financeur Principal"] },
    annee_demande: { path: ["annee_demande"] },
    siret: { path: ["SIRET - Demandeur"] },
    date_commision: {
        path: ["Date - Décision"],
        adapter: value => {
            if (!value) return value;
            return GenericParser.ExcelDateToJSDate(parseInt(value, 10));
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
