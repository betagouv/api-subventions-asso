import { DemandeSubvention } from "@api-subventions-asso/dto";
import axios from "axios";
import DemarchesSimplifieesDtoAdapter from "./adapters/DemarchesSimplifieesDtoAdapter";
import { DemarchesSimplifieesEntityAdapter } from "./adapters/DemarchesSimplifieesEntityAdapter";
import demarchesSimplifieesService from "./demarchesSimplifiees.service";
import DemarchesSimplifieesMapperEntity from "./entities/DemarchesSimplifieesMapperEntity";
import GetDossiersByDemarcheId from "./queries/GetDossiersByDemarcheId";
import demarchesSimplifieesDataRepository from "./repositories/demarchesSimplifieesData.repository";
import demarchesSimplifieesMapperRepository from "./repositories/demarchesSimplifieesMapper.repository";

describe("DemarchesSimplifieesService", () => {
    let mapperRepoFindAllMock: jest.SpyInstance;

    beforeAll(() => {
        mapperRepoFindAllMock = jest.spyOn(demarchesSimplifieesMapperRepository, "findAll");
    });

    describe("getSchemasByIds", () => {
        beforeAll(() => {
            mapperRepoFindAllMock.mockResolvedValue([
                {
                    demarcheId: 1,
                    schema: []
                }
            ]);
        });

        it("should call mapperRepo", async () => {
            // @ts-ignore getSchemasByIds is private method
            await demarchesSimplifieesService.getSchemasByIds();

            expect(mapperRepoFindAllMock).toHaveBeenCalledTimes(1);
        });

        it("should return good data", async () => {
            // @ts-ignore getSchemasByIds is private method
            const actual = await demarchesSimplifieesService.getSchemasByIds();

            expect(actual).toEqual(
                expect.objectContaining({
                    1: {
                        demarcheId: 1,
                        schema: expect.any(Array)
                    }
                })
            );
        });
    });

    describe("entitiesToSubventions", () => {
        let getSchemasByIdsMock: jest.SpyInstance;
        let entityAdatperToSubMock: jest.SpyInstance;

        beforeAll(() => {
            // @ts-ignore getSchemasByIds is private method
            getSchemasByIdsMock = jest.spyOn(demarchesSimplifieesService, "getSchemasByIds").mockResolvedValue({});
            entityAdatperToSubMock = jest
                .spyOn(DemarchesSimplifieesEntityAdapter, "toSubvention")
                .mockImplementation(data => data as unknown as DemandeSubvention);
        });

        afterAll(() => {
            getSchemasByIdsMock.mockRestore();
            entityAdatperToSubMock.mockRestore();
        });

        it("should call getSchemasByIds", async () => {
            // @ts-expect-error entitiesToSubventions is private method
            await demarchesSimplifieesService.entitiesToSubventions([]);

            expect(getSchemasByIdsMock).toBeCalledTimes(1);
        });

        it("should call toSubvention with good schema", async () => {
            const DEMARCHE_ID = 12345;
            const expected = [
                {
                    demarcheId: DEMARCHE_ID
                },
                {
                    id: DEMARCHE_ID
                }
            ];

            getSchemasByIdsMock.mockResolvedValue({
                [DEMARCHE_ID]: expected[1]
            });

            // @ts-expect-error entitiesToSubventions is private method
            await demarchesSimplifieesService.entitiesToSubventions([expected[0]]);

            expect(entityAdatperToSubMock).toBeCalledWith(...expected);
        });

        it("should return one sub", async () => {
            const DEMARCHE_ID = 12345;
            const expected = {
                demarcheId: DEMARCHE_ID
            };

            getSchemasByIdsMock.mockResolvedValue({
                [DEMARCHE_ID]: {
                    id: DEMARCHE_ID
                }
            });

            // @ts-expect-error entitiesToSubventions is private method
            const actual = await demarchesSimplifieesService.entitiesToSubventions([expected]);

            expect(actual).toEqual([expected]);
        });

        it("should not return sub because no schema match", async () => {
            const DEMARCHE_ID = 12345;
            const expected = {
                demarcheId: 12346
            };

            getSchemasByIdsMock.mockResolvedValue({
                [DEMARCHE_ID]: {
                    id: DEMARCHE_ID
                }
            });

            // @ts-expect-error entitiesToSubventions is private method
            const actual = await demarchesSimplifieesService.entitiesToSubventions([expected]);

            expect(actual).toHaveLength(0);
        });
    });

    describe("getDemandeSubventionBySiren", () => {
        const SIREN = "000000000";

        let findBySirenMock: jest.SpyInstance;
        let entitiesToSubMock: jest.SpyInstance;

        beforeAll(() => {
            findBySirenMock = jest.spyOn(demarchesSimplifieesDataRepository, "findBySiren").mockResolvedValue([]);
            entitiesToSubMock = jest
                // @ts-expect-error entitiesToSubventions is private method
                .spyOn(demarchesSimplifieesService, "entitiesToSubventions")
                // @ts-expect-error disable ts form return type of entitiesToSubventions
                .mockImplementation(data => data);
        });

        afterAll(() => {
            findBySirenMock.mockRestore();
            entitiesToSubMock.mockRestore();
        });

        it("should call findBySiren", async () => {
            await demarchesSimplifieesService.getDemandeSubventionBySiren(SIREN);
            expect(findBySirenMock).toHaveBeenCalledWith(SIREN);
            expect(findBySirenMock).toBeCalledTimes(1);
        });

        it("should call entitiesToSubventions", async () => {
            await demarchesSimplifieesService.getDemandeSubventionBySiren(SIREN);
            expect(entitiesToSubMock).toHaveBeenCalledWith([]);
            expect(entitiesToSubMock).toBeCalledTimes(1);
        });

        it("should return entities", async () => {
            const expected = [{ test: true }];
            findBySirenMock.mockResolvedValueOnce(expected);
            const actual = await demarchesSimplifieesService.getDemandeSubventionBySiren(SIREN);
            expect(actual).toEqual(expected);
        });
    });

    describe("getDemandeSubventionBySiret", () => {
        const SIRET = "00000000000000";

        let findBySiret: jest.SpyInstance;
        let entitiesToSubMock: jest.SpyInstance;

        beforeAll(() => {
            findBySiret = jest.spyOn(demarchesSimplifieesDataRepository, "findBySiret").mockResolvedValue([]);
            entitiesToSubMock = jest
                // @ts-expect-error entitiesToSubventions is private method
                .spyOn(demarchesSimplifieesService, "entitiesToSubventions")
                // @ts-expect-error disable ts form return type of entitiesToSubventions
                .mockImplementation(data => data);
        });

        afterAll(() => {
            findBySiret.mockRestore();
            entitiesToSubMock.mockRestore();
        });

        it("should call findBySiret", async () => {
            await demarchesSimplifieesService.getDemandeSubventionBySiret(SIRET);
            expect(findBySiret).toHaveBeenCalledWith(SIRET);
            expect(findBySiret).toBeCalledTimes(1);
        });

        it("should call entitiesToSubventions", async () => {
            await demarchesSimplifieesService.getDemandeSubventionBySiret(SIRET);
            expect(entitiesToSubMock).toHaveBeenCalledWith([]);
            expect(entitiesToSubMock).toBeCalledTimes(1);
        });

        it("should return entities", async () => {
            const expected = [{ test: true }];
            findBySiret.mockResolvedValueOnce(expected);
            const actual = await demarchesSimplifieesService.getDemandeSubventionBySiret(SIRET);
            expect(actual).toEqual(expected);
        });
    });

    describe("updateAllForms", () => {
        let getAcceptedDemarcheIdsMock: jest.SpyInstance;
        let updateDataByFormIdMock: jest.SpyInstance;

        beforeAll(() => {
            getAcceptedDemarcheIdsMock = jest
                .spyOn(demarchesSimplifieesMapperRepository, "getAcceptedDemarcheIds")
                .mockResolvedValue([]);
            updateDataByFormIdMock = jest.spyOn(demarchesSimplifieesService, "updateDataByFormId").mockResolvedValue();
        });

        afterAll(() => {
            getAcceptedDemarcheIdsMock.mockRestore();
            updateDataByFormIdMock.mockRestore();
        });

        it("should get accepted forms ids", async () => {
            await demarchesSimplifieesService.updateAllForms();
            expect(getAcceptedDemarcheIdsMock).toHaveBeenCalledTimes(1);
        });

        it("should throw error (ds is not configured)", async () => {
            getAcceptedDemarcheIdsMock.mockResolvedValueOnce(null);
            expect(() => demarchesSimplifieesService.updateAllForms()).rejects.toThrowError(
                "DS is not configured on this env, please add mapper"
            );
        });

        it("should call updateDataByFormId with all formIds", async () => {
            const expected = [12345, 12346];

            getAcceptedDemarcheIdsMock.mockResolvedValueOnce(expected);

            await demarchesSimplifieesService.updateAllForms();

            expect(updateDataByFormIdMock).toBeCalledWith(expected[0]);
            expect(updateDataByFormIdMock).toBeCalledWith(expected[1]);
        });
    });

    describe("updateDataByFormId", () => {
        const FORM_ID = 12345;

        let sendQueryMock: jest.SpyInstance;
        let toEntitiesMock: jest.SpyInstance;
        let upsertMock: jest.SpyInstance;

        beforeAll(() => {
            sendQueryMock = jest.spyOn(demarchesSimplifieesService, "sendQuery").mockResolvedValue(null);
            // @ts-expect-error disable ts form return type of toEntities
            toEntitiesMock = jest.spyOn(DemarchesSimplifieesDtoAdapter, "toEntities").mockImplementation(data => [data]);
            upsertMock = jest.spyOn(demarchesSimplifieesDataRepository, "upsert").mockResolvedValue();
        });

        afterAll(() => {
            sendQueryMock.mockRestore();
            toEntitiesMock.mockRestore();
            upsertMock.mockRestore();
        });

        it("should call sendQuery", async () => {
            await demarchesSimplifieesService.updateDataByFormId(FORM_ID);

            expect(sendQueryMock).toHaveBeenCalledWith(GetDossiersByDemarcheId, { demarcheNumber: FORM_ID });
        });

        it("should call toEntities", async () => {
            const expected = { data: true };

            sendQueryMock.mockResolvedValueOnce(expected);

            await demarchesSimplifieesService.updateDataByFormId(FORM_ID);

            expect(toEntitiesMock).toBeCalledWith(expected, FORM_ID);
        });

        it("should upsert data", async () => {
            const expected = { data: true };

            sendQueryMock.mockResolvedValueOnce(expected);

            await demarchesSimplifieesService.updateDataByFormId(FORM_ID);

            expect(upsertMock).toBeCalledWith(expected);
        });
    });

    describe("sendQuery", () => {
        let postMock: jest.SpyInstance;
        let buildSearchHeaderMock: jest.SpyInstance;

        beforeAll(() => {
            postMock = jest.spyOn(axios, "post").mockResolvedValue({ data: 1 });
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
                    vars: ""
                }
            };

            await demarchesSimplifieesService.sendQuery(expected.query, expected.variables);

            expect(postMock).toHaveBeenCalledWith(expect.any(String), expected, expect.any(Object));
        });

        it("should call buildSearchHeader", async () => {
            await demarchesSimplifieesService.sendQuery("", {});

            expect(buildSearchHeaderMock).toBeCalledTimes(1);
        });

        it("should return null when axios throws error", async () => {
            postMock.mockRejectedValueOnce(new Error("axios not happy"));

            const actual = await demarchesSimplifieesService.sendQuery("", {});

            expect(actual).toBe(null);
        });

        it("should return data", async () => {
            const expected = { data: true };
            postMock.mockResolvedValueOnce({ data: expected });

            const actual = await demarchesSimplifieesService.sendQuery("", {});

            expect(actual).toEqual(expected);
        });
    });

    describe("addSchemaMapper", () => {
        let upsertMock: jest.SpyInstance;

        beforeAll(() => {
            upsertMock = jest.spyOn(demarchesSimplifieesMapperRepository, "upsert").mockResolvedValue();
        });

        afterAll(() => {
            upsertMock.mockRestore();
        });

        it("should call upsert", async () => {
            const expected = { data: true } as unknown as DemarchesSimplifieesMapperEntity;

            await demarchesSimplifieesService.addSchemaMapper(expected);

            expect(upsertMock).toBeCalledWith(expected);
        });
    });
});
