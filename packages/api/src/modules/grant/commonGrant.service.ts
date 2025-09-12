import { CommonApplicationDto, ApplicationStatus, CommonGrantDto, CommonPaymentDto } from "dto";
import providers from "../providers";
import { JoinedRawGrant, RawGrant } from "./@types/rawGrant";
import GrantProvider from "./@types/GrantProvider";

export class CommonGrantService {
    // not an adapter because it needs to call other modules' adapters

    private readonly providerMap: { [providerId: string]: GrantProvider };

    constructor() {
        this.providerMap = {};
        for (const provider of Object.values(providers as unknown as { [serviceName: string]: GrantProvider })) {
            if (!provider.isGrantProvider) continue;
            if (!provider?.meta?.id) continue;
            if (provider[CommonGrantService.adapterMethod]) this.providerMap[provider.meta.id] = provider;
        }
    }

    static adapterMethod = "rawToCommon";

    private filterAdaptable(grants: RawGrant[] | undefined) {
        if (!grants?.length) return [];
        return grants.filter(grant => grant.provider in this.providerMap);
    }

    private rawToCommonFragment(rawGrant: RawGrant, publishable: boolean) {
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

    private chooseRawApplication(rawApplications): RawGrant {
        // here goes business logic about how to choose an application if several share same EJ
        // cf multi-funding & multi-annual applications
        // if we want to keep several applications it must be handled earlier in the process:
        // joinKey must be more precise
        // if business logic depends on the provider, the logic should be in the provider's service
        // and here we should group by provider to make those calls
        return rawApplications[0];
    }

    rawToCommon(joinedRawGrant: JoinedRawGrant, publishable = false): CommonGrantDto | null {
        const rawFullGrants = this.filterAdaptable(joinedRawGrant?.fullGrants);

        let application: CommonApplicationDto | undefined = undefined;
        const rawApplications = [...this.filterAdaptable(joinedRawGrant?.applications), ...rawFullGrants];
        if (rawApplications.length) {
            const chosenRawApplication = this.chooseRawApplication(rawApplications);
            application = this.rawToCommonFragment(chosenRawApplication, publishable);
        }
        if (publishable && application?.statut !== ApplicationStatus.GRANTED) application = undefined;

        let payment: CommonPaymentDto | undefined = undefined;
        const rawPayments = [...this.filterAdaptable(joinedRawGrant?.payments), ...rawFullGrants];
        if (rawPayments.length) {
            const payments = rawPayments.map(rawData => this.rawToCommonFragment(rawData, publishable));
            payment = this.aggregatePayments(payments);
        }

        if (!application && !payment) return null;
        return { ...(payment || {}), ...(application || {}) } as CommonGrantDto;
    }
}

const commonGrantService = new CommonGrantService();

export default commonGrantService;
