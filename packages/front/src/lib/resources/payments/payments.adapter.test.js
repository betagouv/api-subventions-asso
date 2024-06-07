import * as dataHelper from "$lib/helpers/dataHelper";
vi.mock("$lib/helpers/dataHelper");
import * as dateHelper from "$lib/helpers/dateHelper";
vi.mock("$lib/helpers/dateHelper");
import * as subventionPaymentHelper from "$lib/components/SubventionsPaymentsDashboard/helper";
vi.mock("$lib/components/SubventionsPaymentsDashboard/helper");

import PaymentsAdapter from "$lib/resources/payments/payments.adapter";

describe("Payments Adapter", () => {
    const MOST_RECENT_DATE = new Date();
    const PAYMENTS = [
        { amount: 30, dateOperation: new Date(MOST_RECENT_DATE.getDate() - 1) },
        { amount: 40, dateOperation: new Date(MOST_RECENT_DATE.getDate() - 3) },
        { amount: 30, dateOperation: MOST_RECENT_DATE },
    ];

    describe("toPayment()", () => {
        const mockFormatBop = vi.spyOn(PaymentsAdapter, "formatBop");
        const mockChooseBop = vi.spyOn(PaymentsAdapter, "_chooseBop");
        const mockGetTotalPayment = vi.spyOn(PaymentsAdapter, "_getTotalPayment");

        const mocks = [mockGetTotalPayment];

        beforeAll(() => mocks.forEach(mock => mock.mockImplementation(vi.fn())));
        afterEach(() => mocks.forEach(mock => mock.mockClear()));
        afterAll(() => mocks.forEach(mock => mock.mockRestore()));

        it("should return an object with properties", () => {
            const actual = Object.keys(PaymentsAdapter.toPayment(PAYMENTS));
            expect(actual).toEqual(["totalAmount", "centreFinancier", "lastPaymentDate", "bop"]);
        });

        it("should call getLastPaymentsDate()", () => {
            PaymentsAdapter.toPayment(PAYMENTS);
            expect(subventionPaymentHelper.getLastPaymentsDate).toHaveBeenCalledTimes(1);
        });

        it("should call _getTotalPayment()", () => {
            PaymentsAdapter.toPayment(PAYMENTS);
            expect(mockGetTotalPayment).toHaveBeenCalledTimes(1);
        });

        it("should call _chooseBop()", () => {
            PaymentsAdapter.toPayment(PAYMENTS);
            expect(mockChooseBop).toHaveBeenCalledTimes(1);
        });

        it("should call formatBop()", () => {
            PaymentsAdapter.toPayment(PAYMENTS);
            expect(mockFormatBop).toHaveBeenCalledTimes(1);
        });

        it("should call valueOrHyphen() 4 times", () => {
            PaymentsAdapter.toPayment(PAYMENTS);
            expect(dataHelper.valueOrHyphen).toHaveBeenCalledTimes(4);
        });

        it("should call withTwoYearDigit()", () => {
            PaymentsAdapter.toPayment(PAYMENTS);
            expect(dateHelper.withTwoDigitYear).toHaveBeenCalledTimes(1);
        });
    });

    describe("_countTotalPayment", () => {
        it("return 0 if payments array is empty", () => {
            const expected = 0;
            const actual = PaymentsAdapter._countTotalPayment([]);
            expect(actual).toEqual(expected);
        });

        it("return sum of payments", () => {
            const expected = 100;
            const actual = PaymentsAdapter._countTotalPayment(PAYMENTS);
            expect(actual).toEqual(expected);
        });
    });

    describe("fromatBop()", () => {
        it("should remove first character", () => {
            const BOP = "0163";
            const expected = "163";
            const actual = PaymentsAdapter.formatBop(BOP);
            expect(actual).toEqual(expected);
        });

        it("should return untouched bop", () => {
            const BOP = 1267;
            const expected = BOP;
            const actual = PaymentsAdapter.formatBop(BOP);
            expect(actual).toEqual(expected);
        });

        it("should return undefined", () => {
            const BOP = undefined;
            const expected = undefined;
            const actual = PaymentsAdapter.formatBop(BOP);
            expect(actual).toEqual(expected);
        });
    });

    describe("_chooseBop()", () => {
        /* eslint-disable vitest/expect-expect -- use helper */
        function testExpected(payments, expected) {
            const actual = PaymentsAdapter._chooseBop(payments);
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
        /* eslint-enable vitest/expect-expect */
    });

    describe("_getTotalPayment", () => {
        const spyCountTotalPayment = vi.spyOn(PaymentsAdapter, "_countTotalPayment");
        it("should call _countTotalPayment()", () => {
            PaymentsAdapter._getTotalPayment(PAYMENTS);
            expect(spyCountTotalPayment).toHaveBeenCalledTimes(1);
        });

        it.each`
            value
            ${[]}
            ${undefined}
        `("should return undefined", ({ value }) => {
            const expected = undefined;
            const actual = PaymentsAdapter._getTotalPayment(value);
            expect(actual).toEqual(expected);
        });
    });
});
