import * as Sentry from "@sentry/node";
import { CommonGrantDto, DemandeSubvention, Grant, Payment } from "dto";
import { StructureIdentifier } from "../../identifier-objects/@types/StructureIdentifier";
import { AnyRawGrant, JoinedRawGrant, RawApplication, RawPayment } from "./@types/RawGrant";
import applicationFlatService from "../application-flat/application-flat.service";
import { RnaOnlyError } from "core";
import paymentFlatService from "../payment-flat/payment-flat.service";
import paymentService from "../payments/payments.service";
import commonGrantService from "./common-grant.service";
import transformToDemandeSubvention, {
    TransformToDemandeSubvention,
} from "../application-flat/use-cases/transform-to-demande-subvention";

/**
 * Everything in this service is deprecated
 * "RawGrant", "DemandeSubvention" and "Payment" are all deprecated and kept until we're ready to remove the source code
 */
export class RawGrantService {
    constructor(private transformToDemandeSubvention: TransformToDemandeSubvention) {}

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
            const rawApplications = await applicationFlatService.getRawGrants(identifier);
            const rawPayments = await paymentFlatService.getRawGrants(identifier);
            return this.joinGrants({ applications: rawApplications, payments: rawPayments });
        } catch (e) {
            // IMPROVE: returning empty array does not inform the user that we could not search for grants
            // it does not mean that the association does not receive any grants
            if (e instanceof RnaOnlyError) return [] as JoinedRawGrant[];
            else throw e;
        }
    }

    // use deprecated DemandeSubvention and Payment with ProviderValues
    async getOldGrants(identifier: StructureIdentifier): Promise<Grant[]> {
        const joinedRawGrants = await this.getRawGrants(identifier);
        const grants = joinedRawGrants.map(this.adaptJoinedRawGrant.bind(this)).filter(grant => grant) as Grant[];
        const groupByExerciseGrants = this.groupGrantsByExercise(this.handleMultiYearGrants(grants));
        const sortedByTypeGrants = Object.keys(groupByExerciseGrants)
            .map(exercise => this.sortByGrantType(groupByExerciseGrants[exercise]))
            .flat();
        return sortedByTypeGrants;
    }

    /**
     *
     * @param grants Grants with payments for only one exercise (see handleMultiYearGrant)
     * @returns
     *
     * It was decided that if we both have application and payments
     * but the application and first payment exercise are different,
     * that we will choose the payment date as the year of exercise.
     *
     */
    groupGrantsByExercise(grants: Grant[]) {
        function groupByExercise(group: Record<number | "unknown", Grant[]>, grant: Grant) {
            if (!grant.application && !grant.payments?.length)
                throw new Error("We should not have Grant without payment nor application");

            let exercise;
            if (grant?.payments?.length) {
                exercise = paymentService.getPaymentExercise(grant.payments[0]);
            } else {
                console.log(grant.application);
                exercise = grant.application?.annee_demande?.value;

                // not sure if possible but because DemandeSubventionDTO as annee_demande as optionnal it could occur
                // prevent lonely application grant without annee_demande
                if (!exercise) exercise = "unknown";
            }

            if (!group[exercise]) group[exercise] = [grant];
            else group[exercise].push(grant);
            return group;
        }

        return grants.reduce(groupByExercise, {} as Record<number | "unknown", Grant[]>);
    }

    // sort grants by grants > lonely application > lonely payment
    sortByGrantType(grants: Grant[]) {
        const getScore = grant => {
            if (grant.application && grant.payments) return 2;
            if (grant.application) return 1;
            return 0;
        };

        return grants.sort((grantA, grantB) => {
            return getScore(grantB) - getScore(grantA);
        });
    }

    private joinGrants(rawGrants: { applications: RawApplication[]; payments: RawPayment[] }): JoinedRawGrant[] {
        const byKey: Record<string, JoinedRawGrant> = {};
        const lonelyGrants: JoinedRawGrant[] = [];

        const newJoinedRawGrant = () => ({
            payments: [],
            application: undefined,
        });

        const addKey = key => (byKey[key] = newJoinedRawGrant());

        const add = prop => (rawGrant: Required<AnyRawGrant>) => {
            if (!byKey[rawGrant.joinKey]) addKey(rawGrant.joinKey);
            byKey[rawGrant.joinKey][prop].push(rawGrant);
        };

        // order matters
        rawGrants.applications?.forEach(application => {
            if (application.joinKey) {
                // should not happen with flat rework but we keep it just in case
                if (byKey[application.joinKey]) {
                    this.sendDuplicateMessage(application.joinKey);
                    return;
                }
                addKey(application.joinKey);
                byKey[application.joinKey].application = application;
            } else lonelyGrants.push({ ...newJoinedRawGrant(), application });
        });

        rawGrants.payments?.forEach(payment => {
            if (payment.joinKey)
                add("payments")(payment as Required<AnyRawGrant>); // joinKey should be defined here
            else lonelyGrants.push({ ...newJoinedRawGrant(), payments: [payment] });
        });

        return [...Object.values(byKey), ...lonelyGrants];
    }

    adaptRawGrant(rawGrant: AnyRawGrant) {
        switch (rawGrant.type) {
            case "application": {
                return this.transformToDemandeSubvention.execute(rawGrant.data);
            }
            case "payment":
                return paymentFlatService.rawToPayment(rawGrant as RawPayment);
        }
    }

    adaptJoinedRawGrant(joinedRawGrant: JoinedRawGrant) {
        const payments =
            (joinedRawGrant.payments?.map(joined => this.adaptRawGrant(joined)).filter(p => !!p) as Payment[]) || [];
        const application = joinedRawGrant.application
            ? (this.adaptRawGrant(joinedRawGrant.application) as DemandeSubvention)
            : null;
        return this.toGrant({ application, payments });
    }

    // TODO: #2477 only accept one grant or one application in JoinedRawGrants
    // and only accept lonely grant as it cannot be linked with other payments ?
    // https://github.com/betagouv/api-subventions-asso/issues/2477
    toGrant(joinedGrant: { application: DemandeSubvention | null; payments: Payment[] }): Grant | undefined {
        if (!joinedGrant) return;
        const { application, payments } = joinedGrant;

        const hasApplication = !!application;
        const hasPayments = Boolean(payments?.length);

        if (!hasApplication && !hasPayments) return;
        if (!hasApplication) return { application: null, payments };
        if (hasApplication) return { application: application, payments };
    }

    // Use to spot grants or applications sharing the same joinKey (EJ or code_poste)
    // This should not happen and must be investiguated
    private sendDuplicateMessage(joinKey: string) {
        Sentry.captureMessage(`Duplicate joinKey found for grants or applications :  ${joinKey}`);
    }

    // split payments by exercise and keep application information only for the first occurence
    // this should be improve with multi-year handling
    splitGrantByExercise(grant: Grant): Grant[] {
        const { application, payments } = grant;
        const byYear: Record<number, Grant> = {};
        const NO_YEAR = 0;

        if (application) byYear[application?.annee_demande?.value ?? NO_YEAR] = { application, payments: [] };

        let year: number;
        for (const payment of payments ?? []) {
            year = paymentService.getPaymentExercise(payment) ?? NO_YEAR;
            if (!byYear[year]?.payments)
                byYear[year] = {
                    // TODO: improve multi year treatment when OSIRIS imports will be fixed
                    // cf: https://github.com/betagouv/api-subventions-asso/issues/2734
                    application: byYear[year]?.application ?? null,
                    payments: [payment],
                };
            else (byYear[year].payments as Payment[]).push(payment);
        }

        return Object.values(byYear);
    }

    async getCommonGrants(id: StructureIdentifier, publishable = false): Promise<CommonGrantDto[]> {
        const raws = await this.getRawGrants(id);

        return raws
            .map(raw => commonGrantService.rawToCommon(raw, publishable))
            .filter(adapted => !!adapted) as CommonGrantDto[];
    }

    handleMultiYearGrants(grants: Grant[]): Grant[] {
        return grants.map(grant => this.splitGrantByExercise(grant)).flat();
    }
}

const rawGrantService = new RawGrantService(transformToDemandeSubvention);
export default rawGrantService;
