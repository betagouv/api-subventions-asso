import ProviderRequestFactory from "../../../../modules/provider-request/provider-request.service";
import { SireneStockEtablissementAdapter } from "./sirene-stock-etablissement.adapter";

jest.mock("../../../../modules/provider-request/provider-request.service", () => ({
    __esModule: true,
    default: jest.fn(() => {
        return new (class ProviderRequestService {
            get = jest.fn();
        })();
    }),
}));

describe("SireneStockEtablissementAdapter", () => {
    let port;

    beforeEach(() => {
        port = new SireneStockEtablissementAdapter();
    });

    describe("constructor", () => {
        it("calls ProviderRequestFactory", () => {
            expect(ProviderRequestFactory).toHaveBeenCalledWith("sireneStockEtablissement");
        });
    });

    describe("getParquet", () => {
        it("gets latest StockEtablissement parquet", async () => {
            await port.getParquet();
            expect(port.http.get).toHaveBeenCalledWith(
                "https://www.data.gouv.fr/api/1/datasets/r/a29c1297-1f92-4e2a-8f6b-8c902ce96c5f",
                { responseType: "stream" },
            );
        });
    });
});
