import sireneStockUniteLegaleFileService from "../../../modules/providers/sirene/sirene-stock-unite-legale.service";
import sireneStockEstablishmentService from "../../../modules/providers/sirene/sirene-stock-establishment.service";
import { SireneStockCron } from "./sirene-stock.cron";

jest.mock("../../../modules/providers/sirene/sirene-stock-unite-legale.service", () => ({ getAndParse: jest.fn() }));
jest.mock("../../../modules/providers/sirene/sirene-stock-establishment.service", () => ({ getAndParse: jest.fn() }));

describe("SireneStockCron", () => {
    it("imports establishments", async () => {
        await new SireneStockCron().import();
        expect(sireneStockEstablishmentService.getAndParse).toHaveBeenCalled();
    });

    it("imports unite legale", async () => {
        await new SireneStockCron().import();
        expect(sireneStockUniteLegaleFileService.getAndParse).toHaveBeenCalled();
    });
});
