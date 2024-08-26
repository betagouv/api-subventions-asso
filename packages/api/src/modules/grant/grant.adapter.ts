import { Association, ChorusPayment, FonjepPayment, Grant, Payment, SimplifiedEtablissement } from "dto";
import paymentService from "../payments/payments.service";
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

    static grantToExtractLines(
        grant: Grant,
        asso: Association,
        estabBySiret: Record<string, SimplifiedEtablissement>,
    ): GrantToExtract {
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
            joinKey: grant.payments?.[0]?.versementKey?.value ?? grant.application?.versementKey?.value,
        };

        const siret = getValue(grant?.application?.siret);
        return {
            // general part
            assoName: getValue(asso.denomination_rna?.[0]) ?? getValue(asso.denomination_siren?.[0]) ?? "",
            assoRna: getValue(asso.rna?.[0]) ?? "",
            estabAddress: getValue(estabBySiret[siret].adresse?.[0]),

            // application part
            exercice:
                grant?.application?.annee_demande?.value ??
                paymentService.getPaymentExercise((grant?.payments as Payment[])[0]),
            action: getValue(grant?.application?.actions_proposee?.[0]?.intitule),
            askedAmount: getValue(grant?.application?.montants?.demande),
            grantedAmount: getValue(grant?.application?.montants?.accorde),
            instructor: getValue(grant?.application?.service_instructeur),
            measure: getValue(grant?.application?.dispositif),
            siret,
            postalCode: estabBySiret[siret].adresse?.[0]?.value?.code_postal, // TODO siret to code postal
            status: getValue(grant?.application?.statut_label),

            // payment part
            ...aggregatedPayment,
        };
    }
}
