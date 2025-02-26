import sireneStockUniteLegaleService from "../../modules/providers/sirene/stockUniteLegale/sireneStockUniteLegale.service";
import SireneStockUniteLegaleCli from "./SireneStockUniteLegale.cli";

describe("SireneStockUniteLegaleCli", () => {
    let sireneCli: SireneStockUniteLegaleCli;

    describe("getAndParse", () => {
        let mockGetAndParse: jest.SpyInstance;

        beforeAll(() => {
            sireneCli = new SireneStockUniteLegaleCli();
            mockGetAndParse = jest
                .spyOn(sireneStockUniteLegaleService, "getAndParse")
                .mockResolvedValue(Promise.resolve());
        });

        afterAll(() => {
            mockGetAndParse.mockRestore();
        });

        it("should call service's getAndParse", async () => {
            await sireneCli.getAndParse();
            expect(sireneStockUniteLegaleService.getAndParse).toHaveBeenCalled();
        });
    });
});
