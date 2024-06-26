import * as Sentry from "@sentry/node";
import { CommonGrantDto, Grant, DemandeSubvention, Payment, Rna, Siret } from "dto";
import { providersById } from "../providers/providers.helper";
import { demandesSubventionsProviders, fullGrantProviders, grantProviders, paymentProviders } from "../providers";
import DemandesSubventionsProvider from "../subventions/@types/DemandesSubventionsProvider";
import PaymentProvider from "../payments/@types/PaymentProvider";
import { AssociationIdentifiers, StructureIdentifiers } from "../../@types";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
import { getIdentifierType } from "../../shared/helpers/IdentifierHelper";
import StructureIdentifiersError from "../../shared/errors/StructureIdentifierError";
import { isSiret } from "../../shared/Validators";
import AssociationIdentifierError from "../../shared/errors/AssociationIdentifierError";
import associationsService from "../associations/associations.service";
import rnaSirenService from "../rna-siren/rnaSiren.service";
import { siretToSiren } from "../../shared/helpers/SirenHelper";
import { BadRequestError } from "../../shared/errors/httpErrors";
import { RnaOnlyError } from "../../shared/errors/GrantError";

import { FullGrantProvider } from "./@types/FullGrantProvider";
import { RawGrant, JoinedRawGrant, RawFullGrant, RawApplication, RawPayment, AnyRawGrant } from "./@types/rawGrant";
import commonGrantService from "./commonGrant.service";

export class GrantService {
    fullGrantProvidersById: Record<string, FullGrantProvider<unknown>>;
    applicationProvidersById: Record<string, DemandesSubventionsProvider<unknown>>;
    paymentProvidersById: Record<string, PaymentProvider<unknown>>;

    // Done in constructor to avoid circular dependencie issue
    constructor() {
        this.fullGrantProvidersById = providersById(fullGrantProviders);
        this.applicationProvidersById = providersById(demandesSubventionsProviders);
        this.paymentProvidersById = providersById(paymentProviders);
    }

    static getRawMethodNameByIdType = {
        [StructureIdentifiersEnum.siret]: "getRawGrantsBySiret",
        [StructureIdentifiersEnum.siren]: "getRawGrantsBySiren",
        [StructureIdentifiersEnum.rna]: "getRawGrantsByRna",
    };

    private validateAndGetStructureType(id: StructureIdentifiers) {
        const idType = getIdentifierType(id);
        if (!idType) throw new StructureIdentifiersError();
        return idType;
    }

    private async validateIsAssociation(id: StructureIdentifiers) {
        const siren = await associationsService.isSirenFromAsso(siretToSiren(id));
        if (!siren) throw new BadRequestError("identifier does not represent an association");
    }

    private async validateAndGetIdentifierInfo(identifier: StructureIdentifiers) {
        let type = this.validateAndGetStructureType(identifier);

        if (type === StructureIdentifiersEnum.rna) {
            const sirenValues = await this.getSirenValues(identifier);
            if (sirenValues) {
                type = sirenValues.type;
                identifier = sirenValues.identifier;
            } else {
                throw new RnaOnlyError(identifier);
            }
        } else {
            this.validateIsAssociation(identifier);
        }
        return { identifier, type };
    }

    private async getSirenValues(rna: Rna) {
        const rnaSirenEntities = await rnaSirenService.find(rna);
        if (rnaSirenEntities && rnaSirenEntities.length) {
            return { identifier: rnaSirenEntities[0].siren, type: StructureIdentifiersEnum.siren };
        }
        return null;
    }

    adapteRawGrant(rawGrant: RawGrant) {
        switch (rawGrant.type) {
            case "fullGrant":
                return this.fullGrantProvidersById[rawGrant.provider].rawToGrant(rawGrant as RawFullGrant);
            case "application":
                return this.applicationProvidersById[rawGrant.provider].rawToApplication(rawGrant as RawApplication);
            case "payment":
                return this.paymentProvidersById[rawGrant.provider].rawToPayment(rawGrant as RawPayment);
        }
    }

