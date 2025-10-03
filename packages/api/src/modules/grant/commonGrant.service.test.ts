import { CommonGrantService } from "./commonGrant.service";

jest.mock("../providers", () => ({
    notGrandProvider: { meta: { id: "notGrant" } },
    providerNoId: { meta: { id: null }, isGrantProvider: true },
    providerNoMethod: { meta: { id: "providerNoMethod" }, isGrantProvider: true },
    goodProvider: { meta: { id: "goodProvider" }, isGrantProvider: true, rawToCommon: jest.fn() },
}));

describe("CommonGrantService", () => {
    let commonGrantServiceTest;
    beforeAll(() => {
        commonGrantServiceTest = new CommonGrantService();
    });
    describe("constructor", () => {
        it("configures commonDto providers", () => {
            const expected = {
                goodProvider: {
                    meta: { id: "goodProvider" },
                    isGrantProvider: true,
                    rawToCommon: expect.any(Function),
                },
            };
            // @ts-expect-error - mock private
            const actual = new CommonGrantService().providerMap;
            expect(actual).toMatchObject(expected);
        });
    });

    describe("rawToCommonFragment", () => {
        const RES = { montant_demande: 42 };
        const RAW = { provider: "goodProvider", data: {} };
        beforeAll(() => {
            commonGrantServiceTest = new CommonGrantService();
            commonGrantServiceTest.providerMap = { goodProvider: { rawToCommon: jest.fn(() => RES) } };
        });
        it("calls provider's adapting method", () => {
            commonGrantServiceTest.rawToCommonFragment(RAW, true);
            expect(commonGrantServiceTest.providerMap.goodProvider.rawToCommon).toHaveBeenCalledWith(RAW);
        });
        it("returns value from provider's method", () => {
            const expected = RES;
            const actual = commonGrantServiceTest.rawToCommonFragment(RAW, false);
            expect(actual).toEqual(expected);
        });
        it("remove 'montant_demande' if publishable", () => {
            const expected = {};
            const actual = commonGrantServiceTest.rawToCommonFragment(RAW, true);
            expect(actual).toEqual(expected);
        });
    });

    describe("aggregatePayments", () => {
        const PAYMENTS = [
            {
                montant_verse: 17,
                bop: "A",
                date_debut: new Date("2022-02-02"),
            },
            {
                montant_verse: 25,
                bop: "A",
                date_debut: new Date("2022-03-03"),
            },
        ];
        it("returns 'montant_verse' : sum of given payments", () => {
            const expected = 42;
            const actual = commonGrantServiceTest.aggregatePayments(PAYMENTS).montant_verse;
            expect(actual).toBe(expected);
        });
        it("returns 'date_debut' : min of given payments", () => {
            const expected = new Date("2022-02-02");
            const actual = commonGrantServiceTest.aggregatePayments(PAYMENTS).date_debut;
            expect(actual).toEqual(expected);
        });
        it("returns 'bop' : the same if all equal", () => {
            const expected = "A";
            const actual = commonGrantServiceTest.aggregatePayments(PAYMENTS).bop;
            expect(actual).toEqual(expected);
        });
        it("returns 'bop': 'multi-bop' if not all equal", () => {
            const paymentOtherBop = {
                montant_verse: 91,
                bop: "B",
                date_debut: new Date("2022-04-04"),
            };
            const expected = "multi-bop";
            const actual = commonGrantServiceTest.aggregatePayments([...PAYMENTS, paymentOtherBop]).bop;
            expect(actual).toBe(expected);
        });
    });

    describe("chooseRawApplications", () => {
        // none because business logic is certainly not the good one
    });

    describe("rawToCommon", () => {
        const RAW_PAYMENTS = [{ p: 1 }, { p: 2 }];
        const RAW_APPLICATION = { a: 1 };
        const JOINED_RAW_GRANT = {
            payments: RAW_PAYMENTS,
            application: RAW_APPLICATION,
        };

        const ADAPTED_APPLICATION = { aA: 1 };
        const ADAPTED_PAYMENTS = [{ aP: 1 }, { aP: 2 }];
        const AGGREGATED_PAYMENTS = { aP: 3 };
        const COMMON_GRANT = { ...ADAPTED_APPLICATION, ...AGGREGATED_PAYMENTS };

        beforeAll(() => {
            commonGrantServiceTest = {
                rawToCommon: commonGrantServiceTest.rawToCommon,

                rawToCommonFragment: jest.fn(() => ({})),

                aggregatePayments: jest.fn((..._args) => AGGREGATED_PAYMENTS),
            };
        });
        afterAll(() => (commonGrantServiceTest = new CommonGrantService()));

        it("adapts selected application or full grant", () => {
            commonGrantServiceTest.rawToCommon(JOINED_RAW_GRANT);
            expect(commonGrantServiceTest.rawToCommonFragment).toHaveBeenNthCalledWith(
                1,
                RAW_APPLICATION,
                expect.any(Boolean),
            );
        });

        it("does not fail if no application nor full grant", () => {
            const test = () => commonGrantServiceTest.rawToCommon({ payments: RAW_PAYMENTS });
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            expect(test).resolves;
        });

        it("adapts all payments and full grants", () => {
            commonGrantServiceTest.rawToCommon(JOINED_RAW_GRANT);
            expect(commonGrantServiceTest.rawToCommonFragment).toHaveBeenNthCalledWith(
                1,
                RAW_APPLICATION,
                expect.any(Boolean),
            );
            for (const [index, rawPayment] of RAW_PAYMENTS.entries()) {
                expect(commonGrantServiceTest.rawToCommonFragment).toHaveBeenNthCalledWith(
                    index + 2, // nth call start at 1 and index start at 0 so we need to +2 to omit the first call
                    rawPayment,
                    expect.any(Boolean),
                );
            }
        });

        it("aggregates adapted payments", () => {
            commonGrantServiceTest.rawToCommonFragment.mockReturnValueOnce({}); // applications
            commonGrantServiceTest.rawToCommonFragment.mockReturnValueOnce(ADAPTED_PAYMENTS[0]);
            commonGrantServiceTest.rawToCommonFragment.mockReturnValueOnce(ADAPTED_PAYMENTS[1]);
            commonGrantServiceTest.rawToCommon(JOINED_RAW_GRANT);
            expect(commonGrantServiceTest.aggregatePayments).toHaveBeenCalledWith(ADAPTED_PAYMENTS);
        });
        it("does not fail if no payment nor full grant", () => {
            const test = () => commonGrantServiceTest.rawToCommon({ application: RAW_APPLICATION });
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            expect(test).resolves;
        });
        it("returns null if neither application nor payment", () => {
            const expected = null;
            const actual = commonGrantServiceTest.rawToCommon({});
            commonGrantServiceTest.rawToCommonFragment.mockReturnValue(null);
            expect(actual).toEqual(expected);
        });

        it("return grant: application and payment merged", () => {
            const expected = COMMON_GRANT;
            commonGrantServiceTest.rawToCommonFragment.mockReturnValueOnce(ADAPTED_APPLICATION);
            commonGrantServiceTest.aggregatePayments.mockReturnValue(AGGREGATED_PAYMENTS);
            const actual = commonGrantServiceTest.rawToCommon(JOINED_RAW_GRANT);
            expect(actual).toEqual(expected);
        });
    });
});
