import { Association, EstablishmentSimplified } from "dto";
import { GrantToExtract } from "./@types/GrantToExtract";
import PaymentFlatEntity from "../../entities/flats/PaymentFlatEntity";
import { GrantFlatEntity } from "../../entities/GrantFlatEntity";

const getValue = v => v?.value;

export default class GrantMapper {
    private static findSingleProperty<T = string>(
        payments: PaymentFlatEntity[] | null,
        property: string,
        multiValue: T,
        adapter?: (v: PaymentFlatEntity) => T,
    ) {
        if (!adapter) adapter = (v: PaymentFlatEntity) => v[property];
        const values = new Set(payments?.map(versement => versement[property]));
        return values.size > 1 ? multiValue : payments?.length ? adapter(payments[0]) : undefined;
    }

    private static addressToOneLineString(address) {
        if (!address) return address;
        const { numero, type_voie, voie, code_postal, commune } = address;
        return [numero, type_voie, voie, code_postal, commune]
            .filter(str => str)
            .map(str => String(str).toUpperCase())
            .join(" ");
    }

    static extractExerciseFromGrant(application, lastPayment): number | null {
        if (application && application.budgetaryYear) return application.budgetaryYear;
        if (lastPayment && lastPayment.exerciceBudgetaire) return lastPayment.exerciceBudgetaire;
        return null;
    }

    static grantToExtractLine(
        grant: GrantFlatEntity,
        asso: Association,
        estabBySiret: Record<string, EstablishmentSimplified>,
    ): GrantToExtract {
        if (!grant.application && grant.payments.length === 0) throw new Error("grant has no application nor payment");

        const { application, payments } = grant;
        const lastPayment = grant.payments.length
            ? grant.payments?.sort((p1, p2) => p2.operationDate.getTime() - p1.operationDate.getTime())?.[0]
            : undefined;

        if (!application && !lastPayment) throw new Error("grant has no application nor payment");

        // if application undefined, at least one payment is present
        const siret = application
            ? application.beneficiaryEstablishmentId.toString()
            : (lastPayment as PaymentFlatEntity).beneficiaryEstablishmentId.toString();

        const exercise = this.extractExerciseFromGrant(application, lastPayment);

        let aggregatedPayment = {};
        if (lastPayment)
            aggregatedPayment = {
                program: GrantMapper.findSingleProperty(
                    payments,
                    "programme",
                    "multi-programmes",
                    p => `${p.programNumber} - ${p.programName}`,
                ),
                financialCenter: lastPayment
                    ? `${lastPayment.financialCenterCode} - ${lastPayment.financialCenterLabel}`
                    : undefined,
                paidAmount: payments.reduce((currentSum: number, payment) => payment.amount + currentSum, 0),
                paymentDate: lastPayment?.operationDate.toISOString().split("T")[0],
            };

        return {
            // general part
            assoName: getValue(asso.denomination_rna?.[0]) ?? getValue(asso.denomination_siren?.[0]) ?? "",
            assoRna: getValue(asso.rna?.[0]) ?? "",
            estabAddress: GrantMapper.addressToOneLineString(getValue(estabBySiret[siret]?.adresse?.[0])),

            // application part
            exercice: exercise,
            action: grant.application?.object ?? undefined,
            askedAmount: application?.requestedAmount ?? undefined,
            grantedAmount: application?.grantedAmount ?? undefined,
            instructor: application?.instructiveDepartmentName ?? undefined,
            measure: application?.scheme ?? undefined,
            siret,
            postalCode: estabBySiret[siret]?.adresse?.[0]?.value?.code_postal,
            status: application?.statusLabel,

            // payment part
            ...aggregatedPayment,
        };
    }
}
