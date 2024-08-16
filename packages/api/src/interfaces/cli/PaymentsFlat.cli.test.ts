import PaymentsFlatCli from "./PaymentsFlat.cli";
import paymentsFlatService from "../../modules/data-viz/paymentFlat/paymentFlat.service";
jest.mock("../../modules/data-viz/paymentFlat/paymentFlat.service");
import { ObjectId } from "mongodb";
describe("PaymentsFlatCli", () => {
    let paymentsFlatCli: PaymentsFlatCli;
    let mockLastChorusObjectId: ObjectId;

    beforeEach(() => {
        paymentsFlatCli = new PaymentsFlatCli();
        mockLastChorusObjectId = new ObjectId("000000000000000000000000");
        (paymentsFlatService.updatePaymentsFlatCollection as jest.Mock).mockResolvedValue(new ObjectId());
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should call updatePaymentsFlatCollection with default Object Value", async () => {
        await paymentsFlatCli.resync();
        expect(paymentsFlatService.updatePaymentsFlatCollection).toHaveBeenCalledWith(mockLastChorusObjectId);
    });

    it("should call updatePaymentsFlatCollection with new Object Value", async () => {
        const newLastChorusObjectId = new ObjectId("5e0b3e4b0000000000000000");
        await paymentsFlatCli.resync(newLastChorusObjectId);
        expect(paymentsFlatService.updatePaymentsFlatCollection).toHaveBeenCalledWith(newLastChorusObjectId);
    });

    it("should return newLastChorusObjectId", async () => {
        const newLastChorusObjectId = await paymentsFlatCli.resync();
        expect(newLastChorusObjectId).toEqual(expect.any(ObjectId));
    });
});
