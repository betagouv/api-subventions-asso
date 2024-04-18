import { JEST_DATA_BRETAGNE_USERNAME, JEST_DATA_BRETAGNE_PASSWORD } from "../../../../jest.config.env";

import ProviderRequestFactory from "../../../modules/provider-request/providerRequest.service";
jest.mock("../../../modules/provider-request/providerRequest.service", () => ({
    __esModule: true,
    default: jest.fn(() => {
        return new (class ProviderRequestService {
            get = jest.fn();
            post = jest.fn();
        })();
    }),
}));
import { DataBretagnePort } from "./dataBretagne.port";

describe("Data Bretagne Port", () => {
    let port;

    beforeEach(() => {
        port = new DataBretagnePort();
    });
    describe("constructor", () => {
        it("should call ProviderRequestFactory", async () => {
            expect(ProviderRequestFactory).toHaveBeenCalledWith("data-bretagne");
        });
        it("should set http as ProviderRequestService", async () => {
            expect(port.http).toBeDefined();
        });
    });

    describe("login", () => {
        it("should make a POST request", async () => {
            await port.login();
            expect(port.http.post).toHaveBeenCalledWith("https://api.databretagne.fr/budget/api/v1/auth/login", {
                email: JEST_DATA_BRETAGNE_USERNAME,
                password: JEST_DATA_BRETAGNE_PASSWORD,
            });
        });
    });

    describe("getProgrammes", () => {
        it("should return throw if no bearer token", () => {
            expect(() => port.getProgrammes()).rejects.toThrowError("You must be connected");
        });

        it("should make a GET request ", async () => {
            port.token = "TOKEN";
            await port.getProgrammes();
            expect(port.http.get).toHaveBeenCalledWith(
                "https://api.databretagne.fr/budget/api/v1/programme?limit=400",
                { headers: { Authorization: "TOKEN" } },
            );
        });
    });
});
