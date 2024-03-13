jest.mock("./repositories/demarchesSimplifieesMapper.repository");
jest.mock("./repositories/demarchesSimplifieesData.repository");
jest.mock("./adapters/DemarchesSimplifieesEntityAdapter");

import { DemandeSubvention } from "dto";
import DemarchesSimplifieesDtoAdapter from "./adapters/DemarchesSimplifieesDtoAdapter";
import { DemarchesSimplifieesEntityAdapter } from "./adapters/DemarchesSimplifieesEntityAdapter";
import demarchesSimplifieesService from "./demarchesSimplifiees.service";
import DemarchesSimplifieesMapperEntity from "./entities/DemarchesSimplifieesMapperEntity";
import GetDossiersByDemarcheId from "./queries/GetDossiersByDemarcheId";
import demarchesSimplifieesDataRepository from "./repositories/demarchesSimplifieesData.repository";
import demarchesSimplifieesMapperRepository from "./repositories/demarchesSimplifieesMapper.repository";
import providerRequestService from "../../provider-request/providerRequest.service";
import { RequestResponse } from "../../provider-request/@types/RequestResponse";

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

    describe("entitiesToSubventions", () => {
        let getSchemasByIdsMock: jest.SpyInstance;

        beforeAll(() => {
            // @ts-ignore getSchemasByIds is private method
            getSchemasByIdsMock = jest.spyOn(demarchesSimplifieesService, "getSchemasByIds").mockResolvedValue({});
            // @ts-expect-error mock
            DemarchesSimplifieesEntityAdapter.toSubvention.mockImplementation(
                data => data as unknown as DemandeSubvention,
            );
        });

        afterAll(() => {
            getSchemasByIdsMock.mockRestore();
            // @ts-expect-error mock
            demarchesSimplifieesMapperRepository.upsert.mockRestore();
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
                    demarcheId: DEMARCHE_ID,
                },
                {
                    id: DEMARCHE_ID,
                },
            ];

            getSchemasByIdsMock.mockResolvedValue({
                [DEMARCHE_ID]: expected[1],
            });

            // @ts-expect-error entitiesToSubventions is private method
            await demarchesSimplifieesService.entitiesToSubventions([expected[0]]);

            expect(DemarchesSimplifieesEntityAdapter.toSubvention).toBeCalledWith(...expected);
        });

        it("should return one sub", async () => {
            const DEMARCHE_ID = 12345;
            const expected = {
                demarcheId: DEMARCHE_ID,
            };

            getSchemasByIdsMock.mockResolvedValue({
                [DEMARCHE_ID]: {
                    id: DEMARCHE_ID,
                },
            });

            // @ts-expect-error entitiesToSubventions is private method
            const actual = await demarchesSimplifieesService.entitiesToSubventions([expected]);

            expect(actual).toEqual([expected]);
        });

        it("should not return sub because no schema match", async () => {
            const DEMARCHE_ID = 12345;
            const expected = {
                demarcheId: 12346,
            };

            getSchemasByIdsMock.mockResolvedValue({
                [DEMARCHE_ID]: {
                    id: DEMARCHE_ID,
                },
            });

            // @ts-expect-error entitiesToSubventions is private method
            const actual = await demarchesSimplifieesService.entitiesToSubventions([expected]);

            expect(actual).toHaveLength(0);
        });

        it("should not return drafts", async () => {
            const DEMARCHE_ID = 12345;
            const expected = { demarcheId: DEMARCHE_ID };

            getSchemasByIdsMock.mockResolvedValue({
                [DEMARCHE_ID]: { id: DEMARCHE_ID },
            });

            jest.mocked(DemarchesSimplifieesEntityAdapter.toSubvention).mockReturnValueOnce({
                // @ts-expect-error -- mock
                status: { value: "en_construction" },
            });

            // @ts-expect-error entitiesToSubventions is private method
            const actual = await demarchesSimplifieesService.entitiesToSubventions([expected]);

            expect(actual).toHaveLength(0);
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
        const GRANTS = [
            { demarcheId: 1, value: "a" },
            { demarcheId: 2, value: "b" },
        ];
        let getSchemasMock;
        beforeAll(
            () =>
                (getSchemasMock = jest
                    // @ts-expect-error mock private
                    .spyOn(demarchesSimplifieesService, "getSchemasByIds")
                    // @ts-expect-error mock
                    .mockResolvedValue({ 1: "s1" })),
        );
        afterAll(() => getSchemasMock.mockRestore());

        it("gets schemas", async () => {
            // @ts-expect-error mock
            await demarchesSimplifieesService.toRawGrants(GRANTS);
            expect(getSchemasMock).toHaveBeenCalled();
        });

        it("filter out grants if no schema to adapt it and add metadata", async () => {
            // @ts-expect-error mock
            const actual = await demarchesSimplifieesService.toRawGrants(GRANTS);
            expect(actual).toMatchInlineSnapshot(`
                Array [
                  Object {
                    "data": Object {
                      "grant": Object {
                        "demarcheId": 1,
                        "value": "a",
                      },
                      "schema": "s1",
                    },
                    "provider": "demarchesSimplifiees",
                    "type": "application",
                  },
                ]
            `);
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
