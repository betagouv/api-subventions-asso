import commonGrantService from "./common-grant.service";
import mocked = jest.mocked;
import { JoinedRawGrant, RawApplication, RawPayment } from "./@types/RawGrant";
import * as Sentry from "@sentry/node";
import { DemandeSubvention, Grant, Payment } from "dto";
import { SIRET_STR } from "../../../tests/__fixtures__/association.fixture";
import EstablishmentIdentifier from "../../identifier-objects/EstablishmentIdentifier";
import AssociationIdentifier from "../../identifier-objects/AssociationIdentifier";
import paymentService from "../payments/payments.service";
import Siret from "../../identifier-objects/Siret";
import { APPLICATION_LINK_TO_CHORUS } from "../application-flat/__fixtures__/application-flat.fixture";
import { CHORUS_PAYMENT_FLAT_ENTITY } from "../payment-flat/__fixtures__/payment-flat.fixture";
import paymentFlatService from "../payment-flat/payment-flat.service";
import { RawGrantService } from "./raw-grant.service";

jest.mock("@sentry/node");
jest.mock("./common-grant.service");
jest.mock("../associations/associations.service");
jest.mock("../payments/payments.service");
jest.mock("../application-flat/application-flat.service");
jest.mock("../payment-flat/payment-flat.service");

