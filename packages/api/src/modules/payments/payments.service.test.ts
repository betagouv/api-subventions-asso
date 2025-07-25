const getPaymentsMock = jest.fn();
jest.mock("../providers", () => ({
    paymentProviders: [
        {
            getPayments: getPaymentsMock,
        },
    ],
}));

import Siren from "../../identifierObjects/Siren";
import AssociationIdentifier from "../../identifierObjects/AssociationIdentifier";
import { Payment } from "dto";
import paymentsService from "./payments.service";

describe("PaymentsService", () => {
    const PAYMENT_KEY = "J00034";
    describe("getPayments", () => {
        it("should call getPaymentsBySiren", async () => {
            const SIREN = new Siren("000000000");
            const expected = AssociationIdentifier.fromSiren(SIREN);

            await paymentsService.getPayments(expected);

            expect(getPaymentsMock).toHaveBeenCalledWith(expected);
        });
    });

    describe("hasPayments()", () => {
        it("should return false", () => {
            const expected = false;
            const actual = paymentsService.hasPayments({
                // @ts-expect-error: test
                versementKey: { value: undefined },
            });
            expect(actual).toEqual(expected);
        });

        it("should return true", () => {
            const expected = true;
            const actual = paymentsService.hasPayments({
                // @ts-expect-error: test
                versementKey: { value: PAYMENT_KEY },
            });
            expect(actual).toEqual(expected);
        });
    });

    describe("getPaymentExercise", () => {
        const PAYMENT = { dateOperation: { value: new Date("2023-02-02") } } as unknown as Payment;

        it("returns year from dateOperation", () => {
            const expected = PAYMENT.dateOperation.value.getFullYear();
            const actual = paymentsService.getPaymentExercise(PAYMENT);
            expect(actual).toBe(expected);
        });

        it("returns undefined if payment is undefined", () => {
            const expected = undefined;
            const actual = paymentsService.getPaymentExercise(undefined);
            expect(actual).toBe(expected);
        });
    });
});
