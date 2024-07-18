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
import {
    DataBretagneDomaineFonctionnelAdapter,
    DataBretagneMinistryAdapter,
    DataBretagneProgrammeAdapter,
    DataBretagneRefProgrammationAdapter,
} from "./DataBretagneAdapter";
import {
    DataBretagneDomaineFonctionnelDto,
    DataBretagneMinistryDto,
    DataBretagneRefProgrammationDto,
    DataBretagneProgrammeDto,
} from "./DataBretagneDto";
import StateBudgetProgramEntity from "../../../entities/StateBudgetProgramEntity";
import DomaineFonctionnelEntity from "../../../entities/DomaineFonctionnelEntity";
import RefProgrammationEntity from "../../../entities/RefProgrammationEntity";

const dtoData = { code: "code", sigle_ministere: "sigle_ministere", label: "nom_ministere" };
const getResult = { data: { items: [dtoData] } };
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
        let mockGet: jest.SpyInstance;
        beforeEach(() => {
            mockGet = jest.spyOn(port.http, "get").mockResolvedValue(getResult);
        });

        afterAll(() => {
            mockGet.mockRestore();
        });

        it("should make a GET request for collection value", async () => {
            const collection = "programme";
            port.token = "TOKEN";
            await port.getCollection(collection);
            expect(port.http.get).toHaveBeenCalledWith(
                "https://api.databretagne.fr/budget/api/v1/programme?limit=4000",
                { headers: { Authorization: "TOKEN" } },
            );
        });

        it("should return the items", async () => {
            const collection = "programme";
            const result = await port.getCollection(collection);
            expect(result).toEqual(getResult.data.items);
        });
    });

    describe.each([
        [
            async () => port.getStateBudgetPrograms(),
            "programme",
            [dtoData] as unknown as DataBretagneProgrammeDto[],
            new StateBudgetProgramEntity("mission", "label", "code_ministere", 132),
            DataBretagneProgrammeAdapter,
        ],
        [
            async () => port.getMinistry(),
            "ministere",
            [dtoData] as unknown as DataBretagneMinistryDto[],
            new MinistryEntity("sigle_ministere", "code", "nom_ministere"),
            DataBretagneMinistryAdapter,
        ],
        [
            async () => port.getDomaineFonctionnel(),
            "domaine-fonct",
            [dtoData] as unknown as DataBretagneDomaineFonctionnelDto[],
            new DomaineFonctionnelEntity("action", "code_action", 122),
            DataBretagneDomaineFonctionnelAdapter,
        ],
        [
            async () => port.getRefProgrammation(),
            "ref-programmation",
            [dtoData] as unknown as DataBretagneRefProgrammationDto[],
            new RefProgrammationEntity("label", "code", 121),
            DataBretagneRefProgrammationAdapter,
        ],
    ])("with %s", (methodToTest, collection, mockResolvedValueDto, MockReturnValueEntity, Adapter) => {
        let mockGetCollection: jest.SpyInstance;
        let mockToEntity: jest.SpyInstance;

        beforeEach(() => {
            mockGetCollection = jest.spyOn(port, "getCollection").mockResolvedValue(mockResolvedValueDto);

            mockToEntity = jest.spyOn(Adapter, "toEntity").mockReturnValue(MockReturnValueEntity);
        });

        afterEach(() => {
            mockGetCollection.mockRestore();
            mockToEntity.mockRestore();
        });

        it("should call getCollection with collection", async () => {
            const result = await methodToTest();
            expect(mockGetCollection).toHaveBeenCalledWith(collection);
        });

        it("should return a list of entity", async () => {
            const result = await methodToTest();
            expect(result).toEqual([MockReturnValueEntity]);
        });

        it("should call mockToEntity", async () => {
            const result = await methodToTest();
            expect(mockToEntity).toHaveBeenCalledTimes(mockResolvedValueDto.length);
        });
    });
});
