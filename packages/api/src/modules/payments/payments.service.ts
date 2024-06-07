import { Siren, Siret, Payment, DemandeSubvention } from "dto";
import providers from "../providers";
import { AssociationIdentifiers } from "../../@types";
import { getIdentifierType } from "../../shared/helpers/IdentifierHelper";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
import AssociationIdentifierError from "../../shared/errors/AssociationIdentifierError";
import { NotFoundError } from "../../shared/errors/httpErrors";
import rnaSirenService from "../rna-siren/rnaSiren.service";
import PaymentProvider from "./@types/PaymentProvider";

export class PaymentsService {
    async getPaymentsByAssociation(identifier: AssociationIdentifiers) {
        const type = getIdentifierType(identifier);
        if (!type || type === StructureIdentifiersEnum.siret) throw new AssociationIdentifierError();

        let siren = type === StructureIdentifiersEnum.siren ? identifier : null;
        if (!siren) {
            const rnaSirenEntities = await rnaSirenService.find(identifier);
            if (rnaSirenEntities && rnaSirenEntities.length) siren = rnaSirenEntities[0].siren;
        }

        if (!siren) throw new NotFoundError("Impossible to recover the SIREN");

        return this.getPaymentsBySiren(siren);
    }

    hasPayments(demandeSubvention: DemandeSubvention) {
        return !!(demandeSubvention.versementKey && demandeSubvention.versementKey.value);
    }

    filterPaymentsByKey(payments, key) {
        if (!payments) return null;
        return payments.filter(payment => (payment.ej?.value || payment.codePoste?.value) === key);
    }

    async getPaymentsBySiret(siret: Siret): Promise<Payment[]> {
        const providers = this.getProviders();
        return [...(await Promise.all(providers.map(p => p.getPaymentsBySiret(siret)))).flat()];
    }

    private async getPaymentsBySiren(siren: Siren) {
        const providers = this.getProviders();
        return [...(await Promise.all(providers.map(p => p.getPaymentsBySiren(siren)))).flat()];
    }

    private getProviders(): PaymentProvider[] {
        return Object.values(providers).filter(p => this.isPaymentProvider(p)) as unknown as PaymentProvider[];
    }

    private isPaymentProvider(data: unknown): data is PaymentProvider {
        return (data as PaymentProvider).isPaymentProvider;
    }
}

const paymentService = new PaymentsService();

export default paymentService;
