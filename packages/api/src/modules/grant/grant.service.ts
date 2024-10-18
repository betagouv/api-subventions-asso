import * as Sentry from "@sentry/node";
import { CommonGrantDto, Grant, DemandeSubvention, Payment } from "dto";
import { providersById } from "../providers/providers.helper";
import { demandesSubventionsProviders, fullGrantProviders, grantProviders, paymentProviders } from "../providers";
import DemandesSubventionsProvider from "../subventions/@types/DemandesSubventionsProvider";
import PaymentProvider from "../payments/@types/PaymentProvider";
import { StructureIdentifier } from "../../@types";
import scdlGrantService from "../providers/scdl/scdl.grant.service";
import scdlService from "../providers/scdl/scdl.service";
import { RnaOnlyError } from "../../shared/errors/GrantError";

import { FullGrantProvider } from "./@types/FullGrantProvider";
import { RawGrant, JoinedRawGrant, RawFullGrant, RawApplication, RawPayment, AnyRawGrant } from "./@types/rawGrant";
import commonGrantService from "./commonGrant.service";

export class GrantService {
    fullGrantProvidersById: Record<string, FullGrantProvider<unknown>>;
    applicationProvidersById: Record<string, DemandesSubventionsProvider<unknown>>;
    paymentProvidersById: Record<string, PaymentProvider<unknown>>;

    // Done in constructor to avoid circular dependency issue
    constructor() {
        this.fullGrantProvidersById = providersById(fullGrantProviders);
        this.applicationProvidersById = providersById(demandesSubventionsProviders);
        this.paymentProvidersById = providersById(paymentProviders);
    }

    adaptRawGrant(rawGrant: RawGrant) {
        switch (rawGrant.type) {
            case "fullGrant":
                return this.fullGrantProvidersById[rawGrant.provider].rawToGrant(rawGrant as RawFullGrant);
            case "application": {
                // default provider
                let provider = this.applicationProvidersById[rawGrant.provider];
                // TODO: refactor multi producers provider
                // scdl specificity -- providerService id (miscScdl) is different from producer name used as rawGrant.provider (i.e Ville de Paris)
                if (scdlService.producerNames.includes(rawGrant.provider)) {
                    provider = this.applicationProvidersById[scdlGrantService.provider.id];
                }
                return provider.rawToApplication(rawGrant as RawApplication);
            }
            case "payment":
                return this.paymentProvidersById[rawGrant.provider].rawToPayment(rawGrant as RawPayment);
        }
    }

    adaptJoinedRawGrant(joinedRawGrant: JoinedRawGrant) {
        const payments = (joinedRawGrant.payments?.map(joined => this.adaptRawGrant(joined)) as Payment[]) || [];
        const fullGrants = joinedRawGrant.fullGrants?.map(joined => this.adaptRawGrant(joined)) as Grant[] | [];
        const applications = joinedRawGrant.applications?.map(joined => this.adaptRawGrant(joined)) as
            | DemandeSubvention[]
            | [];
        return this.toGrant({ fullGrants, applications, payments });
    }

    // TODO: #2477 only accept one grant or one application in JoinedRawGrants
    // and only accept lonely grant as it cannot be linked with other payments ?
    // https://github.com/betagouv/api-subventions-asso/issues/2477
    toGrant(joinedGrant: {
        fullGrants: Grant[];
        applications: DemandeSubvention[];
        payments: Payment[];
    }): Grant | undefined {
        if (!joinedGrant) return;
        const { fullGrants: grants, applications, payments } = joinedGrant;

        const hasGrants = Boolean(grants?.length);
        const hasApplications = Boolean(applications?.length);
        const hasPayments = Boolean(payments?.length);

        if (!hasGrants && !hasApplications && !hasPayments) return;

        if (hasPayments) {
            if (!hasGrants && !hasApplications) return { application: null, payments };
            if (hasGrants) {
                const grant = grants[0];
                return { application: grant.application, payments: [...(grant.payments as Payment[]), ...payments] };
            }
            if (hasApplications) return { application: applications[0], payments };
        } else if (hasGrants) return grants[0];
        // only hasApplication
        else return { application: applications[0], payments: null };
    }

    // sort grants by grants > lonely application > lonely payment
    sortGrants(grants: Grant[]) {
        const getScore = grant => {
            if (grant.application && grant.payments) return 2;
            if (grant.application) return 1;
            return 0;
        };

        return grants.sort((grantA, grantB) => {
            return getScore(grantB) - getScore(grantA);
        });
    }

    // appeler adapter pour chaque join.application join.payment et join.fullGrant
    // implementer une classe GrantAdapter pour chaque adapter de demande et de paiment
    async getGrants(identifier: StructureIdentifier): Promise<Grant[]> {
        const joinedRawGrants = await this.getRawGrants(identifier);
        const grants = joinedRawGrants.map(this.adaptJoinedRawGrant.bind(this)).filter(grant => grant) as Grant[];
        const sortedGrants = this.sortGrants(grants);
        return sortedGrants;
    }

