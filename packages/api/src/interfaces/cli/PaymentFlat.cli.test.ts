import paymentFlatChorusService from "../../modules/paymentFlat/paymentFlat.chorus.service";
import paymentFlatService from "../../modules/paymentFlat/paymentFlat.service";
import PaymentFlatCli from "./PaymentFlat.cli";
jest.mock("../../modules/paymentFlat/paymentFlat.chorus.service");
jest.mock("../../modules/paymentFlat/paymentFlat.service");

describe("PaymentFlat Cli", () => {
    let paymentFlatCli: PaymentFlatCli;

    beforeEach(() => {
        paymentFlatCli = new PaymentFlatCli();
    });

    describe("resyncExercice", () => {
        it("should call updatePaymentsFlatCollection with the given exerciceBudgetaire", async () => {
            const exerciceBudgetaire = 2022;
            await paymentFlatCli.resyncExercice(exerciceBudgetaire);
            expect(paymentFlatChorusService.updatePaymentsFlatCollection).toHaveBeenCalledWith(exerciceBudgetaire);
        });
    });

    describe("init", () => {
        jest.spyOn(global, "setInterval").mockImplementation(jest.fn());
        const mockIsCollectionInitialized = jest.spyOn(paymentFlatService, "isCollectionInitialized");
        beforeAll(() => {
            mockIsCollectionInitialized.mockResolvedValue(false);
        });

        it("calls isCollectionInitialized", async () => {
            await paymentFlatCli.initChorus();
            expect(paymentFlatService.isCollectionInitialized).toHaveBeenCalledTimes(1);
        });

        it("throws an error if collection has already been initialized", () => {
            mockIsCollectionInitialized.mockResolvedValueOnce(true);
            expect(async () => await paymentFlatCli.initChorus()).rejects.toThrowError(
                "DB already initialized, used resyncExercice instead",
            );
        });

        it("calls service init method", async () => {
            await paymentFlatCli.initChorus();
            expect(paymentFlatChorusService.init).toHaveBeenCalledTimes(1);
        });
    });
});
