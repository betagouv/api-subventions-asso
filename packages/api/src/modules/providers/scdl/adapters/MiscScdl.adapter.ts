import { ApplicationStatus, ApplicationNature, PaymentCondition } from "dto";
import { ApplicationFlatEntity } from "../../../../entities/ApplicationFlatEntity";
import { GenericAdapter } from "../../../../shared/GenericAdapter";
import { ScdlGrantDbo } from "../dbo/ScdlGrantDbo";
import Siret from "../../../../identifierObjects/Siret";

export default class MiscScdlAdapter {
    private static normalizePaymentConditions(rawValue?: string): PaymentCondition | null {
        if (typeof rawValue != "string") return null;
        if (rawValue.match(/unique/gi)) return PaymentCondition.UNIQUE;
        if (rawValue.match(/[eé]chelonn[eé]/gi)) return PaymentCondition.PHASED;
        return PaymentCondition.OTHER;
    }

    private static normalizePaymentNature(rawValue?: string): ApplicationNature | null {
        if (typeof rawValue != "string") return null;
        if (rawValue.match(/(aide |versement )?(en )?num[ée]raire/gi)) return ApplicationNature.MONEY;
        if (rawValue.match(/(aide )?(en )?nature/gi)) return ApplicationNature.NATURE;
        return null;
    }

    private static getNormalizedPaymentDates(paymentStartDate?: Date, paymentEndDate?: Date): Date[] {
        const res: Date[] = [];
        if (paymentStartDate) res.push(paymentStartDate);
        if (paymentEndDate) res.push(paymentEndDate);
        return res;
    }

    static dboToApplicationFlat(dbo: ScdlGrantDbo): ApplicationFlatEntity {
        const dataHash = dbo._id.toString();

        return {
            requestYear: GenericAdapter.NOT_APPLICABLE_VALUE,
            pluriannualYears: GenericAdapter.NOT_APPLICABLE_VALUE,

            cofinancingRequested: GenericAdapter.NOT_APPLICABLE_VALUE,
            paymentCondition: MiscScdlAdapter.normalizePaymentConditions(dbo.paymentConditions),
            conventionDate: dbo.conventionDate ?? null,
            decisionDate: GenericAdapter.NOT_APPLICABLE_VALUE,
            depositDate: GenericAdapter.NOT_APPLICABLE_VALUE,
            paymentPeriodDates: MiscScdlAdapter.getNormalizedPaymentDates(dbo.paymentStartDate, dbo.paymentEndDate),
            paymentConditionDesc: dbo.paymentConditions ?? null, // potentially redundant but else info are missing
            joinKeyDesc: GenericAdapter.NOT_APPLICABLE_VALUE,
            scheme: dbo.aidSystem ?? null,
            ej: GenericAdapter.NOT_APPLICABLE_VALUE,
            budgetaryYear: dbo.exercice,
            allocatorId: dbo.allocatorSiret,
            managingAuthorityId: null,
            confinancersId: GenericAdapter.NOT_APPLICABLE_VALUE,
            beneficiaryEstablishmentId: dbo.associationSiret,
            joinKeyId: GenericAdapter.NOT_APPLICABLE_VALUE,
            idRAE: dbo.idRAE ?? null,
            applicationId: GenericAdapter.NOT_APPLICABLE_VALUE,
            applicationProviderId: GenericAdapter.NOT_APPLICABLE_VALUE,
            instructiveDepartementId: GenericAdapter.NOT_APPLICABLE_VALUE,
            uniqueId: `${dbo.producerSlug}-${dbo.exercice}-${dataHash}`,
            paymentId: GenericAdapter.NOT_APPLICABLE_VALUE,
            grantedAmount: dbo.amount, // TODO pourcentage subv ? I think not
            requestedAmount: null,
            totalAmount: dbo.amount,
            nature: MiscScdlAdapter.normalizePaymentNature(dbo.paymentNature),
            allocatorName: dbo.allocatorName,
            managingAuthorityName: GenericAdapter.NOT_APPLICABLE_VALUE,
            instructiveDepartmentName: GenericAdapter.NOT_APPLICABLE_VALUE,
            cofinancersNames: GenericAdapter.NOT_APPLICABLE_VALUE,
            ueNotification: dbo.UeNotification ?? null,
            object: dbo.object ?? null,
            pluriannual: GenericAdapter.NOT_APPLICABLE_VALUE,
            subventionPercentage: dbo.grantPercentage ?? null,
            provider: `scdl-${dbo.producerSlug}`,
            decisionReference: dbo.decisionReference ?? null,
            subScheme: GenericAdapter.NOT_APPLICABLE_VALUE,
            statusLabel: ApplicationStatus.GRANTED,
            allocatorIdType: "siret",
            managingAuthorityIdType: GenericAdapter.NOT_APPLICABLE_VALUE,
            cofinancersIdType: GenericAdapter.NOT_APPLICABLE_VALUE,
            instructiveDepartmentIdType: GenericAdapter.NOT_APPLICABLE_VALUE,
            beneficiaryEstablishmentIdType: Siret.getName(),
            updateDate: dbo.updateDate,
        };
    }
}
