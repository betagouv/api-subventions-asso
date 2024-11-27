import PaymentFlatCli from "./PaymentFlat.cli";
import paymentsFlatService from "../../modules/paymentFlat/paymentFlat.service";
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
            expect(paymentsFlatService.updatePaymentsFlatCollection).toHaveBeenCalledWith(exerciceBudgetaire);
        });
    });

    describe("init", () => {
        const mockIsCollectionInitialized = jest.spyOn(paymentsFlatService, "isCollectionInitialized");
        beforeAll(() => {
            mockIsCollectionInitialized.mockResolvedValue(false);
        });

        it("calls isCollectionInitialized", async () => {
            await paymentFlatCli.init();
            expect(paymentsFlatService.isCollectionInitialized).toHaveBeenCalledTimes(1);
        });

        it("throws an error if collection has already been initialized", () => {
            mockIsCollectionInitialized.mockResolvedValueOnce(true);
            expect(async () => await paymentFlatCli.init()).rejects.toThrowError(
                "DB already initialized, used resyncExercice instead",
            );
        });

        it("calls service init method", async () => {
            await paymentFlatCli.init();
            expect(paymentsFlatService.init).toHaveBeenCalledTimes(1);
        });
    });
});
