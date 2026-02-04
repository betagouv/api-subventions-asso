import { ApplicationStatus, ApplicationNature } from "dto";
import subventiaService from "../subventia.service";
import SubventiaDto from "../@types/subventia.dto";
import SubventiaEntity, { SubventiaDbo } from "../@types/subventia.entity";
import { DefaultObject, ParserInfo } from "../../../../@types";
import { GenericParser } from "../../../../shared/GenericParser";
import { ApplicationFlatEntity } from "../../../../entities/flats/ApplicationFlatEntity";
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
            provider: subventiaService.meta.id,
            updateDate: exportDate,
        } as SubventiaEntity;
    }

    public static toApplicationFlat(dbo: SubventiaDbo): ApplicationFlatEntity {
        const provider = this.PROVIDER_NAME.toLowerCase(); // replace this with #3338
        const applicationProviderId = dbo.reference_demande;
        const applicationId = `${provider}-${applicationProviderId}`;
        const uniqueId = `${applicationId}-null`; // we cannot assert financial year so we set it to null for now

        const scheme = dbo.dispositif ? dbo.dispositif : "Subventions FIPD Intervention"; // null when application is rejected but seems always equal to "Subventions FIPD Intervention" when not

        const beneficiaryEstablishmentId = new Siret(dbo.siret);
        const beneficiaryCompanyId = beneficiaryEstablishmentId.toSiren();

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
            beneficiaryEstablishmentId,
            beneficiaryEstablishmentIdType: beneficiaryEstablishmentId.name,
            beneficiaryCompanyId,
            beneficiaryCompanyIdType: beneficiaryCompanyId.name,
            budgetaryYear: null, // we should ask the provider how to get that in the futur
            pluriannual: null,
            pluriannualYears: null, // null for now, see #3575 for updates
            decisionDate: dbo.date_commission,
            conventionDate: null,
            decisionReference: null,
            depositDate: null,
            requestYear: dbo.annee_demande,
            scheme,
            subScheme: dbo.sous_dispositif,
            statusLabel: statusMapper[dbo.status],
            object: null,
            nature: ApplicationNature.MONEY,
            requestedAmount: dbo.montants_demande,
            grantedAmount: dbo.montants_accorde,
            totalAmount: GenericAdapter.NOT_APPLICABLE_VALUE,
            ej: null, // TODO: we should ask provider how to get that in the futur
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
            updateDate: dbo.updateDate,
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
