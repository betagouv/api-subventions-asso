const getPaymentsMock = jest.fn();
jest.mock("../providers", () => ({
    paymentProviders: [
        {
            getPayments: getPaymentsMock,
        },
    ],
}));

import paymentService from "./payments.service";
import Siren from "../../valueObjects/Siren";
import AssociationIdentifier from "../../valueObjects/AssociationIdentifier";
import paymentsService from "./payments.service";
import { Payment } from "dto";

describe("PaymentsService", () => {
    const PAYMENT_KEY = "J00034";
    describe("getPayments", () => {
        it("should call getPaymentsBySiren", async () => {
            const SIREN = new Siren("000000000");
            const expected = AssociationIdentifier.fromSiren(SIREN);

            await paymentService.getPayments(expected);

            expect(getPaymentsMock).toHaveBeenCalledWith(expected);
        });
    });

    describe("hasPayments()", () => {
        it("should return false", () => {
            const expected = false;
            const actual = paymentService.hasPayments({
                // @ts-expect-error: test
                versementKey: { value: undefined },
            });
            expect(actual).toEqual(expected);
        });

        it("should return true", () => {
            const expected = true;
            const actual = paymentService.hasPayments({
                // @ts-expect-error: test
                versementKey: { value: PAYMENT_KEY },
            });
            expect(actual).toEqual(expected);
        });
    });

    describe("getPaymentExercise", () => {
        const FONJEP_PAYMENT = {
            periodeDebut: { value: new Date("2021-02-02") },
            dateOperation: { value: new Date("2023-02-02") },
        } as unknown as Payment;
        const PAYMENT = { dateOperation: { value: new Date("2023-02-02") } } as unknown as Payment;

        it("returns year from periodeDebut if any", () => {
            const expected = 2021;
            const actual = paymentsService.getPaymentExercise(FONJEP_PAYMENT);
            expect(actual).toBe(expected);
        });

        it("returns year from dateOperation", () => {
            const expected = 2023;
            const actual = paymentsService.getPaymentExercise(PAYMENT);
            expect(actual).toBe(expected);
        });
    });
});
