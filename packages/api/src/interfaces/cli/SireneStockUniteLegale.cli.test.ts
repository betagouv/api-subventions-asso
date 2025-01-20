import sireneStockUniteLegaleService from "../../modules/providers/sirene/stockUniteLegale/sireneStockUniteLegale.service";
import SireneStockUniteLegaleCli from "./SireneStockUniteLegale.cli";
describe("SireneStockUniteLegaleCli", () => {
    let sireneCli: SireneStockUniteLegaleCli;
    describe("parse", () => {
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

        it("should call getAndParse", async () => {
            await sireneCli.parse();
            expect(sireneStockUniteLegaleService.getAndParse).toHaveBeenCalled();
        });
    });
});
