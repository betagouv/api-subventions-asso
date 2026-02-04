import * as Sentry from "@sentry/node";
import {
    CommonGrantDto,
    Grant,
    DemandeSubvention,
    Payment,
    ApplicationFlatDto,
    PaymentFlatDto,
    GrantFlatDto,
} from "dto";
import { RnaOnlyError } from "core";
import { providersById } from "../providers/providers.helper";
import { applicationProviders, paymentProviders } from "../providers";
import ApplicationProvider from "../subventions/@types/ApplicationProvider";
import PaymentProvider from "../payments/@types/PaymentProvider";
import paymentService from "../payments/payments.service";
import subventionsService from "../subventions/subventions.service";
import {
    JoinedRawGrant,
    RawApplication,
    RawPayment,
    AnyRawGrant,
    RawGrant,
    JoinedRawGrantDto,
} from "./@types/rawGrant";
import commonGrantService from "./commonGrant.service";
import { StructureIdentifier } from "../../identifierObjects/@types/StructureIdentifier";
import applicationFlatService from "../applicationFlat/applicationFlat.service";
import paymentFlatService from "../paymentFlat/paymentFlat.service";
import { GrantFlatEntity } from "../../entities/GrantFlatEntity";
import PaymentFlatEntity from "../../entities/flats/PaymentFlatEntity";
import ApplicationFlatAdapter from "../applicationFlat/ApplicationFlatAdapter";
import PaymentFlatAdapter from "../paymentFlat/paymentFlatAdapter";

export class GrantService {
    applicationProvidersById: Record<string, ApplicationProvider>;
    paymentProvidersById: Record<string, PaymentProvider>;

    // Done in constructor to avoid circular dependency issue
    constructor() {
        this.applicationProvidersById = providersById(applicationProviders);
        this.paymentProvidersById = providersById(paymentProviders);
    }

    adaptRawGrant(rawGrant: AnyRawGrant) {
        switch (rawGrant.type) {
            case "application": {
                return applicationFlatService.rawToApplication(rawGrant as RawApplication);
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
                exercise = subventionsService.getSubventionExercise(
                    grant.application as DemandeSubvention, // ts should know that we have application defined
                );

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

    async getGrantsDto(identifier: StructureIdentifier): Promise<GrantFlatDto[]> {
        const grants = await this.getGrants(identifier);

        return grants.map(grant => {
            const { application, payments } = grant;
            let applicationDto: ApplicationFlatDto | null = null;
            let paymentsDto: PaymentFlatDto[] = [];
            if (application) applicationDto = ApplicationFlatAdapter.toDto(application);
            if (payments) paymentsDto = payments.map(PaymentFlatAdapter.toDto);
            return { application: applicationDto, payments: paymentsDto };
        });
    }

    async getGrants(identifier: StructureIdentifier): Promise<GrantFlatEntity[]> {
        const applications = await applicationFlatService.getEntitiesByIdentifier(identifier);
        const payments = await paymentFlatService.getEntitiesByIdentifier(identifier);

        // init with applications
        const grants: GrantFlatEntity[] = applications.map(application => ({
            application,
            payments: [] as PaymentFlatEntity[],
        }));

        // group payments by paymentId
        const groupedPayments = payments.reduce(
            (acc, payment) => {
                const paymentId = payment.paymentId;
                if (acc[paymentId]) acc[paymentId].push(payment);
                else acc[paymentId] = [payment];
                return acc;
            },
            {} as Record<string, PaymentFlatEntity[]>,
        );

        // add payments either to existing grant with application or create a new grant without
        // uses different array to ease the findIndex
        Object.entries(groupedPayments).map(([paymentId, group]) => {
            const index = grants.findIndex(grant => {
                return grant.application?.paymentId === paymentId;
            });
            if (index >= 0) {
                grants[index].payments = group;
            } else {
                grants.push({ application: null, payments: group });
            }
        });

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

    /**
     *
     * Return RawGrants as DTO and not Entity
     *
     * @param identifier Rna, Siren or Siret
     */
    async getRawGrantsDto(identifier: StructureIdentifier): Promise<JoinedRawGrantDto[]> {
        const rawGrants = await this.getRawGrants(identifier);
        return rawGrants.map(grant => {
            let application: RawGrant<ApplicationFlatDto> | null = null;
            let payments: RawGrant<PaymentFlatDto>[] = [];
            if (grant.application) {
                application = {
                    ...grant.application,
                    data: ApplicationFlatAdapter.toDto(grant.application.data),
                };
            }
            if (grant.payments?.length) {
                payments = grant.payments.map(payment => ({
                    ...payment,
                    data: PaymentFlatAdapter.toDto(payment.data),
                }));
            }
            return { application, payments };
        });
    }

    // Use to spot grants or applications sharing the same joinKey (EJ or code_poste)
    // This should not happen and must be investiguated
    private sendDuplicateMessage(joinKey: string) {
        Sentry.captureMessage(`Duplicate joinKey found for grants or applications :  ${joinKey}`);
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

    async getCommonGrants(id: StructureIdentifier, publishable = false): Promise<CommonGrantDto[]> {
        const raws = await this.getRawGrants(id);

        return raws
            .map(raw => commonGrantService.rawToCommon(raw, publishable))
            .filter(adapted => !!adapted) as CommonGrantDto[];
    }

    handleMultiYearGrants(grants: Grant[]): Grant[] {
        return grants.map(grant => this.splitGrantByExercise(grant)).flat();
    }

    // split payments by exercise and keep application information only for the first occurence
    // this should be improve with multi-year handling
    splitGrantByExercise(grant: Grant): Grant[] {
        const { application, payments } = grant;
        const byYear: Record<number, Grant> = {};
        const NO_YEAR = 0;

        if (application)
            byYear[subventionsService.getSubventionExercise(application) ?? NO_YEAR] = { application, payments: [] };

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
}

const grantService = new GrantService();

export default grantService;
