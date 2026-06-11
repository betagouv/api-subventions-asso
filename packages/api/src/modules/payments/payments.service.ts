import { ChorusPayment, DemandeSubvention, FonjepPayment, Payment } from "dto";
import { StructureIdentifier } from "../../identifier-objects/@types/StructureIdentifier";
import paymentFlatService from "../payment-flat/payment-flat.service";

export class PaymentsService {
    async getPaiements(identifier: StructureIdentifier) {
        return paymentFlatService.getPaiements(identifier);
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