    /**
     * Fetch grants by SIREN or SIRET.
     * Grants can only be referenced by SIRET.
     *
     * If we got an RNA as identifier, we try to get the associated SIREN.
     * If we find it, we proceed the operation using it.
     * If not, we stop and return an empty array.
     *
     * @param identifier Rna, Siren or Siret
     * @returns List of grants (application with paiments)
     */
    async getRawGrants(identifier: StructureIdentifier): Promise<JoinedRawGrant[]> {
        try {
            const rawGrants = [
                ...((await Promise.all(grantProviders.map(p => p.getRawGrants(identifier)))).flat() as AnyRawGrant[]),
            ];
            return this.joinGrants(rawGrants);
        } catch (e) {
            // IMPROVE: returning empty array does not inform the user that we could not search for grants
            // it does not mean that the association does not receive any grants
            if (e instanceof RnaOnlyError) return [] as JoinedRawGrant[];
            else throw e;
        }
    }

    // Use to spot grants or applications sharing the same joinKey (EJ or code_poste)
    // This should not happen and must be investiguated
    private sendDuplicateMessage(joinKey: string) {
        Sentry.captureMessage(`Duplicate joinKey found for grants or applications :  ${joinKey}`);
    }

    private groupRawGrantsByType(rawGrants: AnyRawGrant[]) {
        return rawGrants.reduce(
            (acc, curr) => {
                switch (curr.type) {
                    case "fullGrant":
                        acc["fullGrants"].push(curr);
                        break;
                    case "application":
                        acc["applications"].push(curr);
                        break;
                    case "payment":
                        acc["payments"].push(curr);
                        break;
                }
                return acc;
            },
            {
                fullGrants: [] as RawFullGrant[],
                applications: [] as RawApplication[],
                payments: [] as RawPayment[],
            },
        );
    }

    private joinGrants(rawGrants: AnyRawGrant[]): JoinedRawGrant[] {
        const byKey: Record<string, JoinedRawGrant> = {};
        //TODO: improve JoinedRawGrant after investiguating duplicates possibilities
        // i.e accept only { fullGrant: RawFullGrant , payments: RawPayment[] }
        // and { application: RawApplication, payments: RawPayment[] }
        const newJoinedRawGrant = () => ({
            payments: [],
            applications: [],
            fullGrants: [],
        });
        const addKey = key => (byKey[key] = newJoinedRawGrant());
        const lonelyGrants: JoinedRawGrant[] = [];

        const add = prop => (rawGrant: Required<AnyRawGrant>) => {
            if (!byKey[rawGrant.joinKey]) addKey(rawGrant.joinKey);
            byKey[rawGrant.joinKey][prop].push(rawGrant);
        };
        // TODO: make addApplicationOrSendMessage that will also check if there is already a fullGrant
        const addOrSendMessage = type => (rawGrant: Required<RawFullGrant> | Required<RawApplication>) => {
            if (byKey[rawGrant.joinKey]?.[type]) this.sendDuplicateMessage(rawGrant.joinKey);
            else add(type)(rawGrant);
        };
        const addFullGrant = addOrSendMessage("fullGrants");
        const addApplication = addOrSendMessage("applications");
        const addPayment = add("payments");

        // TODO: do we want to keep transforming lonely grants into JoinedRawGrant format ?
        // TODO: Do we realy have RawGrant without joinKey ? Is lonelyGrant a real thing ?
        const addLonely = prop => (rawGrant: AnyRawGrant) =>
            lonelyGrants.push({ ...newJoinedRawGrant(), [prop]: [rawGrant] });
        const addLonelyFullGrant = addLonely("fullGrants");
        const addLonelyApplication = addLonely("applications");
        const addLonelyPayment = addLonely("payments");

        const joiner = (add, addLonely) => grant => {
            if (grant.joinKey) add(grant);
            else addLonely(grant);
        };

        const grantsByType = this.groupRawGrantsByType(rawGrants);

        // order matters if we want fullGrants to be more accurate than applications in case of duplicates
        // TODO: investiguate if duplicates is something that can happen
        grantsByType.fullGrants?.forEach(joiner(addFullGrant, addLonelyFullGrant));
        grantsByType.applications?.forEach(joiner(addApplication, addLonelyApplication));
        grantsByType.payments?.forEach(joiner(addPayment, addLonelyPayment));

        return [...Object.values(byKey), ...lonelyGrants];
    }

    async getCommonGrants(id: StructureIdentifier, publishable = false): Promise<CommonGrantDto[]> {
        const raws = await this.getRawGrants(id);

        return raws
            .map(raw => commonGrantService.rawToCommon(raw, publishable))
            .filter(adapted => !!adapted) as CommonGrantDto[];
    }
}

const grantService = new GrantService();

export default grantService;