    adapteJoinedRawGrant(joinedRawGrant: JoinedRawGrant) {
        const payments =
            (joinedRawGrant.payments?.map(joined => this.adapteRawGrant(joined)) as Payment[]) || ([] as Payment[]);
        const fullGrants = joinedRawGrant.fullGrants?.map(joined => this.adapteRawGrant(joined)) as
            | Grant[]
            | [] as Grant[];
        const applications = joinedRawGrant.applications?.map(joined => this.adapteRawGrant(joined)) as
            | DemandeSubvention[]
            | [] as DemandeSubvention[];
        return this.toGrant({ fullGrants, applications, payments });
    }

    // TODO: #2477 only accept one grant or one application in JoinedRawGrants
    // and only accept lonely grant as it cannot be linked with other payments ?
    // https://github.com/betagouv/api-subventions-asso/issues/2477
    toGrant(joinedGrant: { fullGrants: Grant[]; applications: DemandeSubvention[]; payments: Payment[] }) {
        const { fullGrants: grants, applications, payments } = joinedGrant;

        const hasGrants = Boolean(grants.length);
        const hasApplications = Boolean(applications.length);
        const hasPayments = Boolean(payments.length);

        if (!hasGrants && !hasApplications && !hasPayments) return;

        if (hasPayments) {
            if (!hasGrants && !hasApplications) return { application: null, payments };
            if (hasGrants) {
                const grant = grants[0];
                return { application: grant.application, payments: [...grant.payments, ...payments] };
            }
            if (hasApplications) return { application: applications[0], payments };
        } else if (hasGrants) return grants[0];
        // only hasApplication
        else return { application: applications[0] };
    }

    // appeler adapter pour chaque joine.application joine.payment et joine.fullGrant
    // implementer une classe GrantAdapter pour chaque adapter de demande et de paiment
    async getGrants(identifier: StructureIdentifiers): Promise<Grant[]> {
        const joinedRawGrants = await this.getRawGrants(identifier);
        const grants = joinedRawGrants.map(this.adapteJoinedRawGrant.bind(this)).filter(grant => grant) as Grant[];
        return grants;
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
    async getRawGrants(identifier: StructureIdentifiers): Promise<JoinedRawGrant[]> {
        try {
            const { identifier: sirenOrSiret, type } = await this.validateAndGetIdentifierInfo(identifier);
            const method = GrantService.getRawMethodNameByIdType[type];
            const providers = grantProviders;
            const rawGrants = [
                ...(
                    await Promise.all(
                        providers.map(p => p[method](sirenOrSiret).then(g => (g || []) as RawGrant[]) || []),
                    )
                ).flat(),
            ];
            return this.joinGrants(rawGrants);
        } catch (e) {
            // IMPROVE: returning empty array does not inform the user that we could not search for grants
            // it does not mean that the association does not received any grants
            if (e instanceof RnaOnlyError) return [] as JoinedRawGrant[];
            else throw e;
        }
    }

    async getRawGrantsByAssociation(id: AssociationIdentifiers): Promise<JoinedRawGrant[]> {
        if (isSiret(id)) throw new AssociationIdentifierError();
        return this.getRawGrants(id);
    }

    async getRawGrantsByEstablishment(siret: Siret): Promise<JoinedRawGrant[]> {
        if (!isSiret(siret)) throw new StructureIdentifiersError("SIRET expected");
        return this.getRawGrants(siret);
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

    async getCommonGrants(id: StructureIdentifiers, publishable = false): Promise<CommonGrantDto[]> {
        const raws = await this.getRawGrants(id);

        return raws
            .map(raw => commonGrantService.rawToCommon(raw, publishable))
            .filter(adapted => !!adapted) as CommonGrantDto[];
    }
}

const grantService = new GrantService();

export default grantService;
