import sireneStockUniteLegaleFileService from "../../../modules/providers/sirene/sirene-stock-unite-legale.service";
import sireneStockEstablishmentService from "../../../modules/providers/sirene/sirene-stock-establishment.service";
import { SireneStockCron } from "./sirene-stock.cron";

jest.mock("../../../modules/providers/sirene/sirene-stock-unite-legale.service", () => ({ getAndParse: jest.fn() }));
jest.mock("../../../modules/providers/sirene/sirene-stock-establishment.service", () => ({ getAndParse: jest.fn() }));

describe("SireneStockCron", () => {
    it("imports establishments after unite legale", async () => {
        await new SireneStockCron().import();
        expect(jest.mocked(sireneStockEstablishmentService.getAndParse).mock.invocationCallOrder[0]).toBeGreaterThan(
            jest.mocked(sireneStockUniteLegaleFileService.getAndParse).mock.invocationCallOrder[0],
        );
    });
});
