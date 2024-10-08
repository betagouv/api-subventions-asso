jest.mock("./repositories/demarchesSimplifieesMapper.repository");
jest.mock("./repositories/demarchesSimplifieesData.repository");
jest.mock("./adapters/DemarchesSimplifieesEntityAdapter");

import DemarchesSimplifieesDtoAdapter from "./adapters/DemarchesSimplifieesDtoAdapter";
import { DemarchesSimplifieesEntityAdapter } from "./adapters/DemarchesSimplifieesEntityAdapter";
import demarchesSimplifieesService from "./demarchesSimplifiees.service";
import DemarchesSimplifieesMapperEntity from "./entities/DemarchesSimplifieesMapperEntity";
import GetDossiersByDemarcheId from "./queries/GetDossiersByDemarcheId";
import demarchesSimplifieesDataRepository from "./repositories/demarchesSimplifieesData.repository";
import demarchesSimplifieesMapperRepository from "./repositories/demarchesSimplifieesMapper.repository";
import { RequestResponse } from "../../provider-request/@types/RequestResponse";
import { DATA_ENTITIES, SCHEMAS } from "./__fixtures__/DemarchesSimplifieesFixture";
import {
    DATA_ENTITIES as INTEG_DATA_ENTITIES,
    SCHEMAS as INTEG_SCHEMA,
} from "../../../../tests/dataProviders/db/__fixtures__/demarchesSimplifiees.fixtures";
import { DemarchesSimplifieesRawData, DemarchesSimplifieesRawGrant } from "./@types/DemarchesSimplifieesRawGrant";
import lodash from "lodash";
jest.mock("lodash");

