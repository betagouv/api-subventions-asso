import sireneStockUniteLegaleFileService from "../../modules/providers/sirene/stockUniteLegale/sireneStockUniteLegale.file.service";
import SireneStockUniteLegaleCli from "./SireneStockUniteLegale.cli";

describe("SireneStockUniteLegaleCli", () => {
    let sireneCli: SireneStockUniteLegaleCli;

    describe("getAndParse", () => {
        let mockGetAndParse: jest.SpyInstance;

        beforeAll(() => {
            sireneCli = new SireneStockUniteLegaleCli();
            mockGetAndParse = jest
                .spyOn(sireneStockUniteLegaleFileService, "getAndParse")
                .mockResolvedValue(Promise.resolve());
        });

        afterAll(() => {
            mockGetAndParse.mockRestore();
        });

        it("should call service's getAndParse", async () => {
            await sireneCli.getAndParse();
            expect(sireneStockUniteLegaleFileService.getAndParse).toHaveBeenCalled();
        });
    });
});
