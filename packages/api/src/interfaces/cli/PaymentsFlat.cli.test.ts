import PaymentsFlatCli from "./PaymentsFlat.cli";
import paymentsFlatService from "../../modules/data-viz/paymentFlat/paymentFlat.service";
jest.mock("../../modules/data-viz/paymentFlat/paymentFlat.service");

describe("PaymentsFlatCli", () => {
    let paymentsFlatCli: PaymentsFlatCli;

    beforeEach(() => {
        paymentsFlatCli = new PaymentsFlatCli();
    });

    it("should call updatePaymentsFlatCollection", async () => {
        await paymentsFlatCli.resync();
        expect(paymentsFlatService.updatePaymentsFlatCollection).toHaveBeenCalledTimes(1);
    });
});
