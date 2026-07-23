import ProviderRequestFactory from "../../../../modules/provider-request/provider-request.service";
import { DataGouvAdapter } from "./data-gouv.adapter";
jest.mock("../../../../modules/provider-request/provider-request.service", () => ({
    __esModule: true,
    default: jest.fn(() => {
        return new (class ProviderRequestService {
            get = jest.fn();
        })();
    }),
}));

describe("DataGouvAdapter", () => {
    let port;

    beforeEach(() => {
        port = new DataGouvAdapter("825f4199-cadd-486c-ac46-a65a8ea1a047");
    });

    describe("constructor", () => {
        it("should call ProviderRequestFactory", async () => {
            expect(ProviderRequestFactory).toHaveBeenCalledWith("data-gouv");
        });
        it("should set http as ProviderRequestService", async () => {
            expect(port.http).toBeDefined();
        });
    });

    describe("getFile", () => {
        it("should make a GET request for the file", async () => {
            await port.getFileStream();
            expect(port.http.get).toHaveBeenCalledWith(
                "https://www.data.gouv.fr/api/1/datasets/r/825f4199-cadd-486c-ac46-a65a8ea1a047",
                { responseType: "stream" },
            );
        });
    });
});
