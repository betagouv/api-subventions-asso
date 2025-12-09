import { Association, EstablishmentSimplified } from "dto";
import { GrantToExtract } from "./@types/GrantToExtract";
import PaymentFlatEntity from "../../entities/PaymentFlatEntity";
import { GrantFlatEntity } from "../../entities/GrantFlatEntity";

const getValue = v => v?.value;

export default class GrantAdapter {
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

    static grantToExtractLine(
        grant: GrantFlatEntity,
        asso: Association,
        estabBySiret: Record<string, EstablishmentSimplified>,
    ): GrantToExtract {
        const lastPayment: PaymentFlatEntity | undefined = grant.payments?.sort(
            (p1, p2) => p2.operationDate.getTime() - p1.operationDate.getTime(),
        )?.[0];

        const { application, payments } = grant;

        const aggregatedPayment = {
            program: GrantAdapter.findSingleProperty(
                payments,
                "programme",
                "multi-programmes",
                p => `${p.programNumber} - ${p.programName}`,
            ),
            financialCenter: lastPayment
                ? `${lastPayment.centreFinancierCode} - ${lastPayment.centreFinancierLibelle}`
                : undefined,
            paidAmount: payments.reduce((currentSum: number, payment) => payment.amount + currentSum, 0),
            paymentDate: lastPayment?.operationDate.toISOString().split("T")[0],
        };

        const siret =
            application?.beneficiaryEstablishmentId.toString() || lastPayment.idEntrepriseBeneficiaire.toString();
        return {
            // general part
            assoName: getValue(asso.denomination_rna?.[0]) ?? getValue(asso.denomination_siren?.[0]) ?? "",
            assoRna: getValue(asso.rna?.[0]) ?? "",
            estabAddress: GrantAdapter.addressToOneLineString(getValue(estabBySiret[siret]?.adresse?.[0])),

            // application part
            exercice: grant.application?.budgetaryYear || lastPayment.exerciceBudgetaire,
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
