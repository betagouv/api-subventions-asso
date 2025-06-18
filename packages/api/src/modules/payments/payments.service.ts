import { ChorusPayment, DemandeSubvention, FonjepPayment, Payment } from "dto";
import { paymentProviders } from "../providers";
import { StructureIdentifier } from "../../identifierObjects/@types/StructureIdentifier";

export class PaymentsService {
    async getPayments(identifier: StructureIdentifier) {
        return [...(await Promise.all(paymentProviders.map(p => p.getPayments(identifier)))).flat()];
    }

    /**
     * Function dont used
     * @param demandeSubvention
     * @deprecated
     * @returns
     */
    hasPayments(demandeSubvention: DemandeSubvention) {
        return !!(demandeSubvention.versementKey && demandeSubvention.versementKey.value);
    }

    filterPaymentsByKey(payments: Payment[], key: string) {
        if (!payments) return null;
        return payments.filter(payment => {
            const paymentKey = (payment as ChorusPayment).ej?.value || (payment as FonjepPayment).codePoste?.value;

            return paymentKey === key;
        });
    }

    getPaymentExercise(payment: Payment | undefined) {
        if (!payment) return undefined;
        return payment?.dateOperation?.value?.getFullYear();
    }
}

const paymentService = new PaymentsService();

export default paymentService;
