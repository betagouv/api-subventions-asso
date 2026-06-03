import ProviderRequestFactory from "../../../../modules/provider-request/provider-request.service";
import { SireneStockUniteLegaleAdapter } from "./sirene-stock-unite-legale.adapter";
jest.mock("../../../../modules/provider-request/provider-request.service", () => ({
    __esModule: true,
    default: jest.fn(() => {
        return new (class ProviderRequestService {
            get = jest.fn();
        })();
    }),
}));

describe("SireneStockUniteLegalePort", () => {
    let port;

    beforeEach(() => {
        port = new SireneStockUniteLegaleAdapter();
    });
    describe("constructor", () => {
        it("should call ProviderRequestFactory", async () => {
            expect(ProviderRequestFactory).toHaveBeenCalledWith("sireneStockUniteLegale");
        });
        it("should set http as ProviderRequestService", async () => {
            expect(port.http).toBeDefined();
        });
    });

    describe("getZip", () => {
        it("should make a GET request for the zip file", async () => {
            await port.getZip();
            expect(port.http.get).toHaveBeenCalledWith(
                "https://object.files.data.gouv.fr/data-pipeline-open/siren/stock/StockUniteLegale_utf8.zip",
                { responseType: "stream" },
            );
        });
    });
});
