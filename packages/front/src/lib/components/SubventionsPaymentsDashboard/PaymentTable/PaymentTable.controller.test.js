import PaymentTableController from "./PaymentTable.controller";
import PaymentsAdapter from "$lib/resources/payments/payments.adapter";

vi.mock("$lib/resources/payments/payments.adapter", () => ({
    default: {
        toPayment: vi.fn(() => ({
            totalAmount: undefined,
            centreFinancier: undefined,
            lastPaymentDate: undefined,
        })),
    },
}));

describe("PaymentTableController", () => {
    describe("extractHeaders()", () => {
        it("return an array of header", () => {
            const actual = PaymentTableController.extractHeaders();
            expect(actual).toMatchSnapshot();
        });
    });

    describe("extractRows()", () => {
        it("should call _extractTableDataFromElement for each element in array", () => {
            PaymentTableController.extractRows([{ payments: [{}] }, { payments: [{}] }]);
            expect(PaymentsAdapter.toPayment).toHaveBeenCalledTimes(2);
        });

        it("should not call _extractTableDataFromElement if element has no payments", () => {
            PaymentTableController.extractRows([{}, { payments: [{}] }]);
            expect(PaymentsAdapter.toPayment).toHaveBeenCalledTimes(1);
        });

        it("should return an array", () => {
            const expected = [null, null];
            const actual = PaymentTableController.extractRows([{}, {}]);
            expect(actual).toEqual(expected);
        });
    });
});
