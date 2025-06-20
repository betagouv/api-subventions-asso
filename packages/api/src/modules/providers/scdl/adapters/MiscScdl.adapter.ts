import { ApplicationStatus, DemandeSubvention, CommonApplicationDto } from "dto";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import { sameDateNextYear } from "../../../../shared/helpers/DateHelper";
import MiscScdlGrantProducerEntity from "../entities/MiscScdlGrantProducerEntity";
import { ScdlGrantEntity } from "../@types/ScdlGrantEntity";
import { RawApplication } from "../../../grant/@types/rawGrant";
import { ApplicationFlatEntity, ApplicationNature, PaymentCondition } from "../../../../entities/ApplicationFlatEntity";
import { GenericAdapter } from "../../../../shared/GenericAdapter";
import crypto from "crypto";

export default class MiscScdlAdapter {
    public static toDemandeSubvention(entity: MiscScdlGrantProducerEntity): DemandeSubvention {
        const lastUpdateDate = new Date(entity.producer.lastUpdate);
        const toPV = ProviderValueFactory.buildProviderValueAdapter(entity.producer.name, lastUpdateDate);
        const amount = toPV(entity.amount);

        const commisionDate = entity.conventionDate ? toPV(entity.conventionDate) : toPV(new Date(entity.exercice));

        return {
            siret: toPV(entity.associationSiret),
            service_instructeur: toPV(entity.allocatorName),
            actions_proposee: [{ intitule: toPV(entity.object || "") }],
            statut_label: toPV(MiscScdlAdapter._status(entity)),
            status: toPV(MiscScdlAdapter._status(entity)),
            montants: {
                accorde: amount,
            },
            date_commision: commisionDate, // doubt
            financeur_principal: toPV(entity.allocatorName),
            annee_demande: toPV(entity.exercice), // doubt
            pluriannualite: toPV(MiscScdlAdapter._multiannuality(entity)),
        };
    }

    public static toCommon(entity: ScdlGrantEntity): CommonApplicationDto {
        return {
            exercice: entity.exercice,
            dispositif: "",
            montant_accorde: entity.amount,
            objet: entity.object || "",
            service_instructeur: entity.allocatorName,
            siret: entity.allocatorSiret,
            statut: MiscScdlAdapter._status(entity),
        };
    }

    static rawToApplication(rawApplication: RawApplication<MiscScdlGrantProducerEntity>) {
        return this.toDemandeSubvention(rawApplication.data);
    }

    static toRawApplication(entity: MiscScdlGrantProducerEntity) {
        const rawApplication: RawApplication<MiscScdlGrantProducerEntity> = {
            provider: entity.producer.name,
            type: "application",
            data: entity,
        };

        return rawApplication;
    }

    private static _multiannuality(entity: MiscScdlGrantProducerEntity) {
        if (!entity.paymentEndDate || !entity.paymentStartDate) return "Non";
        const startNextYear = sameDateNextYear(entity.paymentStartDate);
        return entity.paymentEndDate >= startNextYear ? "Oui" : "Non";
    }

    private static _status(entity: MiscScdlGrantProducerEntity | ScdlGrantEntity) {
        // not given by provider but this is the rule from Paris
        return entity.amount > 0 ? ApplicationStatus.GRANTED : ApplicationStatus.REFUSED;
    }

    private static normalizePaymentConditions(rawValue?: string): PaymentCondition | null {
        if (!rawValue) return null;
        if (rawValue.match(/unique/gi)) return PaymentCondition.UNIQUE;
        if (rawValue.match(/[eé]chelonn[eé]/gi)) return PaymentCondition.PHASED;
        return PaymentCondition.OTHER;
    }

    private static normalizePaymentNature(rawValue?: string): ApplicationNature | null {
        if (!rawValue) return null;
        if (rawValue.match(/(aide |versement )?(en )?num[ée]raire/gi)) return ApplicationNature.MONEY;
        if (rawValue.match(/(aide )?(en )?nature/gi)) return ApplicationNature.NATURE;
        return null;
    }

