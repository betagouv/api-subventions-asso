import ProviderRequestFactory from "../../../../modules/provider-request/provider-request.service";
jest.mock("../../../../modules/provider-request/provider-request.service", () => ({
    __esModule: true,
    default: jest.fn(() => {
        return new (class ProviderRequestService {
            get = jest.fn();
        })();
    }),
}));
import { SireneStockUniteLegaleApiAdapter } from "./sirene-stock-unite-legale.adapter";

describe("SireneStockUniteLegalePort", () => {
    let port;

    beforeEach(() => {
        port = new SireneStockUniteLegaleApiAdapter();
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
                "https://www.data.gouv.fr/api/1/datasets/r/825f4199-cadd-486c-ac46-a65a8ea1a047",
                { responseType: "stream" },
            );
        });
    });
});