describe("DemarchesSimplifieesService", () => {
    describe("getSchemasByIds", () => {
        beforeAll(() => {
            // @ts-expect-error mock
            demarchesSimplifieesMapperRepository.findAll.mockResolvedValue([
                {
                    demarcheId: 1,
                    schema: [],
                },
            ]);
        });

        it("should call mapperRepo", async () => {
            // @ts-ignore getSchemasByIds is private method
            await demarchesSimplifieesService.getSchemasByIds();

            expect(demarchesSimplifieesMapperRepository.findAll).toHaveBeenCalledTimes(1);
        });

        it("should return good data", async () => {
            // @ts-ignore getSchemasByIds is private method
            const actual = await demarchesSimplifieesService.getSchemasByIds();

            expect(actual).toEqual(
                expect.objectContaining({
                    1: {
                        demarcheId: 1,
                        schema: expect.any(Array),
                    },
                }),
            );
        });
    });

    describe("isDraft", () => {
        it("should return false", () => {
            const entity = { ...DATA_ENTITIES[0] };
            entity.demande.state = "accepte";
            const expected = false;
            // @ts-expect-error: test private method
            const actual = demarchesSimplifieesService.isDraft(DATA_ENTITIES[0]);
            expect(actual).toEqual(expected);
        });

        it("should return true", () => {
            const entity = { ...DATA_ENTITIES[0] };
            entity.demande.state = "en_construction";
            const expected = true;
            // @ts-expect-error: test private method
            const actual = demarchesSimplifieesService.isDraft(DATA_ENTITIES[0]);
            expect(actual).toEqual(expected);
        });
    });

    describe("filterAndAdaptEntities", () => {
        let mockGetSchemasByIds: jest.SpyInstance;
        let mockIsDraft: jest.SpyInstance;
        beforeAll(() => {
            // @ts-expect-error: mock private method
            mockGetSchemasByIds = jest.spyOn(demarchesSimplifieesService, "getSchemasByIds");
            mockGetSchemasByIds.mockResolvedValue(SCHEMAS);
            // @ts-expect-error: mock private method
            mockIsDraft = jest.spyOn(demarchesSimplifieesService, "isDraft");
            mockIsDraft.mockReturnValue(false);
        });

        afterAll(() => {
            mockGetSchemasByIds.mockRestore();
            mockIsDraft.mockRestore();
        });

        it("should get schemaByIds", async () => {
            // @ts-expect-error: test private method
            await demarchesSimplifieesService.filterAndAdaptEntities([], jest.fn());
            expect(mockGetSchemasByIds).toHaveBeenCalledTimes(1);
        });

        it("should call isDraft()", async () => {
            // @ts-expect-error: test private method
            await demarchesSimplifieesService.filterAndAdaptEntities(DATA_ENTITIES, jest.fn());
            expect(mockIsDraft).toHaveBeenCalledTimes(2);
        });

        it("should exclude drafts", async () => {
            mockIsDraft.mockReturnValueOnce(true);
            const expected = [DATA_ENTITIES[1]];
            // @ts-expect-error: test private method
            const actual = await demarchesSimplifieesService.filterAndAdaptEntities(
                DATA_ENTITIES,
                jest.fn(entity => entity),
            );
            expect(actual).toEqual(expected);
        });

        it("should call adapter", async () => {
            const spyAdapter = jest.fn(entity => entity);
            // @ts-expect-error: test private method
            await demarchesSimplifieesService.filterAndAdaptEntities(DATA_ENTITIES, spyAdapter);
            expect(spyAdapter).toHaveBeenCalledTimes(DATA_ENTITIES.length);
        });
    });

    describe("entitiesToSubventions", () => {
        let mockFilterAndAdaptEntities: jest.SpyInstance;
        beforeAll(() => {
            // @ts-expect-error: mock private method
            mockFilterAndAdaptEntities = jest.spyOn(demarchesSimplifieesService, "filterAndAdaptEntities");
            mockFilterAndAdaptEntities.mockImplementation(jest.fn());
        });

        afterAll(() => {
            mockFilterAndAdaptEntities.mockRestore();
        });

        it("should call filterAndAdaptEntities()", async () => {
            // @ts-expect-error: test private method
            await demarchesSimplifieesService.entitiesToSubventions([]);
            expect(mockFilterAndAdaptEntities).toHaveBeenCalledWith([], DemarchesSimplifieesEntityAdapter.toSubvention);
        });
    });

    describe("getJoinKey", () => {
        const RAW_DATA: DemarchesSimplifieesRawData = {
            entity: INTEG_DATA_ENTITIES[0],
            schema: INTEG_SCHEMA[0],
        };
        it("should call lodash.get", () => {
            jest.mocked(lodash.get).mockReturnValueOnce("EJ");
            const expected = [INTEG_DATA_ENTITIES[0], "demande.annotations.Q2hhbXAtMjY3NDMxMA==.value"];
            demarchesSimplifieesService.getJoinKey(RAW_DATA);
            expect(lodash.get).toHaveBeenCalledWith(...expected);
        });

        it("should return joinKey", () => {
            jest.mocked(lodash.get).mockReturnValueOnce("EJ");
            const expected = "EJ";
            const actual = demarchesSimplifieesService.getJoinKey(RAW_DATA);
            expect(actual).toEqual(expected);
        });

        it("should return undefined if no joinKey field", () => {
            const expected = undefined;
            const actual = demarchesSimplifieesService.getJoinKey({
                ...RAW_DATA,
                schema: { ...INTEG_SCHEMA[0], schema: [] },
            });
            expect(actual).toEqual(expected);
        });
    });

    describe("getDemandeSubventionBySiren", () => {
        const SIREN = "000000000";
        let entitiesToSubMock: jest.SpyInstance;

        beforeAll(() => {
            // @ts-expect-error mock
            demarchesSimplifieesDataRepository.findBySiren.mockResolvedValue([]);
            entitiesToSubMock = jest
                // @ts-expect-error entitiesToSubventions is private method
                .spyOn(demarchesSimplifieesService, "entitiesToSubventions")
                // @ts-expect-error disable ts form return type of entitiesToSubventions
                .mockImplementation(data => data);
        });

        afterAll(() => {
            // @ts-expect-error mock
            demarchesSimplifieesDataRepository.findBySiren.mockRestore();
            entitiesToSubMock.mockRestore();
        });

        it("should call findBySiren", async () => {
            await demarchesSimplifieesService.getDemandeSubventionBySiren(SIREN);
            expect(demarchesSimplifieesDataRepository.findBySiren).toHaveBeenCalledWith(SIREN);
            expect(demarchesSimplifieesDataRepository.findBySiren).toBeCalledTimes(1);
        });

        it("should call entitiesToSubventions", async () => {
            await demarchesSimplifieesService.getDemandeSubventionBySiren(SIREN);
            expect(entitiesToSubMock).toHaveBeenCalledWith([]);
            expect(entitiesToSubMock).toBeCalledTimes(1);
        });

        it("should return entities", async () => {
            const expected = [{ test: true }];
            // @ts-expect-error mock
            demarchesSimplifieesDataRepository.findBySiren.mockResolvedValueOnce(expected);
            const actual = await demarchesSimplifieesService.getDemandeSubventionBySiren(SIREN);
            expect(actual).toEqual(expected);
        });
    });

    describe("getDemandeSubventionBySiret", () => {
        const SIRET = "00000000000000";
        let entitiesToSubMock: jest.SpyInstance;

        beforeAll(() => {
            // @ts-expect-error mock
            demarchesSimplifieesDataRepository.findBySiret.mockResolvedValue([]);
            entitiesToSubMock = jest
                // @ts-expect-error entitiesToSubventions is private method
                .spyOn(demarchesSimplifieesService, "entitiesToSubventions")
                // @ts-expect-error disable ts form return type of entitiesToSubventions
                .mockImplementation(data => data);
        });

        afterAll(() => {
            // @ts-expect-error mock
            demarchesSimplifieesDataRepository.findBySiret.mockRestore();
            entitiesToSubMock.mockRestore();
        });

        it("should call findBySiret", async () => {
            await demarchesSimplifieesService.getDemandeSubventionBySiret(SIRET);
            expect(demarchesSimplifieesDataRepository.findBySiret).toHaveBeenCalledWith(SIRET);
            expect(demarchesSimplifieesDataRepository.findBySiret).toBeCalledTimes(1);
        });

        it("should call entitiesToSubventions", async () => {
            await demarchesSimplifieesService.getDemandeSubventionBySiret(SIRET);
            expect(entitiesToSubMock).toHaveBeenCalledWith([]);
            expect(entitiesToSubMock).toBeCalledTimes(1);
        });

        it("should return entities", async () => {
            const expected = [{ test: true }];
            // @ts-expect-error mock
            demarchesSimplifieesDataRepository.findBySiret.mockResolvedValueOnce(expected);
            const actual = await demarchesSimplifieesService.getDemandeSubventionBySiret(SIRET);
            expect(actual).toEqual(expected);
        });
    });

    describe("updateAllForms", () => {
        let updateDataByFormIdMock: jest.SpyInstance;

        beforeAll(() => {
            // @ts-expect-error mock
            demarchesSimplifieesMapperRepository.getAcceptedDemarcheIds.mockResolvedValue([]);
            updateDataByFormIdMock = jest.spyOn(demarchesSimplifieesService, "updateDataByFormId").mockResolvedValue();
        });

        afterAll(() => {
            // @ts-expect-error mock
            demarchesSimplifieesMapperRepository.getAcceptedDemarcheIds.mockRestore();
            updateDataByFormIdMock.mockRestore();
        });

        it("should get accepted forms ids", async () => {
            await demarchesSimplifieesService.updateAllForms();
            expect(demarchesSimplifieesMapperRepository.getAcceptedDemarcheIds).toHaveBeenCalledTimes(1);
        });

        it("should throw error (ds is not configured)", async () => {
            // @ts-expect-error mock
            demarchesSimplifieesMapperRepository.getAcceptedDemarcheIds.mockResolvedValueOnce(null);
            await expect(() => demarchesSimplifieesService.updateAllForms()).rejects.toThrowError(
                "DS is not configured on this env, please add mapper",
            );
        });

        it("should call updateDataByFormId with all formIds", async () => {
            const expected = [12345, 12346];

            // @ts-expect-error mock
            demarchesSimplifieesMapperRepository.getAcceptedDemarcheIds.mockResolvedValueOnce(expected);

            await demarchesSimplifieesService.updateAllForms();

            expect(updateDataByFormIdMock).toBeCalledWith(expected[0]);
            expect(updateDataByFormIdMock).toBeCalledWith(expected[1]);
        });
    });

    describe("updateDataByFormId", () => {
        const FORM_ID = 12345;

        let sendQueryMock: jest.SpyInstance;
        let toEntitiesMock: jest.SpyInstance;

        beforeAll(() => {
            sendQueryMock = jest
                .spyOn(demarchesSimplifieesService, "sendQuery")
                // @ts-expect-error mock
                .mockResolvedValue({ data: { demarche: {} } });
            toEntitiesMock = jest
                .spyOn(DemarchesSimplifieesDtoAdapter, "toEntities")
                // @ts-expect-error disable ts form return type of toEntities
                .mockImplementation(data => [data]);
            // @ts-expect-error mock
            demarchesSimplifieesDataRepository.upsert.mockResolvedValue();
        });

        afterAll(() => {
            sendQueryMock.mockRestore();
            toEntitiesMock.mockRestore();
            // @ts-expect-error mock
            demarchesSimplifieesMapperRepository.upsert.mockRestore();
        });

        it("should call sendQuery", async () => {
            await demarchesSimplifieesService.updateDataByFormId(FORM_ID);

            expect(sendQueryMock).toHaveBeenCalledWith(GetDossiersByDemarcheId, { demarcheNumber: FORM_ID });
        });

        it("should call toEntities", async () => {
            const expected = { data: { demarche: true } };

            sendQueryMock.mockResolvedValueOnce(expected);

            await demarchesSimplifieesService.updateDataByFormId(FORM_ID);

            expect(toEntitiesMock).toBeCalledWith(expected, FORM_ID);
        });

        it("should upsert data", async () => {
            const expected = { data: { demarche: true } };

            sendQueryMock.mockResolvedValueOnce(expected);

            await demarchesSimplifieesService.updateDataByFormId(FORM_ID);

            expect(demarchesSimplifieesDataRepository.upsert).toBeCalledWith(expected);
        });
    });

    describe("sendQuery", () => {
        let postMock: jest.SpyInstance;
        let buildSearchHeaderMock: jest.SpyInstance;

        beforeAll(() => {
            postMock = jest
                // @ts-expect-error http is private method
                .spyOn(demarchesSimplifieesService.http, "post")
                .mockResolvedValue({ data: 1 } as RequestResponse<unknown>);
            // @ts-expect-error buildSearchHeader is private method
            buildSearchHeaderMock = jest.spyOn(demarchesSimplifieesService, "buildSearchHeader");
        });

        afterAll(() => {
            postMock.mockRestore();
            buildSearchHeaderMock.mockRestore();
        });

        it("should send request with good query and vars", async () => {
            const expected = {
                query: "I'm a query",
                variables: {
                    we: "",
                    are: "",
                    vars: "",
                },
            };

            await demarchesSimplifieesService.sendQuery(expected.query, expected.variables);

            expect(postMock).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining(expected),
                expect.any(Object),
            );
        });

        it("should call buildSearchHeader", async () => {
            await demarchesSimplifieesService.sendQuery("", {});

            expect(buildSearchHeaderMock).toBeCalledTimes(1);
        });

        it("should throw when axios throws error", async () => {
            const ERROR = new Error("axios not happy");
            postMock.mockRejectedValueOnce(ERROR);

            const test = () => demarchesSimplifieesService.sendQuery("", {});

            await expect(test).rejects.toThrow(ERROR);
        });

        it("should return data", async () => {
            const expected = { data: true };
            postMock.mockResolvedValueOnce({ data: expected });

            const actual = await demarchesSimplifieesService.sendQuery("", {});

            expect(actual).toEqual(expected);
        });
    });

    describe("addSchemaMapper", () => {
        beforeAll(() => {
            // @ts-expect-error mock
            demarchesSimplifieesMapperRepository.upsert.mockResolvedValue();
        });

        afterAll(() => {
            // @ts-expect-error mock
            demarchesSimplifieesMapperRepository.upsert.mockRestore();
        });

        it("should call upsert", async () => {
            const expected = { data: true } as unknown as DemarchesSimplifieesMapperEntity;

            await demarchesSimplifieesService.addSchemaMapper(expected);

            expect(demarchesSimplifieesMapperRepository.upsert).toBeCalledWith(expected);
        });
    });

    describe("toRawGrants", () => {
        let mockFilterAndAdaptEntities: jest.SpyInstance;

        beforeAll(() => {
            // @ts-expect-error: mock private method
            mockFilterAndAdaptEntities = jest.spyOn(demarchesSimplifieesService, "filterAndAdaptEntities");
            mockFilterAndAdaptEntities.mockResolvedValue(DATA_ENTITIES);
        });
        it("call filterAndAdaptEntities()", async () => {
            // @ts-expect-error: test private method
            await demarchesSimplifieesService.toRawGrants(DATA_ENTITIES);
            expect(mockFilterAndAdaptEntities).toHaveBeenCalledWith(
                DATA_ENTITIES,
                DemarchesSimplifieesEntityAdapter.toRawGrant,
            );
        });
    });

    describe.each`
        identifier | spyToCall
        ${"Siren"} | ${demarchesSimplifieesDataRepository.findBySiren}
        ${"Siret"} | ${demarchesSimplifieesDataRepository.findBySiret}
    `("getRawGrantsBy$identifier", ({ identifier, spyToCall }) => {
        const IDENTIFIER = "ID";
        const DATA = ["G1", "G2"];
        const RAW_DATA = ["g1", "g2"];
        let toRawGrantsMock;

        beforeAll(() => {
            // @ts-expect-error mock private method
            toRawGrantsMock = jest.spyOn(demarchesSimplifieesService, "toRawGrants").mockResolvedValue(RAW_DATA);
            spyToCall.mockReturnValue(DATA);
        });
        afterAll(() => {
            toRawGrantsMock.mockRestore();
            spyToCall.mockReset();
        });

        it("gets data from repo", async () => {
            await demarchesSimplifieesService[`getRawGrantsBy${identifier}`](IDENTIFIER);
            expect(spyToCall).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("call private helper", async () => {
            await demarchesSimplifieesService[`getRawGrantsBy${identifier}`](IDENTIFIER);
            expect(toRawGrantsMock).toHaveBeenCalledWith(DATA);
        });

        it("returns data from helper", async () => {
            const expected = RAW_DATA;
            const actual = await demarchesSimplifieesService[`getRawGrantsBy${identifier}`](IDENTIFIER);
            expect(actual).toEqual(expected);
        });
    });

    describe("rawToApplication", () => {
        // @ts-expect-error: parameter type
        const RAW_APPLICATION: RawApplication = { data: { foo: "bar" } };
        // @ts-expect-error: parameter type
        const APPLICATION: DemandeSubvention = { foo: "bar" };

        it("should call DemarchesSimplifieesEntityAdapter.rawToApplication", () => {
            demarchesSimplifieesService.rawToApplication(RAW_APPLICATION);
            expect(DemarchesSimplifieesEntityAdapter.rawToApplication).toHaveBeenCalledWith(RAW_APPLICATION);
        });

        it("should return DemandeSubvention", () => {
            jest.mocked(DemarchesSimplifieesEntityAdapter.rawToApplication).mockReturnValueOnce(APPLICATION);
            const expected = APPLICATION;
            const actual = demarchesSimplifieesService.rawToApplication(RAW_APPLICATION);
            expect(actual).toEqual(expected);
        });
    });

    describe("rawToCommon", () => {
        const RAW = { data: { grant: "GRANT", schema: "SCHEMA" } };
        const COMMON = "adapted";

        // @ts-expect-error mock
        beforeAll(() => DemarchesSimplifieesEntityAdapter.toCommon.mockReturnValue(COMMON));
        // @ts-expect-error mock
        afterAll(() => DemarchesSimplifieesEntityAdapter.toCommon.mockReset());

        it("calls adapter with proper arguments", () => {
            // @ts-expect-error mock
            demarchesSimplifieesService.rawToCommon(RAW);
            expect(DemarchesSimplifieesEntityAdapter.toCommon).toHaveBeenCalledWith("GRANT", "SCHEMA");
        });

        it("returns result from adapter", () => {
            const expected = COMMON;
            // @ts-expect-error mock
            const actual = demarchesSimplifieesService.rawToCommon(RAW);
            expect(actual).toEqual(expected);
        });
    });
});
