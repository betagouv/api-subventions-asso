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
        const mockBuildProgrammeText = vi.spyOn(PaymentsAdapter, "buildProgrammeText");
        const mockGetTotalPayment = vi.spyOn(PaymentsAdapter, "_getTotalPayment");

        const mocks = [mockGetTotalPayment, mockBuildProgrammeText];

        beforeAll(() => mocks.forEach(mock => mock.mockImplementation(vi.fn())));
        afterEach(() => mocks.forEach(mock => mock.mockClear()));
        afterAll(() => mocks.forEach(mock => mock.mockRestore()));

        it("should return an object with properties", () => {
            const actual = Object.keys(PaymentsAdapter.toPayment(PAYMENTS));
            expect(actual).toEqual(["totalAmount", "centreFinancier", "lastPaymentDate", "programme"]);
        });

        it("should call getLastPaymentsDate()", () => {
            PaymentsAdapter.toPayment(PAYMENTS);
            expect(subventionPaymentHelper.getLastPaymentsDate).toHaveBeenCalledTimes(1);
        });

        it("should call _getTotalPayment()", () => {
            PaymentsAdapter.toPayment(PAYMENTS);
            expect(mockGetTotalPayment).toHaveBeenCalledTimes(1);
        });

        it("should call mockBuildProgrammeText()", () => {
            PaymentsAdapter.toPayment(PAYMENTS);
            expect(mockBuildProgrammeText).toHaveBeenCalledTimes(1);
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
    describe("buildProgrammeText()", () => {
        it("should return an empty string if versements array is empty", () => {
            const versements = [];
            const expected = "";
            const actual = PaymentsAdapter.buildProgrammeText(versements);
            expect(actual).toEqual(expected);
        });

        it("should return 'multi-programmes' if there are multiple programmes", () => {
            const versements = [
                { programme: 123, libelleProgramme: "Libelle 1" },
                { programme: 321, libelleProgramme: "Libelle 2" },
            ];
            const expected = "multi-programmes";
            const actual = PaymentsAdapter.buildProgrammeText(versements);
            expect(actual).toEqual(expected);
        });

        it("should return the program text if there is only one programme", () => {
            const versements = [
                { programme: 123, libelleProgramme: "Libelle 1" },
                { programme: 123, libelleProgramme: "Libelle 1" },
            ];
            const expected = "123 - Libelle 1";
            const actual = PaymentsAdapter.buildProgrammeText(versements);
            expect(actual).toEqual(expected);
        });
    });
});