describe("RawGrantService", () => {
    const SIRET = new Siret(SIRET_STR);
    const ESTABLISHMENT_ID = EstablishmentIdentifier.fromSiret(SIRET, AssociationIdentifier.fromSiren(SIRET.toSiren()));

    const JOIN_KEY_1 = "JOIN_KEY_1";
    const JOIN_KEY_2 = "JOIN_KEY_2";
    const RAW_APPLICATION: RawApplication = {
        provider: "application-flat",
        data: APPLICATION_LINK_TO_CHORUS,
        type: "application",
        joinKey: JOIN_KEY_2,
    };
    const RAW_PAYMENTS: RawPayment[] = [
        {
            provider: "payment-flat",
            data: CHORUS_PAYMENT_FLAT_ENTITY,
            type: "payment",
            joinKey: JOIN_KEY_1,
        },
        {
            provider: "payment-flat",
            data: CHORUS_PAYMENT_FLAT_ENTITY,
            type: "payment",
            joinKey: JOIN_KEY_1,
        },
        {
            provider: "payment-flat",
            data: CHORUS_PAYMENT_FLAT_ENTITY,
            type: "payment",
            joinKey: JOIN_KEY_2,
        },
        {
            provider: "payment-flat",
            data: CHORUS_PAYMENT_FLAT_ENTITY,
            type: "payment",
            joinKey: JOIN_KEY_2,
        },
    ];

    const GRANTS_BY_TYPE = {
        applications: [RAW_APPLICATION],
        payments: RAW_PAYMENTS,
    };

    const DEFAULT_JOINED_RAW_GRANT = {
        application: RAW_APPLICATION,
        payments: RAW_PAYMENTS.filter(rawPayment => rawPayment.joinKey === RAW_APPLICATION.joinKey),
    };
    const APPLICATION = { siret: SIRET_STR } as unknown as DemandeSubvention;
    // @ts-expect-error: mock type
    const PAYMENTS = [{ bop: 163 }, { bop: 147 }] as Payment[];
    // @ts-expect-error: mock type
    const GRANT: Grant = { application: APPLICATION, payments: [{ bop: 101 } as Payment] };

    const mockTransformApplication = { execute: jest.fn() };
    const service = new RawGrantService(mockTransformApplication);

    describe("adaptRawGrant", () => {
        it("adapts payment flat", () => {
            const raw = RAW_PAYMENTS[0];
            service.adaptRawGrant(raw);
            expect(paymentFlatService.rawToPayment).toHaveBeenCalledWith(raw);
        });

        it("adapts application flat", () => {});
    });

    describe("adaptJoinedRawGrant", () => {
        let mockToGrant, mockAdapteRawGrant;

        beforeAll(() => {
            mockToGrant = jest.spyOn(service, "toGrant").mockReturnValue(GRANT);
            // @ts-expect-error: mock
            mockAdapteRawGrant = jest.spyOn(service, "adaptRawGrant").mockImplementation(rawGrant => rawGrant);
        });

        afterAll(() => {
            mockToGrant.mockRestore();
            mockAdapteRawGrant.mockRestore();
        });

        it.each`
            arrayName | joinedRawGrant | calls
            ${"payments"} | ${{
    applications: null,
    payments: [RAW_PAYMENTS[0], RAW_PAYMENTS[1]],
}} | ${2}
            ${"application"} | ${{
    application: RAW_APPLICATION,
    payments: [],
}} | ${1}
            ${"payments and application"} | ${{
    application: RAW_APPLICATION,
    payments: [RAW_PAYMENTS[0], RAW_PAYMENTS[1]],
}} | ${3}
        `("should call adaptRawGrant for each $arrayName", ({ joinedRawGrant, calls }) => {
            service.adaptJoinedRawGrant(joinedRawGrant);
            expect(mockAdapteRawGrant).toHaveBeenCalledTimes(calls);
        });

        it("should filter out null adapted grants", () => {
            mockAdapteRawGrant.mockReturnValue(null);
            service.adaptJoinedRawGrant({
                application: {} as unknown as RawApplication,
                payments: [{}] as unknown as RawPayment[],
            });
            expect(mockToGrant).toHaveBeenCalledWith({ application: null, payments: [] });
            mockAdapteRawGrant.mockImplementation(rawGrant => rawGrant);
        });

        it("should call toGrant", () => {
            service.adaptJoinedRawGrant(DEFAULT_JOINED_RAW_GRANT);
            expect(mockToGrant).toHaveBeenCalledWith(DEFAULT_JOINED_RAW_GRANT);
        });
    });

    describe("toGrant", () => {
        it.each`
            description                             | joinedRawGrant | expected
            ${"return undefined if no param"}       | ${undefined}   | ${undefined}
            ${"return undefined with empty object"} | ${{}}          | ${undefined}
            ${"return undefined with properties undefined"} | ${{
    application: undefined,
    payment: undefined,
}} | ${undefined}
            ${"return undefined with empty arrays"} | ${{
    application: null,
    payments: [],
}} | ${undefined}
            ${"return only payments"} | ${{
    application: null,
    payments: PAYMENTS,
}} | ${{ application: null, payments: PAYMENTS }}
            ${"return first application + payments"} | ${{
    application: APPLICATION,
    payments: PAYMENTS,
}} | ${{ application: APPLICATION, payments: PAYMENTS }}
            ${"return first application"} | ${{
    application: APPLICATION,
    payments: [],
}} | ${{ application: APPLICATION, payments: [] }}
        `("$description", ({ joinedRawGrant, expected }) => {
            const grant = service.toGrant(joinedRawGrant);
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
            const actual = service.sortByGrantType(grants);
            expect(actual).toEqual(expected);
        });
    });

    describe("getOldGrants", () => {
        const JOINED_RAW_GRANTS = [DEFAULT_JOINED_RAW_GRANT, {}];
        // @ts-expect-error: mock DemandeSubvention
        const GRANT_2 = { application: { siret: "10000000000002" } as DemandeSubvention, payments: [] };
        const GROUPED_BY_EXERCISE_GRANTS = {
            "2024": [GRANT],
            unknown: [GRANT_2],
        };
        const mockGetRawGrants = jest.spyOn(service, "getRawGrants");
        const mockAdapteJoinedRawGrant = jest.spyOn(service, "adaptJoinedRawGrant");
        const mockSortByGrantType = jest.spyOn(service, "sortByGrantType");
        const mockHandleMultiYearGrants = jest.spyOn(service, "handleMultiYearGrants");
        const mockGroupGrantsByExercise = jest.spyOn(service, "groupGrantsByExercise");
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

        it("should call getRawGrants", async () => {
            await service.getOldGrants(ESTABLISHMENT_ID);
            expect(mockGetRawGrants).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });

        it("should call adaptJoinedRawGrant", async () => {
            await service.getOldGrants(ESTABLISHMENT_ID);
            expect(mockAdapteJoinedRawGrant).toHaveBeenCalledTimes(JOINED_RAW_GRANTS.length);
        });

        it("should call handleMultiYearGrants", async () => {
            await service.getOldGrants(ESTABLISHMENT_ID);
            expect(mockHandleMultiYearGrants).toHaveBeenCalledWith([GRANT, GRANT]);
        });

        it("should call sortByGrantType", async () => {
            await service.getOldGrants(ESTABLISHMENT_ID);
            expect(mockSortByGrantType).toHaveBeenNthCalledWith(1, [GRANT]);
            expect(mockSortByGrantType).toHaveBeenNthCalledWith(2, [GRANT_2]);
        });
    });

    describe("sendDuplicateMessage", () => {
        it("should call Sentry.captureMessage()", () => {
            // @ts-expect-error: test private method only
            service.sendDuplicateMessage(JOIN_KEY_1);
            expect(Sentry.captureMessage).toHaveBeenCalledWith(
                `Duplicate joinKey found for grants or applications :  ${JOIN_KEY_1}`,
            );
        });
    });

    describe("groupGrantsByExercise", () => {
        beforeAll(() => {
            // @ts-expect-error: mock
            jest.mocked(paymentService.getPaymentExercise).mockImplementation(payment => payment.dateOperation);
        });

        afterAll(() => {
            jest.mocked(paymentService.getPaymentExercise).mockReset();
        });

        const GRANT_APPLICATION_EXERCISE_LOWER_THAN_PAYMENT = {
            application: { annee_demande: { value: 2019 } },
            payments: [{ dateOperation: 2020 }, { dateOperation: 2020 }, { dateOperation: 2020 }],
        };

        const GRANT_ONE_EXERCISE = {
            application: { annee_demande: { value: 2020 } },
            payments: [{ dateOperation: 2020 }, { dateOperation: 2020 }, { dateOperation: 2020 }],
        };

        const GRANT_NO_APPLICATION = {
            application: undefined,
            payments: [{ dateOperation: 2021 }, { dateOperation: 2021 }, { dateOperation: 2021 }],
        };

        const GRANT_NO_PAYMENT = { application: { annee_demande: { value: 2020 } }, payments: undefined };

        const GRANTS = [
            GRANT_APPLICATION_EXERCISE_LOWER_THAN_PAYMENT,
            GRANT_ONE_EXERCISE,
            GRANT_NO_APPLICATION,
            GRANT_NO_PAYMENT,
        ];

        it("should call paymentService", () => {
            // @ts-expect-error: partial object
            service.groupGrantsByExercise(GRANTS);
            expect(paymentService.getPaymentExercise).toHaveBeenCalledTimes(3); // number of grant with payments
        });

        it("should throw an error if no application nor payments", () => {
            // @ts-expect-error: partial object
            expect(() => service.groupGrantsByExercise([GRANT_ONE_EXERCISE, {}])).toThrow(
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
            const actual = service.groupGrantsByExercise(GRANTS);
            expect(actual).toEqual(expected);
        });
    });

    describe("joinGrants", () => {
        let mockSendDuplicateMessage: jest.SpyInstance;

        beforeAll(() => {
            // @ts-expect-error: mock private method
            mockSendDuplicateMessage = jest.spyOn(service, "sendDuplicateMessage");
        });

        afterAll(() => {
            mockSendDuplicateMessage.mockRestore();
        });

        it("should return JoinedGrants", () => {
            const expected = [
                { application: RAW_APPLICATION, payments: [RAW_PAYMENTS[2], RAW_PAYMENTS[3]] },
                { application: undefined, payments: [RAW_PAYMENTS[0], RAW_PAYMENTS[1]] },
            ];

            // @ts-expect-error: test private method
            const actual = service.joinGrants(GRANTS_BY_TYPE);
            expect(actual).toEqual(expected);
        });

        it("should return JoinedGrants with lonely grants", () => {
            const LONELY_APPLICATION: RawApplication = { ...RAW_APPLICATION, joinKey: undefined };
            const LONELY_PAYMENT: RawPayment = { ...RAW_PAYMENTS[0], joinKey: undefined };
            const GRANT_BY_TYPE_WITH_LONELY = {
                applications: [RAW_APPLICATION, LONELY_APPLICATION],
                payments: [...RAW_PAYMENTS, LONELY_PAYMENT],
            };

            const expected: JoinedRawGrant[] = [
                { application: RAW_APPLICATION, payments: [RAW_PAYMENTS[2], RAW_PAYMENTS[3]] },
                { application: undefined, payments: [RAW_PAYMENTS[0], RAW_PAYMENTS[1]] },
                { application: LONELY_APPLICATION, payments: [] },
                { application: undefined, payments: [LONELY_PAYMENT] },
            ];

            // @ts-expect-error: test private method
            const actual = service.joinGrants(GRANT_BY_TYPE_WITH_LONELY);

            expect(actual).toEqual(expected);
        });
    });

    describe("getCommonGrants", () => {
        let getGrantsMock;
        beforeAll(() => {
            // @ts-expect-error: mock
            getGrantsMock = jest.spyOn(service, "getRawGrants").mockResolvedValue([1, 2]);
            // @ts-expect-error: mock
            mocked(commonGrantService.rawToCommon).mockImplementation(v => v);
        });

        afterAll(() => {
            getGrantsMock.mockReset();
            mocked(commonGrantService.rawToCommon).mockReset();
        });

        it("gets raw grants", async () => {
            await service.getCommonGrants(ESTABLISHMENT_ID);
            expect(getGrantsMock).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });

        it("calls adapter as many times as necessary", async () => {
            await service.getCommonGrants(ESTABLISHMENT_ID);
            expect(commonGrantService.rawToCommon).toHaveBeenCalledWith(1, false);
            expect(commonGrantService.rawToCommon).toHaveBeenCalledTimes(2);
        });

        it("calls adapter as many times as necessary with publishable param", async () => {
            await service.getCommonGrants(ESTABLISHMENT_ID, true);
            expect(commonGrantService.rawToCommon).toHaveBeenCalledWith(1, true);
            expect(commonGrantService.rawToCommon).toHaveBeenCalledTimes(2);
        });

        it("returns adapted and filtered grants", async () => {
            mocked(commonGrantService.rawToCommon).mockReturnValueOnce(null);
            const expected = [2];
            const actual = await service.getCommonGrants(ESTABLISHMENT_ID, true);
            expect(actual).toEqual(expected);
        });
    });

    describe("handleMultiYearGrants", () => {
        let separateOneBy: jest.SpyInstance;

        beforeAll(() => {
            separateOneBy = jest.spyOn(service, "splitGrantByExercise").mockReturnValue([]);
        });

        afterAll(() => {
            separateOneBy.mockRestore();
        });

        it("calls splitGrantByExercise for each grant", () => {
            service.handleMultiYearGrants([1, 2, 3] as unknown as Grant[]);
            expect(separateOneBy).toHaveBeenCalledTimes(3);
        });

        it("returns flattened result from splitGrantByExercise", () => {
            separateOneBy.mockReturnValueOnce([1, 2]);
            separateOneBy.mockReturnValueOnce([3]);
            separateOneBy.mockReturnValueOnce([4, 5]);
            const expected = [1, 2, 3, 4, 5];
            const actual = service.handleMultiYearGrants([1, 2, 3] as unknown as Grant[]);
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
        });

        it("calls getPaymentExercise for each payment", () => {
            // @ts-expect-error -- mocked args
            service.splitGrantByExercise({ application: null, payments: DISPARATE_PAYMENTS });
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
            const actual = service.splitGrantByExercise({
                // @ts-expect-error -- mocked args
                application: APPLICATION,
                // @ts-expect-error -- mocked args
                payments: DISPARATE_PAYMENTS,
            });
            expect(actual).toEqual(expected);
        });
    });
});
