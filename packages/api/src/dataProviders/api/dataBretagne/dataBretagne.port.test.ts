import { min } from "lodash";
import { JEST_DATA_BRETAGNE_USERNAME, JEST_DATA_BRETAGNE_PASSWORD } from "../../../../jest.config.env";
import MinistryEntity from "../../../entities/MinistryEntity";

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
import DataBretagneMinistryAdapter from "./DataBretagneMinistryAdapter";
import { mock } from "node:test";
import { DataBretagneMinistryDto } from "./DataBretagneDto";
import StateBudgetProgramEntity from "../../../entities/StateBudgetProgramEntity";
import DomaineFonctionnelEntity from "../../../entities/DomaineFonctionnelEntity";
import RefProgrammationEntity from "../../../entities/RefProgrammationEntity";

const dtoData = { code: "code", sigle_ministere: "sigle_ministere", label: "nom_ministere" };

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

    describe("getCollection", () => {
        it("should make a GET request for collection value", async () => {
            const collection = "programme";
            port.token = "TOKEN";
            await port.getCollection(collection);
            expect(port.http.get).toHaveBeenCalledWith(
                "https://api.databretagne.fr/budget/api/v1/programme?limit=4000",
                { headers: { Authorization: "TOKEN" } },
            );
        });
    });

    describe("getMinistry", () => {
        let mockGetCollection: jest.SpyInstance;
        let mockToEntity: jest.SpyInstance;

        beforeAll(() => {
            mockGetCollection = jest.spyOn(port, "getCollection").mockImplementation(() => {
                console.log("ciao");
                console.log(dtoData);
                [dtoData] as DataBretagneMinistryDto[];
            });

            mockToEntity = jest
                .spyOn(DataBretagneMinistryAdapter, "toEntity")
                .mockReturnValue(new MinistryEntity("sigle_ministere", "code", "nom_ministere"));
        });

        afterAll(() => {
            mockGetCollection.mockRestore();
            mockToEntity.mockRestore();
        });

        it("should call getCollection with ministere", async () => {
            //
            //   console.log(port.getCollection);
            //   console.log(mockGetCollection);
            const result = await port.getMinistry();
            expect(mockGetCollection).toHaveBeenCalledWith("ministere");
        });
    });
    /*
    describe.each( [
        ["programme", [dtoData], new StateBudgetProgramEntity("mission", "label", "code_ministere", 132)],
        ["ministere", [dtoData], new MinistryEntity("sigle_ministere", "code", "nom_ministere")],
        ["domaine-fonct", [dtoData], new DomaineFonctionnelEntity("action", "code_action", 122)],
        ["ref-programmation", [dtoData], new RefProgrammationEntity("label", "code",  121)],
    ])("with %s", (collection, mockResolvedValueDto, MockReturnValueEntity) => {
    */

    /*
        it("should return a list of ministry dto", async () => {
            const result = await port.getMinistry();
            expect(result).toEqual([{code: "code",
                                     sigle_ministere: "sigle_ministere",
                                     label : "nom_ministere"}]);
        });
        */
    /*
        it("should call DataBretagneProgrammeAdapter.toEntity", async () => {
            await port.getMinistry();
            expect(DataBretagneMinistryAdapter.toEntity).toHaveBeenCalledTimes(1);
        });
        
    })
    */

    /*
    describe("getMinistry", () => {
        it("should make a GET request", async () => {
            port.token = "TOKEN";
            await port.getMinistry();
            expect(port.http.get).toHaveBeenCalledWith(
                "https://api.databretagne.fr/budget/api/v1/ministere?limit=400",
                { headers: { Authorization: "TOKEN" } },
            );
        });
    });

    describe("getDomaineFonctionnel", () => {
        it("should make a GET request", async () => {
            port.token = "TOKEN";
            await port.getDomaineFonctionnel();
            expect(port.http.get).toHaveBeenCalledWith(
                "https://api.databretagne.fr/budget/api/v1/domaine-fonct?limit=4000",
                { headers: { Authorization: "TOKEN" } },
            );
        });
    });

    describe("getRefProgrammation", () => {
        it("should make a GET request", async () => {
            port.token = "TOKEN";
            await port.getRefProgrammation();
            expect(port.http.get).toHaveBeenCalledWith(
                "https://api.databretagne.fr/budget/api/v1/ref-programmation?limit=4000",
                { headers: { Authorization: "TOKEN" } },
            );
        });
    });
    */
});
