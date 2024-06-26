import { Siren, Siret, Payment, DemandeSubvention } from "dto";
import { paymentProviders } from "../providers";
import { AssociationIdentifiers } from "../../@types";
import { getIdentifierType } from "../../shared/helpers/IdentifierHelper";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
import AssociationIdentifierError from "../../shared/errors/AssociationIdentifierError";
import { NotFoundError } from "../../shared/errors/httpErrors";
import rnaSirenService from "../rna-siren/rnaSiren.service";

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
        return [...(await Promise.all(paymentProviders.map(p => p.getPaymentsBySiret(siret)))).flat()];
    }

    private async getPaymentsBySiren(siren: Siren) {
        return [...(await Promise.all(paymentProviders.map(p => p.getPaymentsBySiren(siren)))).flat()];
    }
}

const paymentService = new PaymentsService();

export default paymentService;
