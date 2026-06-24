import { CommonApplicationDto, ApplicationStatus, CommonGrantDto, CommonPaymentDto } from "dto";
import { AnyRawGrant, JoinedRawGrant } from "./@types/RawGrant";
import applicationFlatService from "../application-flat/application-flat.service";
import paymentFlatService from "../payment-flat/payment-flat.service";

// @TODO: this is broken since the use of flats
export class CommonGrantService {
    static adapterMethod = "rawToCommon";
    private readonly providerMap = {
        [applicationFlatService.meta.id]: applicationFlatService,
        [paymentFlatService.meta.id]: paymentFlatService,
    };

    private rawToCommonFragment(rawGrant: AnyRawGrant, publishable: boolean) {
        const providerId = rawGrant.provider;
        const adaptedGrant = this.providerMap[providerId][CommonGrantService.adapterMethod](rawGrant);
        if (publishable) adaptedGrant.montant_demande = undefined;
        return adaptedGrant;
    }

    private aggregatePayments(payments): CommonPaymentDto {
        const result: CommonPaymentDto = payments[0];
        for (const payment of payments.slice(1)) {
            result.montant_verse += payment.montant_verse;
            if (payment.date_debut < result.date_debut) result.date_debut = payment.date_debut;
            if (payment.bop === result.bop) continue;
            if (!result.bop) result.bop = payment.bop;
            if (payment.bop) result.bop = "multi-bop";
        }
        return result;
    }

    rawToCommon(joinedRawGrant: JoinedRawGrant, publishable = false): CommonGrantDto | null {
        let application: CommonApplicationDto | undefined = undefined;
        const rawApplication = joinedRawGrant.application;
        if (rawApplication) {
            application = this.rawToCommonFragment(rawApplication, publishable);
        }
        if (publishable && application?.statut !== ApplicationStatus.GRANTED) application = undefined;

        let payment: CommonPaymentDto | undefined = undefined;
        const rawPayments = joinedRawGrant.payments;
        if (rawPayments?.length) {
            const payments = rawPayments.map(rawData => this.rawToCommonFragment(rawData, publishable));
            payment = this.aggregatePayments(payments);
        }

        if (!application && !payment) return null;
        return { ...(payment || {}), ...(application || {}) } as CommonGrantDto;
    }
}

const commonGrantService = new CommonGrantService();

export default commonGrantService;
