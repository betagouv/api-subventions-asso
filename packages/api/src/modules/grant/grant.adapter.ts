import { ChorusPayment, Grant, Payment } from "dto";
import { GrantToExtract } from "./@types/GrantToExtract";

const getValue = v => v?.value;

export default class GrantAdapter {
    private static findSingleProperty<T = string>(
        payments: Payment[] | null,
        property: string,
        multiValue: T,
        adapter?: (v: Payment) => T,
    ) {
        if (!adapter) adapter = (v: Payment) => v[property];
        const values = new Set(payments?.map(versement => versement[property].value));
        return values.size > 1
            ? multiValue
            : payments?.length
            ? adapter(payments[0]) //
            : undefined;
    }

    static grantToCsv(grant: Grant): GrantToExtract {
        const lastPayment = grant.payments?.sort(
            (p1, p2) => p2.dateOperation.value.getTime() - p1.dateOperation.value.getTime(),
        )?.[0];

        const aggregatedPayment = {
            program: GrantAdapter.findSingleProperty(
                grant?.payments,
                "programme",
                "multi-programmes",
                p => `${getValue(p.programme)} - ${getValue(p.libelleProgramme)}`,
            ),
            // financialCenter: GrantAdapter.findSingleProperty(
            //     grant?.payments,
            //     "centreFinancier",
            //     "multi-centres financiers",
            //     p => getValue((p as ChorusPayment).centreFinancier),
            // ), // TODO choose between this and last payment below
            financialCenter: (lastPayment as ChorusPayment)?.centreFinancier?.value,
            paidAmount: grant.payments?.reduce(
                (currentSum: number, payment) => getValue(payment.amount) + currentSum,
                0,
            ),
            paymentDate: lastPayment?.dateOperation?.value.toISOString().split("T")[0],
        };

        return {
            // application part
            action: getValue(grant?.application?.actions_proposee?.[0]?.intitule),
            askedAmount: getValue(grant?.application?.montants?.demande),
            grantedAmount: getValue(grant?.application?.montants?.accorde),
            instructor: getValue(grant?.application?.service_instructeur),
            measure: getValue(grant?.application?.dispositif),
            postalCode: getValue(grant?.application?.siret), // TODO siret to code postal
            status: getValue(grant?.application?.statut_label),

            // payment part
            ...aggregatedPayment,
        };
    }
}
