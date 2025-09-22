import grantService from "./grant.service";
import commonGrantService from "./commonGrant.service";
import mocked = jest.mocked;
import { AnyRawGrant, JoinedRawGrant, RawApplication, RawFullGrant, RawPayment } from "./@types/rawGrant";
import * as Sentry from "@sentry/node";
import {
    applicationProvidersFixtures,
    fullGrantProvidersFixtures,
    paymentProvidersFixtures,
} from "../providers/__fixtures__/providers.fixture";
import scdlService from "../providers/scdl/scdl.service";
import scdlGrantService from "../providers/scdl/scdl.grant.service";
import { DemandeSubvention, Grant, Payment } from "dto";
import { SIRET_STR } from "../../../tests/__fixtures__/association.fixture";
import EstablishmentIdentifier from "../../identifierObjects/EstablishmentIdentifier";
import AssociationIdentifier from "../../identifierObjects/AssociationIdentifier";
import paymentService from "../payments/payments.service";
import subventionsService from "../subventions/subventions.service";
import Siret from "../../identifierObjects/Siret";
import { refreshGrantAsyncServices } from "../../shared/initAsyncServices";

jest.mock("../../shared/initAsyncServices");
jest.mock("../providers/scdl/scdl.service");
jest.mock("@sentry/node");
jest.mock("../providers");
jest.mock("../../shared/Validators");
jest.mock("./commonGrant.service");
jest.mock("../associations/associations.service");
jest.mock("../subventions/subventions.service");
jest.mock("../payments/payments.service");

