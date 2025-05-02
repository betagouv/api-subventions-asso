import { CommonGrantService } from "./commonGrant.service";

jest.mock("../providers", () => ({
    notGrandProvider: { provider: { id: "notGrant" } },
    providerNoId: { provider: { id: null }, isGrantProvider: true },
    providerNoMethod: { provider: { id: "providerNoMethod" }, isGrantProvider: true },
    goodProvider: { provider: { id: "goodProvider" }, isGrantProvider: true, rawToCommon: jest.fn() },
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
                    provider: { id: "goodProvider" },
                    isGrantProvider: true,
                    rawToCommon: expect.any(Function),
                },
            };
            // @ts-expect-error - mock private
            const actual = new CommonGrantService().providerMap;
            expect(actual).toMatchObject(expected);
        });
    });

    describe("filterAdaptable", () => {
        it("returns empty list to undefined value", () => {
            const actual = commonGrantServiceTest.filterAdaptable(undefined);
            const expected = [];
            expect(actual).toEqual(expected);
        });
        it("removes grants of providers that do not implement adapter's method", () => {
            commonGrantServiceTest.providerMap = { goodProvider: {} };
            const grants = [{ provider: "unknown" }, { provider: "goodProvider" }];
            const expected = [{ provider: "goodProvider" }];
            const actual = commonGrantServiceTest.filterAdaptable(grants);
            expect(actual).toEqual(expected);
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
        const RAW_PAYMENTS = [{ p: 1 }, { p: "toFilterOut" }, { p: 2 }];
        const RAW_FULL_GRANTS = [
            { p: 3, a: 3 },
            { p: 4, a: 4 },
            { p: "toFilterOut", a: "toFilterOut" },
        ];
        const RAW_APPLICATIONS = [{ a: 1 }, { a: 2 }, { a: "toFilterOut" }];
        const JOINED_RAW_GRANT = {
            payments: RAW_PAYMENTS,
            applications: RAW_APPLICATIONS,
            fullGrants: RAW_FULL_GRANTS,
        };
        const FILTERED_FULL_GRANTS = [
            { p: 3, a: 3 },
            { p: 4, a: 4 },
        ];
        const FILTERED_APPLICATIONS = [{ a: 1 }, { a: 2 }];

        const ADAPTED_PAYMENTS = [{ aP: 1 }, { aP: 2 }, { aP: 3 }, { aP: 4 }];
        const SELECTED_APPLICATION = { a: 3, p: 3 };

        const FINAL_PAYMENT = { aP: 10 };
        const FINAL_APPLICATION = { aP: 3, aA: 3 };

        beforeAll(() => {
            commonGrantServiceTest = {
                rawToCommon: commonGrantServiceTest.rawToCommon,
                filterAdaptable: jest.fn(grants =>
                    (grants || []).filter(grant => Object.values(grant).some(key => key != "toFilterOut")),
                ),
                rawToCommonFragment: jest.fn(() => ({})),

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                aggregatePayments: jest.fn((..._args) => FINAL_PAYMENT),
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                chooseRawApplication: jest.fn((..._args) => SELECTED_APPLICATION),
            };
        });
        afterAll(() => (commonGrantServiceTest = new CommonGrantService()));

        it.each`
            entity            | object              | nthCall
            ${"full grants"}  | ${RAW_FULL_GRANTS}  | ${1}
            ${"applications"} | ${RAW_APPLICATIONS} | ${2}
            ${"payments"}     | ${RAW_PAYMENTS}     | ${3}
        `("filters $entity", ({ object, nthCall }) => {
            commonGrantServiceTest.rawToCommon(JOINED_RAW_GRANT);
            expect(commonGrantServiceTest.filterAdaptable).toHaveBeenNthCalledWith(nthCall, object);
        });

        it("selects application from filtered applications and full grants", () => {
            commonGrantServiceTest.filterAdaptable.mockReturnValueOnce(FILTERED_FULL_GRANTS);
            commonGrantServiceTest.filterAdaptable.mockReturnValueOnce(FILTERED_APPLICATIONS);
            commonGrantServiceTest.rawToCommon(JOINED_RAW_GRANT);
            expect(commonGrantServiceTest.chooseRawApplication).toHaveBeenCalledWith([
                ...FILTERED_APPLICATIONS,
                ...FILTERED_FULL_GRANTS,
            ]);
        });
        it("adapts selected application or full grant", () => {
            commonGrantServiceTest.rawToCommon(JOINED_RAW_GRANT);
            commonGrantServiceTest.chooseRawApplication.mockReturnValueOnce(SELECTED_APPLICATION);
            expect(commonGrantServiceTest.rawToCommonFragment).toHaveBeenNthCalledWith(
                1,
                SELECTED_APPLICATION,
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
            expect(commonGrantServiceTest.rawToCommonFragment).toHaveBeenCalledWith(
                expect.anything(),
                expect.anything(),
            );
            expect(commonGrantServiceTest.rawToCommonFragment).toHaveBeenCalledWith({ p: 1 }, expect.any(Boolean));
            expect(commonGrantServiceTest.rawToCommonFragment).toHaveBeenCalledWith({ p: 2 }, expect.any(Boolean));
            expect(commonGrantServiceTest.rawToCommonFragment).toHaveBeenCalledWith(
                { a: 3, p: 3 },
                expect.any(Boolean),
            );
            expect(commonGrantServiceTest.rawToCommonFragment).toHaveBeenCalledWith(
                { a: 4, p: 4 },
                expect.any(Boolean),
            );
        });
        it("aggregates adapted payments", () => {
            commonGrantServiceTest.rawToCommonFragment.mockReturnValueOnce({}); // applications
            commonGrantServiceTest.rawToCommonFragment.mockReturnValueOnce({ aP: 1 });
            commonGrantServiceTest.rawToCommonFragment.mockReturnValueOnce({ aP: 2 });
            commonGrantServiceTest.rawToCommonFragment.mockReturnValueOnce({ aP: 3 });
            commonGrantServiceTest.rawToCommonFragment.mockReturnValueOnce({ aP: 4 });
            commonGrantServiceTest.rawToCommon(JOINED_RAW_GRANT);
            expect(commonGrantServiceTest.aggregatePayments).toHaveBeenCalledWith(ADAPTED_PAYMENTS);
        });
        it("does not fail if no payment nor full grant", () => {
            const test = () => commonGrantServiceTest.rawToCommon({ applications: RAW_APPLICATIONS });
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
            const expected = { ...FINAL_APPLICATION, ...FINAL_PAYMENT };
            commonGrantServiceTest.rawToCommonFragment.mockReturnValueOnce({ aA: 3 });
            const actual = commonGrantServiceTest.rawToCommon(JOINED_RAW_GRANT);
            expect(actual).toEqual(expected);
        });
    });
});
