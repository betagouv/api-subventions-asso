import ProviderRequestFactory, {
    ProviderRequestService,
} from "../../../modules/provider-request/providerRequest.service";
jest.mock("../../../modules/provider-request/providerRequest.service", () => ({
    __esModule: true,
    default: jest.fn(() => {
        return new (class ProviderRequestService {})();
    }),
}));
import dataBretagnePort, { DataBretagnePort } from "./dataBretagne.port";

describe("Data Bretagne Port", () => {
    describe("constructor", () => {
        let port;

        beforeAll(() => {});

        beforeEach(() => {
            port = new DataBretagnePort();
        });

        it("should call ProviderRequestFactory", async () => {
            expect(ProviderRequestFactory).toHaveBeenCalledWith("data-bretagne");
        });
        it("should set http as ProviderRequestService", async () => {
            expect(port.http).toBeDefined();
        });
    });
});
