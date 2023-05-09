import * as dataHelper from "@helpers/dataHelper";
jest.mock("@helpers/dataHelper");
import * as dateHelper from "@helpers/dateHelper";
jest.mock("@helpers/dateHelper");
import * as subventionVersementHelper from "@components/SubventionsVersementsDashboard/helper";
jest.mock("@components/SubventionsVersementsDashboard/helper");

import VersementsAdapter from "@resources/versements/versements.adapter";

describe("Versements Adapter", () => {
    const MOST_RECENT_DATE = new Date();
    const VERSEMENTS = [
        { amount: 30, dateOperation: new Date(MOST_RECENT_DATE.getDate() - 1) },
        { amount: 40, dateOperation: new Date(MOST_RECENT_DATE.getDate() - 3) },
        { amount: 30, dateOperation: MOST_RECENT_DATE },
    ];

    describe("toVersement()", () => {
        const mockFormatBop = jest.spyOn(VersementsAdapter, "_formatBop");
        const mockGetTotalPayment = jest.spyOn(VersementsAdapter, "_getTotalPayment");

        const mocks = [mockGetTotalPayment];

        beforeAll(() => mocks.forEach(mock => mock.mockImplementation(jest.fn())));
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

        it("should call _formatBop()", () => {
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

    describe("_fromatBop()", () => {
        it("should remove first character", () => {
            const BOP = "0163";
            const expected = "163";
            const actual = VersementsAdapter._formatBop(BOP);
            expect(actual).toEqual(expected);
        });

        it("should return untouched bop", () => {
            const BOP = 1267;
            const expected = BOP;
            const actual = VersementsAdapter._formatBop(BOP);
            expect(actual).toEqual(expected);
        });

        it("should return undefined", () => {
            const BOP = undefined;
            const expected = undefined;
            const actual = VersementsAdapter._formatBop(BOP);
            expect(actual).toEqual(expected);
        });
    });

    describe("_getTotalPayment", () => {
        const spyCountTotalVersement = jest.spyOn(VersementsAdapter, "_countTotalVersement");
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
