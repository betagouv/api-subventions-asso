import * as dataHelper from "$lib/helpers/dataHelper";
vi.mock("$lib/helpers/dataHelper");
import * as dateHelper from "$lib/helpers/dateHelper";
vi.mock("$lib/helpers/dateHelper");
import * as subventionVersementHelper from "$lib/components/SubventionsVersementsDashboard/helper";
vi.mock("$lib/components/SubventionsVersementsDashboard/helper");

import VersementsAdapter from "$lib/resources/versements/versements.adapter";

describe("Versements Adapter", () => {
    const MOST_RECENT_DATE = new Date();
    const VERSEMENTS = [
        { amount: 30, dateOperation: new Date(MOST_RECENT_DATE.getDate() - 1) },
        { amount: 40, dateOperation: new Date(MOST_RECENT_DATE.getDate() - 3) },
        { amount: 30, dateOperation: MOST_RECENT_DATE },
    ];

    describe("toVersement()", () => {
        const mockFormatBop = vi.spyOn(VersementsAdapter, "formatBop");
        const mockChooseBop = vi.spyOn(VersementsAdapter, "_chooseBop");
        const mockGetTotalPayment = vi.spyOn(VersementsAdapter, "_getTotalPayment");

        const mocks = [mockGetTotalPayment];

        beforeAll(() => mocks.forEach(mock => mock.mockImplementation(vi.fn())));
        afterEach(() => mocks.forEach(mock => mock.mockClear()));
        afterAll(() => mocks.forEach(mock => mock.mockRestore()));

        it("should return an object with properties", () => {
            const actual = Object.keys(VersementsAdapter.toVersement(VERSEMENTS));
            expect(actual).toEqual(["totalAmount", "centreFinancier", "lastVersementDate", "bop"]);
        });

        it("should call getLastVersementsDate()", () => {
            VersementsAdapter.toVersement(VERSEMENTS);
            expect(subventionVersementHelper.getLastVersementsDate).toHaveBeenCalledTimes(1);
        });

        it("should call _getTotalPayment()", () => {
            VersementsAdapter.toVersement(VERSEMENTS);
            expect(mockGetTotalPayment).toHaveBeenCalledTimes(1);
        });

        it("should call _chooseBop()", () => {
            VersementsAdapter.toVersement(VERSEMENTS);
            expect(mockChooseBop).toHaveBeenCalledTimes(1);
        });

        it("should call formatBop()", () => {
            VersementsAdapter.toVersement(VERSEMENTS);
            expect(mockFormatBop).toHaveBeenCalledTimes(1);
        });

        it("should call valueOrHyphen() 4 times", () => {
            VersementsAdapter.toVersement(VERSEMENTS);
            expect(dataHelper.valueOrHyphen).toHaveBeenCalledTimes(4);
        });

        it("should call withTwoYearDigit() ", () => {
            VersementsAdapter.toVersement(VERSEMENTS);
            expect(dateHelper.withTwoDigitYear).toHaveBeenCalledTimes(1);
        });
    });

    describe("_countTotalVersement", () => {
        it("return 0 if versements array is empty ", () => {
            const expected = 0;
            const actual = VersementsAdapter._countTotalVersement([]);
            expect(actual).toEqual(expected);
        });

        it("return sum of versements", () => {
            const expected = 100;
            const actual = VersementsAdapter._countTotalVersement(VERSEMENTS);
            expect(actual).toEqual(expected);
        });
    });

    describe("fromatBop()", () => {
        it("should remove first character", () => {
            const BOP = "0163";
            const expected = "163";
            const actual = VersementsAdapter.formatBop(BOP);
            expect(actual).toEqual(expected);
        });

        it("should return untouched bop", () => {
            const BOP = 1267;
            const expected = BOP;
            const actual = VersementsAdapter.formatBop(BOP);
            expect(actual).toEqual(expected);
        });

        it("should return undefined", () => {
            const BOP = undefined;
            const expected = undefined;
            const actual = VersementsAdapter.formatBop(BOP);
            expect(actual).toEqual(expected);
        });
    });

    describe("_chooseBop()", () => {
        function testExpected(versements, expected) {
            const actual = VersementsAdapter._chooseBop(versements);
            expect(actual).toBe(expected);
        }

        it("returns general bop if any", () => {
            testExpected(
                [
                    { bop: "1", amount: 2 },
                    { bop: "1", amount: 1 },
                ],
                "1",
            );
        });

        it("ignores falsy bops", () => {
            testExpected(
                [
                    { bop: "1", amount: 2 },
                    { bop: null, amount: 1 },
                ],
                "1",
            );
        });

        it("returns 'multi-BOP' if multiple bops", () => {
            testExpected(
                [
                    { bop: "1", amount: 2 },
                    { bop: "2", amount: 1 },
                ],
                "multi-BOP",
            );
        });
    });

    describe("_getTotalPayment", () => {
        const spyCountTotalVersement = vi.spyOn(VersementsAdapter, "_countTotalVersement");
        it("should call _countTotalVersement()", () => {
            VersementsAdapter._getTotalPayment(VERSEMENTS);
            expect(spyCountTotalVersement).toHaveBeenCalledTimes(1);
        });

        it.each`
            value
            ${[]}
            ${undefined}
        `("should return undefined", ({ value }) => {
            const expected = undefined;
            const actual = VersementsAdapter._getTotalPayment(value);
            expect(actual).toEqual(expected);
        });
    });
});
