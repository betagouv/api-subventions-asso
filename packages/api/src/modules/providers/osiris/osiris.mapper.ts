import { ApplicationStatus, ApplicationNature } from "dto";
import OsirisActionEntity from "./entities/OsirisActionEntity";
import OsirisRequestEntity from "./entities/OsirisRequestEntity";
import { toStatusFactory } from "../providers.mapper";
import { ApplicationFlatEntity } from "../../../entities/flats/ApplicationFlatEntity";
import Siret from "../../../identifier-objects/Siret";
import Ridet from "../../../identifier-objects/Ridet";
import { CompanyIdType, EstablishmentIdType } from "../../../identifier-objects/@types/IdentifierType";
import { sanitizeFloat } from "../../../shared/helpers/NumberHelper";
import { cleanRidet, getAssoIdType, getCofinancers, getPluriannualYears, toOsirisDate } from "./osiris.helper";

export default class OsirisMapper {
    static PROVIDER_NAME = "Osiris";

    private static _statusConversionArray: { label: ApplicationStatus; providerStatusList: string[] }[] = [
        { label: ApplicationStatus.REFUSED, providerStatusList: ["Refusé"] },
        {
            label: ApplicationStatus.GRANTED,
            providerStatusList: ["Traitement Sirepa", "Traitement Chorus", "Terminé", "A évaluer"],
        },
        { label: ApplicationStatus.INELIGIBLE, providerStatusList: ["Rejeté", "Supprimé"] },
        {
            label: ApplicationStatus.PENDING,
            providerStatusList: [
                "Edition document",
                "Renvoyé au compte asso",
                "En cours d'instruction",
                "En attente superviseur",
                "En attente décision",
            ],
        },
    ];

    private static readonly toStatus = toStatusFactory(OsirisMapper._statusConversionArray);

    static toApplicationFlat(entity: OsirisRequestEntity, actions: OsirisActionEntity[]): ApplicationFlatEntity {
        const association = entity.association || {};
        const dossier = entity.dossier;
        const montants = entity.montants || {};
        const siret = association.siret as string;
        const provider = this.PROVIDER_NAME.toLowerCase();
        const budgetaryYear = dossier.exerciceBudgetaire;
        const applicationProviderId = dossier.osirisId;
        const applicationId = `${provider}-${applicationProviderId}`;
        const uniqueId = `${applicationId}-${budgetaryYear}`;
        const estabIdType = getAssoIdType(siret);

        let assoId: CompanyIdType, estabId: EstablishmentIdType;

        if (estabIdType === Siret.getName()) {
            estabId = new Siret(siret);
            assoId = estabId.toSiren();
        } else {
            estabId = new Ridet(cleanRidet(siret));
            assoId = estabId.toRid();
        }

        const assoIdType = assoId.name;
        const depositDate = toOsirisDate(dossier.dateReception) as Date;

        let ej: unknown = dossier.ej;
        let paymentId: string | null;

        if (!ej) {
            ej = null;
            paymentId = null;
        } else {
            paymentId = `${estabId}-${ej}-${budgetaryYear}`;
        }

        const cofinancersNames = getCofinancers(actions);

        return {
            uniqueId,
            applicationId,
            applicationProviderId,
            provider,
            joinKeyId: dossier.compteAssoId,
            joinKeyDesc: `N° dossier de l'outil "Le Compte Asso". Il permet de faire un lien entre la requête OSIRIS et le dossier du Compte Asso.`,
            allocatorName: null,
            allocatorIdType: null,
            allocatorId: null,
            managingAuthorityName: null,
            managingAuthorityId: null,
            managingAuthorityIdType: null,
            instructiveDepartmentName: dossier.service,
            instructiveDepartmentIdType: null,
            instructiveDepartementId: null,
            beneficiaryEstablishmentId: estabId,
            beneficiaryEstablishmentIdType: estabIdType,
            beneficiaryCompanyId: assoId,
            beneficiaryCompanyIdType: assoIdType,
            budgetaryYear,
            pluriannual: dossier.pluriannualite === "Pluriannuel",
            pluriannualYears: getPluriannualYears(entity),
            decisionDate: toOsirisDate(dossier.dateCommission) as Date | null,
            conventionDate: null,
            decisionReference: null,
            depositDate,
            requestYear: depositDate.getFullYear(),
            scheme: dossier.noProgrammeTypeFinancement,
            subScheme: dossier.sousTypeFinancement,
            statusLabel: this.toStatus(dossier.etatDossier as string),
            object: actions.map(action => action.caracteristiques?.intitule).join("|"),
            nature: ApplicationNature.MONEY,
            requestedAmount: sanitizeFloat(montants.demande),
            grantedAmount: sanitizeFloat(montants.accorde),
            totalAmount: null,
            ej,
            paymentId,
            paymentCondition: null,
            paymentConditionDesc: null,
            paymentPeriodDates: null,
            cofinancersNames: cofinancersNames,
            cofinancingRequested: cofinancersNames.length > 0,
            cofinancersIdType: null,
            confinancersId: null,
            idRAE: null,
            ueNotification: null,
            subventionPercentage: null,
            updateDate: entity.updateDate,
        } as ApplicationFlatEntity;
    }
}
