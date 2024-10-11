import PaymentsFlatCli from "./PaymentsFlat.cli";
import paymentsFlatService from "../../modules/data-viz/paymentFlat/paymentFlat.service";
jest.mock("../../modules/data-viz/paymentFlat/paymentFlat.service");

describe("PaymentsFlatCli", () => {
    let paymentsFlatCli: PaymentsFlatCli;

    beforeEach(() => {
        paymentsFlatCli = new PaymentsFlatCli();
    });

    describe("resyncExercice", () => {
        it("should call updatePaymentsFlatCollection with the given exerciceBudgetaire", async () => {
            const exerciceBudgetaire = 2022;
            await paymentsFlatCli.resyncExercice(exerciceBudgetaire);
            expect(paymentsFlatService.updatePaymentsFlatCollection).toHaveBeenCalledWith(exerciceBudgetaire);
        });
    });

    describe("resyncAll", () => {
        it("should call updatePaymentsFlatCollection", async () => {
            await paymentsFlatCli.resyncAll();
            expect(paymentsFlatService.updatePaymentsFlatCollection).toHaveBeenCalledTimes(1);
        });
    });
});
