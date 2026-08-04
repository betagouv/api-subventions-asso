import sireneStockUniteLegaleService from "../../../modules/providers/sirene/sirene-stock-unite-legale.service";
import SireneStockUniteLegaleCli from "./sirene-stock-unite-legale.cli";

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

        it("should call service's import", async () => {
            await sireneCli.import();
            expect(sireneStockUniteLegaleService.getAndParse).toHaveBeenCalled();
        });
    });
});
