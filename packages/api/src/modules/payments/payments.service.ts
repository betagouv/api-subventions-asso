import { ChorusPayment, DemandeSubvention, FonjepPayment, Payment } from "dto";
import { paymentProviders } from "../providers";
import { StructureIdentifier } from "../../@types";

export class PaymentsService {
    async getPayments(identifier: StructureIdentifier) {
        return [...(await Promise.all(paymentProviders.map(p => p.getPayments(identifier)))).flat()];
    }

    hasPayments(demandeSubvention: DemandeSubvention) {
        // Ca c'est chelou, le type du params je veux dire
        return !!(demandeSubvention.versementKey && demandeSubvention.versementKey.value);
    }

    filterPaymentsByKey(payments: Payment[], key: string) {
        if (!payments) return null;
        return payments.filter(payment => {
            const paymentKey = (payment as ChorusPayment).ej?.value || (payment as FonjepPayment).codePoste?.value;

            return paymentKey === key;
        });
    }
}

const paymentService = new PaymentsService();

export default paymentService;