describe("GrantService", () => {
    const SCDL_PRODUCER_NAME = "SCDL_PRODUCER_NAME";
    beforeAll(() => {
        scdlService.producerNames = [SCDL_PRODUCER_NAME];
    });

    const SIRET = new Siret(SIRET_STR);
    const ESTABLISHMENT_ID = EstablishmentIdentifier.fromSiret(SIRET, AssociationIdentifier.fromSiren(SIRET.toSiren()));

    const JOIN_KEY_1 = "JOIN_KEY_1";
    const JOIN_KEY_2 = "JOIN_KEY_2";
    const RAW_FULL_GRANT: RawFullGrant = {
        provider: fullGrantProvidersFixtures[0].meta.id,
        data: { application: {}, payments: [] },
        type: "fullGrant",
        joinKey: JOIN_KEY_1,
    };
    const RAW_APPLICATION: RawApplication = {
        provider: applicationProvidersFixtures[0].meta.id,
        data: {},
        type: "application",
        joinKey: JOIN_KEY_2,
    };
    const RAW_PAYMENTS: RawPayment[] = [
        { provider: paymentProvidersFixtures[0].meta.id, data: {}, type: "payment", joinKey: JOIN_KEY_1 },
        { provider: paymentProvidersFixtures[0].meta.id, data: {}, type: "payment", joinKey: JOIN_KEY_1 },
        { provider: paymentProvidersFixtures[0].meta.id, data: {}, type: "payment", joinKey: JOIN_KEY_2 },
        { provider: paymentProvidersFixtures[0].meta.id, data: {}, type: "payment", joinKey: JOIN_KEY_2 },
    ];

    const RAW_GRANTS: AnyRawGrant[] = [RAW_FULL_GRANT, RAW_APPLICATION, ...RAW_PAYMENTS];
    const GRANTS_BY_TYPE = {
        fullGrants: [RAW_FULL_GRANT],
        applications: [RAW_APPLICATION],
        payments: RAW_PAYMENTS,
    };

    const DEFAULT_JOINED_RAW_GRANT = {
        fullGrants: [RAW_FULL_GRANT],
        applications: [],
        payments: RAW_PAYMENTS.filter(rawPayment => rawPayment.joinKey === RAW_FULL_GRANT.joinKey),
    };
    const APPLICATION = { siret: SIRET_STR } as unknown as DemandeSubvention;
    // @ts-expect-error: mock type
    const PAYMENTS = [{ bop: 163 }, { bop: 147 }] as Payment[];
    // @ts-expect-error: mock type
    const GRANT: Grant = { application: APPLICATION, payments: [{ bop: 101 } as Payment] };

    describe("adaptRawGrant", () => {
        beforeAll(() => {
            grantService.fullGrantProvidersById = {
                [fullGrantProvidersFixtures[0].meta.id]: fullGrantProvidersFixtures[0],
            };
            grantService.applicationProvidersById = {
                [applicationProvidersFixtures[0].meta.id]: applicationProvidersFixtures[0],
                [applicationProvidersFixtures[1].meta.id]: applicationProvidersFixtures[1],
            };
            grantService.paymentProvidersById = {
                [paymentProvidersFixtures[0].meta.id]: paymentProvidersFixtures[0],
            };
        });

        it.each`
            grant              | provider                           | method
            ${RAW_FULL_GRANT}  | ${fullGrantProvidersFixtures[0]}   | ${"rawToGrant"}
            ${RAW_APPLICATION} | ${applicationProvidersFixtures[0]} | ${"rawToApplication"}
            ${RAW_PAYMENTS[0]} | ${paymentProvidersFixtures[0]}     | ${"rawToPayment"}
        `("should adapte RawFullGrant", ({ grant, provider, method }) => {
            grantService.adaptRawGrant(grant);
            expect(provider[method]).toHaveBeenCalledWith(grant);
        });

        it("should handle SCDL case", () => {
            const oldScdlGrantServiceId = scdlGrantService.meta.id;
            // Use for SCDL adaptRawGrant specific treatment
            scdlGrantService.meta.id = applicationProvidersFixtures[1].meta.id;
            const APPLICATION_SCDL: RawApplication = {
                provider: SCDL_PRODUCER_NAME,
                data: {},
                type: "application",
                joinKey: JOIN_KEY_2,
            };
            grantService.adaptRawGrant(APPLICATION_SCDL);
            expect(applicationProvidersFixtures[1].rawToApplication).toHaveBeenCalledWith(APPLICATION_SCDL);
            scdlGrantService.meta.id = oldScdlGrantServiceId;
        });
    });

    describe("adaptJoinedRawGrant", () => {
        let mockToGrant, mockAdapteRawGrant;

        beforeAll(() => {
            mockToGrant = jest.spyOn(grantService, "toGrant").mockReturnValue(GRANT);
            // @ts-expect-error: mock return value
            mockAdapteRawGrant = jest.spyOn(grantService, "adaptRawGrant").mockImplementation(rawGrant => rawGrant);
        });

        afterAll(() => {
            mockToGrant.mockRestore();
            mockAdapteRawGrant.mockRestore();
        });

        it.each`
            arrayName | joinedRawGrant | calls
            ${"payments"} | ${{
    fullGrants: [],
    applications: [],
    payments: [RAW_PAYMENTS[0], RAW_PAYMENTS[1]],
}} | ${2}
            ${"fullGrants"} | ${{
    fullGrants: [RAW_FULL_GRANT, {} as RawFullGrant],
    applications: [],
    payments: [],
}} | ${2}
            ${"application"} | ${{
    fullGrants: [],
    applications: [RAW_APPLICATION, {} as RawApplication],
    payments: [],
}} | ${2}
            ${"payments, fullGrants and applications"} | ${{
    fullGrants: [RAW_FULL_GRANT, {} as RawFullGrant],
    applications: [RAW_APPLICATION, {} as RawApplication],
    payments: [RAW_PAYMENTS[0], RAW_PAYMENTS[1]],
}} | ${6}
        `("should call adaptRawGrant for each $arrayName", ({ joinedRawGrant, calls }) => {
            grantService.adaptJoinedRawGrant(joinedRawGrant);
            expect(mockAdapteRawGrant).toHaveBeenCalledTimes(calls);
        });

        it("should filter out null adapted grants", () => {
            mockAdapteRawGrant.mockReturnValue(null);
            grantService.adaptJoinedRawGrant({
                fullGrants: [{}, {}] as unknown as RawFullGrant[],
                applications: [{}] as unknown as RawApplication[],
                payments: [{}] as unknown as RawPayment[],
            });
            expect(mockToGrant).toHaveBeenCalledWith({ fullGrants: [], applications: [], payments: [] });
            mockAdapteRawGrant.mockImplementation(rawGrant => rawGrant);
        });

        it("should call toGrant", () => {
            grantService.adaptJoinedRawGrant(DEFAULT_JOINED_RAW_GRANT);
            expect(mockToGrant).toHaveBeenCalledWith(DEFAULT_JOINED_RAW_GRANT);
        });
    });

    describe("toGrant", () => {
        it.each`
            description                             | joinedRawGrant | expected
            ${"return undefined if no param"}       | ${undefined}   | ${undefined}
            ${"return undefined with empty object"} | ${{}}          | ${undefined}
            ${"return undefined with properties undefined"} | ${{
    fullGrants: undefined,
    applications: undefined,
    payments: undefined,
}} | ${undefined}
            ${"return undefined with empty arrays"} | ${{
    fullGrants: [],
    applications: [],
    payments: [],
}} | ${undefined}
            ${"return only payments"} | ${{
    fullGrants: [],
    applications: [],
    payments: PAYMENTS,
}} | ${{ application: null, payments: PAYMENTS }}
            ${"return first grant + payments"} | ${{
    fullGrants: [GRANT, {} as Grant],
    applications: [],
    payments: PAYMENTS,
}} | ${{
    application: GRANT.application,
    payments: [...(GRANT.payments as Payment[]), ...PAYMENTS],
}}
            ${"return first application + payments"} | ${{
    fullGrants: [],
    applications: [APPLICATION, {} as DemandeSubvention],
    payments: PAYMENTS,
}} | ${{ application: APPLICATION, payments: PAYMENTS }}
            ${"return first grant"} | ${{
    fullGrants: [GRANT, {} as Grant],
    applications: [],
    payments: [],
}} | ${GRANT}
            ${"return first application"} | ${{
    fullGrants: [],
    applications: [APPLICATION, {} as DemandeSubvention],
    payments: [],
}} | ${{ application: APPLICATION, payments: null }}
        `("$description", ({ joinedRawGrant, expected }) => {
            const grant = grantService.toGrant(joinedRawGrant);
            expect(grant).toEqual(expected);
        });
    });

    describe("sortByGrantType", () => {
        const LONLEY_PAYMENT = { application: null, payments: PAYMENTS };
        const LONELY_APPLICATION = { application: APPLICATION, payments: null };
        it.each`
            grants
            ${[LONELY_APPLICATION, GRANT, LONLEY_PAYMENT]}
            ${[LONLEY_PAYMENT, GRANT, LONELY_APPLICATION]}
            ${[GRANT, LONLEY_PAYMENT, LONELY_APPLICATION]}
            ${[GRANT, LONELY_APPLICATION, LONLEY_PAYMENT]}
            ${[LONELY_APPLICATION, LONLEY_PAYMENT, GRANT]}
            ${[LONLEY_PAYMENT, LONELY_APPLICATION, GRANT]}
        `("should sort grants with full grants first", ({ grants }) => {
            const expected = [GRANT, LONELY_APPLICATION, LONLEY_PAYMENT];
            const actual = grantService.sortByGrantType(grants);
            expect(actual).toEqual(expected);
        });
    });

    describe("getGrants", () => {
        const JOINED_RAW_GRANTS = [DEFAULT_JOINED_RAW_GRANT, {}];
        // @ts-expect-error: mock DemandeSubvention
        const GRANT_2 = { application: { siret: "10000000000002" } as DemandeSubvention, payments: [] };
        const GROUPED_BY_EXERCISE_GRANTS = {
            "2024": [GRANT],
            unknown: [GRANT_2],
        };
        const mockGetRawGrants = jest.spyOn(grantService, "getRawGrants");
        const mockAdapteJoinedRawGrant = jest.spyOn(grantService, "adaptJoinedRawGrant");
        const mockSortByGrantType = jest.spyOn(grantService, "sortByGrantType");
        const mockHandleMultiYearGrants = jest.spyOn(grantService, "handleMultiYearGrants");
        const mockGroupGrantsByExercise = jest.spyOn(grantService, "groupGrantsByExercise");
        const mocks: jest.SpyInstance[] = [
            mockGetRawGrants,
            mockAdapteJoinedRawGrant,
            mockHandleMultiYearGrants,
            mockGroupGrantsByExercise,
            mockSortByGrantType,
        ];

        beforeAll(() => {
            mockGetRawGrants.mockResolvedValue(JOINED_RAW_GRANTS);
            mockAdapteJoinedRawGrant.mockReturnValue(GRANT);
            mockHandleMultiYearGrants.mockImplementation(grants => grants);
            mockGroupGrantsByExercise.mockImplementation(() => GROUPED_BY_EXERCISE_GRANTS);
            mockSortByGrantType.mockImplementation(arr => arr);
        });

        afterAll(() => {
            mocks.forEach(mock => mock.mockRestore());
        });

        afterEach(() => mocks.forEach(mock => mock.mockClear()));

        it("refresh grant async services before fetching new data", async () => {
            await grantService.getGrants(ESTABLISHMENT_ID);
            expect(refreshGrantAsyncServices).toHaveBeenCalled();
        });

        it("should call getRawGrants", async () => {
            await grantService.getGrants(ESTABLISHMENT_ID);
            expect(mockGetRawGrants).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });

        it("should call adaptJoinedRawGrant", async () => {
            await grantService.getGrants(ESTABLISHMENT_ID);
            expect(mockAdapteJoinedRawGrant).toHaveBeenCalledTimes(JOINED_RAW_GRANTS.length);
        });

        it("should call handleMultiYearGrants", async () => {
            await grantService.getGrants(ESTABLISHMENT_ID);
            expect(mockHandleMultiYearGrants).toHaveBeenCalledWith([GRANT, GRANT]);
        });

        it("should call sortByGrantType", async () => {
            await grantService.getGrants(ESTABLISHMENT_ID);
            expect(mockSortByGrantType).toHaveBeenNthCalledWith(1, [GRANT]);
            expect(mockSortByGrantType).toHaveBeenNthCalledWith(2, [GRANT_2]);
        });
    });

    describe("sendDuplicateMessage", () => {
        it("should call Sentry.captureMessage()", () => {
            // @ts-expect-error: test private method only
            grantService.sendDuplicateMessage(JOIN_KEY_1);
            expect(Sentry.captureMessage).toHaveBeenCalledWith(
                `Duplicate joinKey found for grants or applications :  ${JOIN_KEY_1}`,
            );
        });
    });

    describe("groupGrantsByExercise", () => {
        beforeAll(() => {
            jest.mocked(subventionsService.getSubventionExercise).mockImplementation(
                // @ts-expect-error: mock
                application => application.annee_demande,
            );
            // @ts-expect-error: mock
            jest.mocked(paymentService.getPaymentExercise).mockImplementation(payment => payment.dateOperation);
        });

        afterAll(() => {
            jest.mocked(subventionsService.getSubventionExercise).mockReset();
            jest.mocked(paymentService.getPaymentExercise).mockReset();
        });

        const GRANT_APPLICATION_EXERCISE_LOWER_THAN_PAYMENT = {
            application: { annee_demande: 2019 },
            payments: [{ dateOperation: 2020 }, { dateOperation: 2020 }, { dateOperation: 2020 }],
        };

        const GRANT_ONE_EXERCISE = {
            application: { annee_demande: 2020 },
            payments: [{ dateOperation: 2020 }, { dateOperation: 2020 }, { dateOperation: 2020 }],
        };

        const GRANT_NO_APPLICATION = {
            application: undefined,
            payments: [{ dateOperation: 2021 }, { dateOperation: 2021 }, { dateOperation: 2021 }],
        };

        const GRANT_NO_PAYMENT = { application: { annee_demande: 2020 }, payments: undefined };

        const GRANTS = [
            GRANT_APPLICATION_EXERCISE_LOWER_THAN_PAYMENT,
            GRANT_ONE_EXERCISE,
            GRANT_NO_APPLICATION,
            GRANT_NO_PAYMENT,
        ];

        it("should call subventionsService", () => {
            // @ts-expect-error: partial object
            grantService.groupGrantsByExercise(GRANTS);
            expect(subventionsService.getSubventionExercise).toHaveBeenCalledTimes(1); // number of grant without payment
        });

        it("should call paymentService", () => {
            // @ts-expect-error: partial object
            grantService.groupGrantsByExercise(GRANTS);
            expect(paymentService.getPaymentExercise).toHaveBeenCalledTimes(3); // number of grant with payments
        });

        it("should throw an error if no application nor payments", () => {
            // @ts-expect-error: partial object
            expect(() => grantService.groupGrantsByExercise([GRANT_ONE_EXERCISE, {}])).toThrow(
                "We should not have Grant without payment nor application",
            );
        });

        it("should group grants by exercise", () => {
            const expected = {
                // order matters and should be the same as described in GRANTS definition
                2020: [GRANT_APPLICATION_EXERCISE_LOWER_THAN_PAYMENT, GRANT_ONE_EXERCISE, GRANT_NO_PAYMENT],
                2021: [GRANT_NO_APPLICATION],
            };
            // @ts-expect-error: partial object
            const actual = grantService.groupGrantsByExercise(GRANTS);
            expect(actual).toEqual(expected);
        });
    });

    // JoinGrants test relies on groupRawGrantsByType return value.
    // Every given param to joinGrants is used to make it seems real
    describe("joinGrants", () => {
        let mockGroupRawGrantsByType: jest.SpyInstance;
        let mockSendDuplicateMessage: jest.SpyInstance;

        beforeAll(() => {
            // @ts-expect-error: mock private method
            mockGroupRawGrantsByType = jest.spyOn(grantService, "groupRawGrantsByType");
            mockGroupRawGrantsByType.mockReturnValue(GRANTS_BY_TYPE);
            // @ts-expect-error: mock private method
            mockSendDuplicateMessage = jest.spyOn(grantService, "sendDuplicateMessage");
        });

        afterAll(() => {
            mockGroupRawGrantsByType.mockRestore();
            mockSendDuplicateMessage.mockRestore();
        });

        it("should call groupRawGrantsByType", () => {
            // @ts-expect-error: test private method
            grantService.joinGrants(RAW_GRANTS);
            expect(mockGroupRawGrantsByType).toBeCalledWith(RAW_GRANTS);
        });

        it("should call sendDuplicateMessage with fullGrants sharing same joinKey", () => {
            mockGroupRawGrantsByType.mockReturnValueOnce({
                fullGrants: [RAW_FULL_GRANT, RAW_FULL_GRANT],
            });

            // @ts-expect-error: test private method
            grantService.joinGrants([RAW_FULL_GRANT, RAW_FULL_GRANT]);
            expect(mockSendDuplicateMessage).toHaveBeenCalledWith(RAW_FULL_GRANT.joinKey);
        });

        it("should call sendDuplicateMessage with applications sharing same joinKey", () => {
            mockGroupRawGrantsByType.mockReturnValueOnce({
                fullGrants: [RAW_APPLICATION, RAW_APPLICATION],
            });

            // @ts-expect-error: test private method
            grantService.joinGrants([RAW_APPLICATION, RAW_APPLICATION]);
            expect(mockSendDuplicateMessage).toHaveBeenCalledWith(RAW_APPLICATION.joinKey);
        });

        it("should call sendDuplicateMessage with fullGrant and application sharing same joinKey", () => {
            mockGroupRawGrantsByType.mockReturnValueOnce({
                fullGrants: [RAW_FULL_GRANT, { ...RAW_APPLICATION, joinKey: RAW_FULL_GRANT.joinKey }],
            });

            // @ts-expect-error: test private method
            grantService.joinGrants([RAW_FULL_GRANT, { ...RAW_APPLICATION, joinKey: RAW_FULL_GRANT.joinKey }]);
            expect(mockSendDuplicateMessage).toHaveBeenCalledWith(RAW_FULL_GRANT.joinKey);
        });

        it("should return JoinedGrants", () => {
            const expected = [
                { fullGrants: [RAW_FULL_GRANT], applications: [], payments: [RAW_PAYMENTS[0], RAW_PAYMENTS[1]] },
                { fullGrants: [], applications: [RAW_APPLICATION], payments: [RAW_PAYMENTS[2], RAW_PAYMENTS[3]] },
            ];

            // @ts-expect-error: test private method
            const actual = grantService.joinGrants(RAW_GRANTS);
            expect(actual).toEqual(expected);
        });

        it("should return JoinedGrants with lonely grants", () => {
            const LONELY_FULL_GRANT = { ...RAW_FULL_GRANT, joinKey: undefined };
            const LONELY_APPLICATION = { ...RAW_APPLICATION, joinKey: undefined };
            const LONELY_PAYMENT = { ...RAW_PAYMENTS[0], joinKey: undefined };
            const GRANT_BY_TYPE_WITH_LONELY = {
                fullGrants: [RAW_FULL_GRANT, LONELY_FULL_GRANT],
                applications: [RAW_APPLICATION, LONELY_APPLICATION],
                payments: [...RAW_PAYMENTS, LONELY_PAYMENT],
            };
            mockGroupRawGrantsByType.mockReturnValueOnce(GRANT_BY_TYPE_WITH_LONELY);

            const expected: JoinedRawGrant[] = [
                { fullGrants: [RAW_FULL_GRANT], applications: [], payments: [RAW_PAYMENTS[0], RAW_PAYMENTS[1]] },
                { fullGrants: [], applications: [RAW_APPLICATION], payments: [RAW_PAYMENTS[2], RAW_PAYMENTS[3]] },
                { fullGrants: [LONELY_FULL_GRANT], applications: [], payments: [] },
                { fullGrants: [], applications: [LONELY_APPLICATION], payments: [] },
                { fullGrants: [], applications: [], payments: [LONELY_PAYMENT] },
            ];

            // @ts-expect-error: test private method
            const actual = grantService.joinGrants([
                ...RAW_GRANTS,
                LONELY_FULL_GRANT,
                LONELY_APPLICATION,
                LONELY_PAYMENT,
            ]);

            expect(actual).toEqual(expected);
        });
    });

    describe("getCommonGrants", () => {
        let getGrantsMock;
        beforeAll(() => {
            // @ts-expect-error: mock
            getGrantsMock = jest.spyOn(grantService, "getRawGrants").mockResolvedValue([1, 2]);
            // @ts-expect-error: mock
            mocked(commonGrantService.rawToCommon).mockImplementation(v => v);
        });

        afterAll(() => {
            getGrantsMock.mockReset();
            mocked(commonGrantService.rawToCommon).mockReset();
        });

        it("gets raw grants", async () => {
            await grantService.getCommonGrants(ESTABLISHMENT_ID);
            expect(getGrantsMock).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });

        it("calls adapter as many times as necessary", async () => {
            await grantService.getCommonGrants(ESTABLISHMENT_ID);
            expect(commonGrantService.rawToCommon).toHaveBeenCalledWith(1, false);
            expect(commonGrantService.rawToCommon).toHaveBeenCalledTimes(2);
        });

        it("calls adapter as many times as necessary with publishable param", async () => {
            await grantService.getCommonGrants(ESTABLISHMENT_ID, true);
            expect(commonGrantService.rawToCommon).toHaveBeenCalledWith(1, true);
            expect(commonGrantService.rawToCommon).toHaveBeenCalledTimes(2);
        });

        it("returns adapted and filtered grants", async () => {
            mocked(commonGrantService.rawToCommon).mockReturnValueOnce(null);
            const expected = [2];
            const actual = await grantService.getCommonGrants(ESTABLISHMENT_ID, true);
            expect(actual).toEqual(expected);
        });
    });

    describe("handleMultiYearGrants", () => {
        let separateOneBy: jest.SpyInstance;

        beforeAll(() => {
            separateOneBy = jest.spyOn(grantService, "splitGrantByExercise").mockReturnValue([]);
        });

        afterAll(() => {
            separateOneBy.mockRestore();
        });

        it("calls splitGrantByExercise for each grant", () => {
            grantService.handleMultiYearGrants([1, 2, 3] as unknown as Grant[]);
            expect(separateOneBy).toHaveBeenCalledTimes(3);
        });

        it("returns flattened result from splitGrantByExercise", () => {
            separateOneBy.mockReturnValueOnce([1, 2]);
            separateOneBy.mockReturnValueOnce([3]);
            separateOneBy.mockReturnValueOnce([4, 5]);
            const expected = [1, 2, 3, 4, 5];
            const actual = grantService.handleMultiYearGrants([1, 2, 3] as unknown as Grant[]);
            expect(actual).toEqual(expected);
        });
    });

    describe("splitGrantByExercise", () => {
        const APPLICATION = { id: 1, annee_demande: { value: 2022 } };
        const PAYMENT = (annee = 2022) => ({ annee });
        const mockGetPaymentYear = jest.fn(payment => payment.annee);
        const DISPARATE_PAYMENTS = [PAYMENT(2022), PAYMENT(2023), PAYMENT(2022)];

        beforeAll(() => {
            jest.mocked(paymentService.getPaymentExercise).mockImplementation(mockGetPaymentYear);
            jest.mocked(subventionsService.getSubventionExercise).mockReturnValue(APPLICATION.annee_demande.value);
        });

        it("calls getPaymentExercise for each payment", () => {
            // @ts-expect-error -- mocked args
            grantService.splitGrantByExercise({ application: null, payments: DISPARATE_PAYMENTS });
            expect(mockGetPaymentYear).toHaveBeenCalledTimes(3);
        });

        it("separates application and payments from different years", () => {
            const expected = [
                {
                    application: APPLICATION,
                    payments: [PAYMENT(2022), PAYMENT(2022)],
                },
                { application: null, payments: [PAYMENT(2023)] },
            ];
            const actual = grantService.splitGrantByExercise({
                // @ts-expect-error -- mocked args
                application: APPLICATION,
                // @ts-expect-error -- mocked args
                payments: DISPARATE_PAYMENTS,
            });
            expect(actual).toEqual(expected);
        });
    });
});