    private static getNormalizedPaymentDates(entity: MiscScdlGrantProducerEntity): Date[] {
        const res: Date[] = [];
        if (entity?.paymentStartDate) res.push(entity.paymentStartDate);
        if (entity?.paymentEndDate) res.push(entity.paymentEndDate);
        return res;
    }

    static toApplicationFlat(entity: MiscScdlGrantProducerEntity, lastUpdate: Date): ApplicationFlatEntity {
        const dataHash = crypto.createHash("md5").update(JSON.stringify(entity)).digest("hex"); // TODO reather use same than in dbo to find back the raw data
        const nature = MiscScdlAdapter.normalizePaymentNature(entity.paymentNature);

        return {
            requestYear: GenericAdapter.NOT_APPLICABLE_VALUE,
            pluriannualYears: GenericAdapter.NOT_APPLICABLE_VALUE,

            cofinancingRequested: GenericAdapter.NOT_APPLICABLE_VALUE,
            paymentCondition: MiscScdlAdapter.normalizePaymentConditions(entity.paymentConditions),
            conventionDate: entity.conventionDate ?? null,
            decisionDate: GenericAdapter.NOT_APPLICABLE_VALUE,
            depositDate: GenericAdapter.NOT_APPLICABLE_VALUE,
            paymentPeriodDates: MiscScdlAdapter.getNormalizedPaymentDates(entity),
            paymentConditionDesc: entity.paymentConditions ?? null, // potentially redundant but else info are missing
            joinKeyDesc: GenericAdapter.NOT_APPLICABLE_VALUE,
            scheme: entity.aidSystem ?? null,
            ej: GenericAdapter.NOT_APPLICABLE_VALUE,
            budgetaryYear: entity.exercice,
            allocatorId: entity.allocatorSiret,
            managingAuthorityId: null,
            confinancersId: GenericAdapter.NOT_APPLICABLE_VALUE,
            beneficiaryEstablishmentId: entity.allocatorSiret,
            joinKeyId: GenericAdapter.NOT_APPLICABLE_VALUE,
            idRAE: entity.idRAE ?? null,
            applicationId: GenericAdapter.NOT_APPLICABLE_VALUE,
            applicationProviderId: GenericAdapter.NOT_APPLICABLE_VALUE,
            instructiveDepartementId: GenericAdapter.NOT_APPLICABLE_VALUE,
            uniqueId: `${entity.producerSlug}-${entity.exercice}-${dataHash}`,
            paymentId: GenericAdapter.NOT_APPLICABLE_VALUE,
            grantedAmount: entity.amount, // TODO pourcentage subv ? I think not
            requestedAmount: null,
            totalAmount: entity.amount,
            nature: nature,
            allocatorName: entity.allocatorName,
            managingAuthorityName: GenericAdapter.NOT_APPLICABLE_VALUE,
            instructiveDepartmentName: GenericAdapter.NOT_APPLICABLE_VALUE,
            cofinancersNames: GenericAdapter.NOT_APPLICABLE_VALUE,
            ueNotification: entity.UeNotification ?? null,
            object: entity.object ?? null,
            pluriannual: GenericAdapter.NOT_APPLICABLE_VALUE,
            subventionPercentage: entity.grantPercentage ?? null,
            provider: `scdl-${entity.producerSlug}`,
            decisionReference: entity.decisionReference ?? null,
            subScheme: GenericAdapter.NOT_APPLICABLE_VALUE,
            statusLabel: ApplicationStatus.GRANTED,
            allocatorIdType: "siret",
            managingAuthorityIdType: GenericAdapter.NOT_APPLICABLE_VALUE,
            cofinancersIdType: GenericAdapter.NOT_APPLICABLE_VALUE,
            instructiveDepartmentIdType: GenericAdapter.NOT_APPLICABLE_VALUE,
            beneficiaryEstablishmentIdType: "siret",
            updateDate: lastUpdate,
        };
    }
}
