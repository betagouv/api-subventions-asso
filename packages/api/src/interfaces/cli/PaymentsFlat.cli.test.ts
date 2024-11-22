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

    describe("init", () => {
        const mockIsCollectionInitialized = jest.spyOn(paymentsFlatService, "isCollectionInitialized");
        beforeAll(() => {
            mockIsCollectionInitialized.mockResolvedValue(false);
        });

        it("calls isCollectionInitialized", async () => {
            await paymentsFlatCli.init();
            expect(paymentsFlatService.isCollectionInitialized).toHaveBeenCalledTimes(1);
        });

        it("throws an error if collection has already been initialized", () => {
            mockIsCollectionInitialized.mockResolvedValueOnce(true);
            expect(async () => await paymentsFlatCli.init()).rejects.toThrowError(
                "DB already initialized, used resyncExercice instead",
            );
        });

        it("calls service init method", async () => {
            await paymentsFlatCli.init();
            expect(paymentsFlatService.init).toHaveBeenCalledTimes(1);
        });
    });
});
