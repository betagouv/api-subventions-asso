import * as dataHelper from "@helpers/dataHelper";
jest.mock("@helpers/dataHelper");
import * as dateHelper from "@helpers/dateHelper";
jest.mock("@helpers/dateHelper");

import VersementsAdapter from "@resources/versements/versements.adapter";

describe("Versements Adapter", () => {
    const MOST_RECENT_DATE = new Date();
    const VERSEMENTS = [
        { amount: 30, dateOperation: new Date(MOST_RECENT_DATE.getDate() - 1) },
        { amount: 40, dateOperation: new Date(MOST_RECENT_DATE.getDate() - 3) },
        { amount: 30, dateOperation: MOST_RECENT_DATE }
    ];

    describe("toVersement()", () => {
        const mockCountTotalVersement = jest.spyOn(VersementsAdapter, "_countTotalVersement");
        const mockGetLastVersementsDate = jest.spyOn(VersementsAdapter, "_getLastVersementsDate");

        const mocks = [mockCountTotalVersement, mockGetLastVersementsDate];

        beforeAll(() => mocks.forEach(mock => mock.mockImplementation(jest.fn())));
        afterEach(() => mocks.forEach(mock => mock.mockClear()));
        afterAll(() => mocks.forEach(mock => mock.mockRestore()));

        it("should return an object with properties", () => {
            const actual = Object.keys(VersementsAdapter.toVersement(VERSEMENTS));
            expect(actual).toEqual(["totalAmount", "centreFinancier", "lastVersementDate"]);
        });

        it("should call _getLastVersementsDate()", () => {
            VersementsAdapter.toVersement(VERSEMENTS);
            expect(mockGetLastVersementsDate).toHaveBeenCalledTimes(1);
        });

        it("should call _countTotalVersement()", () => {
            VersementsAdapter.toVersement(VERSEMENTS);
            expect(mockCountTotalVersement).toHaveBeenCalledTimes(1);
        });

        it("should call valueOrHyphen() twice", () => {
            VersementsAdapter.toVersement(VERSEMENTS);
            expect(dataHelper.valueOrHyphen).toHaveBeenCalledTimes(2);
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

    describe("_getLastVersementsDate", () => {
        it("return most recent date", () => {
            const expected = MOST_RECENT_DATE;
            const actual = VersementsAdapter._getLastVersementsDate(VERSEMENTS);
            expect(actual).toEqual(expected);
        });
    });
});
