import {
    DemarchesSimplifieesSchemaSeed,
    DemarchesSimplifieesSingleSchemaSeed,
} from "./entities/DemarchesSimplifieesSchemaSeedEntity";

jest.mock("../../../dataProviders/db/providers/demarchesSimplifiees/demarchesSimplifieesSchema.port");
jest.mock("../../../dataProviders/db/providers/demarchesSimplifiees/demarchesSimplifieesData.port");
jest.mock("./adapters/DemarchesSimplifieesEntityAdapter");
jest.mock("./adapters/DemarchesSimplifieesDtoAdapter");
jest.mock("@inquirer/prompts");
jest.mock("../../configurations/configurations.service");

import configurationsService from "../../configurations/configurations.service";
import DemarchesSimplifieesDtoAdapter from "./adapters/DemarchesSimplifieesDtoAdapter";
import { DemarchesSimplifieesEntityAdapter } from "./adapters/DemarchesSimplifieesEntityAdapter";
import demarchesSimplifieesService from "./demarchesSimplifiees.service";
import DemarchesSimplifieesSchemaEntity, {
    DemarchesSimplifieesSingleSchema,
} from "./entities/DemarchesSimplifieesSchemaEntity";
import GetDossiersByDemarcheId from "./queries/GetDossiersByDemarcheId";
import demarchesSimplifieesDataPort from "../../../dataProviders/db/providers/demarchesSimplifiees/demarchesSimplifieesData.port";
import demarchesSimplifieesSchemaPort from "../../../dataProviders/db/providers/demarchesSimplifiees/demarchesSimplifieesSchema.port";
import { RequestResponse } from "../../provider-request/@types/RequestResponse";
import { DATA_ENTITIES, SCHEMAS } from "./__fixtures__/DemarchesSimplifieesFixture";
import {
    DATA_ENTITIES as INTEG_DATA_ENTITIES,
    SCHEMAS as INTEG_SCHEMA,
} from "../../../../tests/dataProviders/db/__fixtures__/demarchesSimplifiees.fixtures";
import { DemarchesSimplifieesRawData } from "./@types/DemarchesSimplifieesRawGrant";
import lodash from "lodash";
import Siren from "../../../valueObjects/Siren";
import AssociationIdentifier from "../../../valueObjects/AssociationIdentifier";
import EstablishmentIdentifier from "../../../valueObjects/EstablishmentIdentifier";
import { DemarchesSimplifieesSuccessDto } from "./dto/DemarchesSimplifieesDto";
import DemarchesSimplifieesDataEntity from "./entities/DemarchesSimplifieesDataEntity";
import { input } from "@inquirer/prompts";

jest.mock("lodash");

describe("DemarchesSimplifieesService", () => {
    describe("getSchemasByIds", () => {
        beforeAll(() => {
            // @ts-expect-error mock
            demarchesSimplifieesSchemaPort.findAll.mockResolvedValue([
                {
                    demarcheId: 1,
                    schema: [],
                },
            ]);
        });

        it("should call demarchesSimplifieesSchemaPort", async () => {
            // @ts-expect-error getSchemasByIds is private method
            await demarchesSimplifieesService.getSchemasByIds();

            expect(demarchesSimplifieesSchemaPort.findAll).toHaveBeenCalledTimes(1);
        });

        it("should return good data", async () => {
            // @ts-expect-error getSchemasByIds is private method
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

    describe("getDemandeSubvention", () => {
        const SIREN = new Siren("000000000");
        const ASSOCIATION_IDENTIFIER = AssociationIdentifier.fromSiren(SIREN);
        let entitiesToSubMock: jest.SpyInstance;

        beforeAll(() => {
            // @ts-expect-error mock
            demarchesSimplifieesDataPort.findBySiren.mockResolvedValue([]);
            entitiesToSubMock = jest
                // @ts-expect-error entitiesToSubventions is private method
                .spyOn(demarchesSimplifieesService, "entitiesToSubventions")
                // @ts-expect-error disable ts form return type of entitiesToSubventions
                .mockImplementation(data => data);
        });

        afterAll(() => {
            // @ts-expect-error mock
            demarchesSimplifieesDataPort.findBySiren.mockRestore();
            entitiesToSubMock.mockRestore();
        });

        it("should call findBySiren", async () => {
            await demarchesSimplifieesService.getDemandeSubvention(ASSOCIATION_IDENTIFIER);
            expect(demarchesSimplifieesDataPort.findBySiren).toHaveBeenCalledWith(SIREN);
            expect(demarchesSimplifieesDataPort.findBySiren).toBeCalledTimes(1);
        });

        it("should call entitiesToSubventions", async () => {
            await demarchesSimplifieesService.getDemandeSubvention(ASSOCIATION_IDENTIFIER);
            expect(entitiesToSubMock).toHaveBeenCalledWith([]);
            expect(entitiesToSubMock).toBeCalledTimes(1);
        });

        it("should return entities", async () => {
            const expected = [{ test: true }];
            // @ts-expect-error mock
            demarchesSimplifieesDataPort.findBySiren.mockResolvedValueOnce(expected);
            const actual = await demarchesSimplifieesService.getDemandeSubvention(ASSOCIATION_IDENTIFIER);
            expect(actual).toEqual(expected);
        });
    });

    describe("updateAllForms", () => {
        let updateDataByFormIdMock: jest.SpyInstance;

        beforeAll(() => {
            // @ts-expect-error mock
            demarchesSimplifieesSchemaPort.getAcceptedDemarcheIds.mockResolvedValue([]);
            updateDataByFormIdMock = jest.spyOn(demarchesSimplifieesService, "updateDataByFormId").mockResolvedValue();
        });

        afterAll(() => {
            // @ts-expect-error mock
            demarchesSimplifieesSchemaPort.getAcceptedDemarcheIds.mockRestore();
            updateDataByFormIdMock.mockRestore();
        });

        it("should get accepted forms ids", async () => {
            await demarchesSimplifieesService.updateAllForms();
            expect(demarchesSimplifieesSchemaPort.getAcceptedDemarcheIds).toHaveBeenCalledTimes(1);
        });

        it("should throw error (ds is not configured)", async () => {
            // @ts-expect-error mock
            demarchesSimplifieesSchemaPort.getAcceptedDemarcheIds.mockResolvedValueOnce(null);
            await expect(() => demarchesSimplifieesService.updateAllForms()).rejects.toThrowError(
                "DS is not configured on this env, please add schema",
            );
        });

        it("should call updateDataByFormId with all formIds", async () => {
            const expected = [12345, 12346];

            // @ts-expect-error mock
            demarchesSimplifieesSchemaPort.getAcceptedDemarcheIds.mockResolvedValueOnce(expected);

            await demarchesSimplifieesService.updateAllForms();

            expect(updateDataByFormIdMock).toBeCalledWith(expected[0]);
            expect(updateDataByFormIdMock).toBeCalledWith(expected[1]);
        });

        it("gets last update date", async () => {
            await demarchesSimplifieesService.updateAllForms();
            expect(configurationsService.getLastDsUpdate).toHaveBeenCalled();
        });

        it("sets last update date", async () => {
            const DATE = new Date("2025-01-16");
            const expected = DATE;
            jest.mocked(configurationsService.getLastDsUpdate).mockResolvedValueOnce(DATE);
            await demarchesSimplifieesService.updateAllForms();
            const actual = demarchesSimplifieesService.lastModified;
            expect(actual).toBe(expected);
        });

        it("saves new last update date", async () => {
            const today = new Date("2025-05-13");
            const expected = today;
            jest.useFakeTimers().setSystemTime(today);
            await demarchesSimplifieesService.updateAllForms();
            const actual = jest.mocked(configurationsService.setLastDsUpdate).mock.calls?.[0]?.[0];
            expect(actual).toEqual(expected);
        });
    });

    describe("updateDataByFormId", () => {
        const FORM_ID = 12345;

        let sendQueryMock: jest.SpyInstance;
        let toEntitiesMock: jest.SpyInstance;
        const lastModified = new Date();
        lastModified.setDate(lastModified.getDate() - 1);
        const DOSSIER = {
            siret: "12345678901234",
            demarcheId: 0,
            demande: {
                id: "",
                demandeur: {
                    siret: "09876543210987",
                    association: undefined,
                },
                demarche: {
                    title: "TitreDémarche",
                },
                groupeInstructeur: {
                    label: "instructeurs",
                },
                motivation: null,
                state: null,
                dateDepot: null,
                datePassageEnInstruction: null,
                dateDerniereModification: lastModified.toString(),
                dateTraitement: null,
                pdf: {
                    url: "",
                    filename: "",
                    contentType: "",
                },
                champs: {},
                annotations: {},
            },
            service: {
                nom: "nomService",
                organisme: "organismeService",
            },
        };
        const buildDemarche = (dossiers, isPublished = true) => ({
            data: {
                demarche: {
                    state: isPublished ? "publiee" : "anyOtherStatus",
                    dossiers: { nodes: [DOSSIER] },
                },
            },
        });
        const DEMARCHE = buildDemarche([DOSSIER]);

        beforeAll(() => {
            demarchesSimplifieesService.lastModified = new Date();
            demarchesSimplifieesService.lastModified.setDate(-1);
            sendQueryMock = jest
                .spyOn(demarchesSimplifieesService, "sendQuery")
                // @ts-expect-error mock
                .mockResolvedValue(DEMARCHE);
            toEntitiesMock = jest.spyOn(DemarchesSimplifieesDtoAdapter, "toEntities").mockReturnValue([DOSSIER]);
            // @ts-expect-error mock
            demarchesSimplifieesDataPort.upsert.mockResolvedValue();
        });

        afterAll(() => {
            sendQueryMock.mockRestore();
            toEntitiesMock.mockRestore();
            // @ts-expect-error mock
            demarchesSimplifieesSchemaPort.upsert.mockRestore();
        });

        it("should call sendQuery", async () => {
            await demarchesSimplifieesService.updateDataByFormId(FORM_ID);
            expect(sendQueryMock).toHaveBeenCalledWith(GetDossiersByDemarcheId, { demarcheNumber: FORM_ID });
        });

        it("should call toEntities", async () => {
            const expected = DEMARCHE;
            sendQueryMock.mockResolvedValueOnce(expected);
            await demarchesSimplifieesService.updateDataByFormId(FORM_ID);
            expect(toEntitiesMock).toBeCalledWith(expected, FORM_ID);
        });

        it("should upsert data", async () => {
            const expected = [DOSSIER];
            sendQueryMock.mockResolvedValueOnce(DEMARCHE);
            await demarchesSimplifieesService.updateDataByFormId(FORM_ID);
            expect(demarchesSimplifieesDataPort.bulkUpsert).toBeCalledWith(expected);
        });

        it("skips unpublished demarches - does not adapt nor insert", async () => {
            sendQueryMock.mockResolvedValueOnce(buildDemarche([DOSSIER], false));
            await demarchesSimplifieesService.updateDataByFormId(FORM_ID);
            expect(demarchesSimplifieesDataPort.bulkUpsert).not.toHaveBeenCalled();
            expect(toEntitiesMock).not.toHaveBeenCalled();
        });

        it("should bulkUpsert two times for 10001 demandes", async () => {
            toEntitiesMock.mockReturnValueOnce(Array(2001).fill(DOSSIER));
            await demarchesSimplifieesService.updateDataByFormId(FORM_ID);
            expect(demarchesSimplifieesDataPort.bulkUpsert).toBeCalledTimes(2);
        });

        it("skips unchanged demandes - not in bulk upsert", async () => {
            const oldDossier = {
                ...DOSSIER,
                demande: { ...DOSSIER.demande, dateDerniereModification: new Date(0).toString() },
            };
            toEntitiesMock.mockReturnValueOnce([oldDossier]);
            const expected = [];
            await demarchesSimplifieesService.updateDataByFormId(FORM_ID);
            expect(demarchesSimplifieesDataPort.bulkUpsert).toBeCalledWith(expected);
        });
    });

    describe("sendQuery", () => {
        let postMock: jest.SpyInstance;
        let buildSearchHeaderMock: jest.SpyInstance;
        const AXIOS_RES = { data: { data: { demarche: {} } } } as RequestResponse<unknown>;

        beforeAll(() => {
            postMock = jest
                // @ts-expect-error http is private method
                .spyOn(demarchesSimplifieesService.http, "post")
                .mockResolvedValue(AXIOS_RES);
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
            const expected = AXIOS_RES.data;
            const actual = await demarchesSimplifieesService.sendQuery("", {});
            expect(actual).toEqual(expected);
        });

        it("fails if graphQL errors", async () => {
            postMock.mockResolvedValueOnce({ data: { errors: [{ message: "il y a des pbs" }] } });
            const test = demarchesSimplifieesService.sendQuery("", {});
            await expect(test).rejects.toThrowErrorMatchingSnapshot();
        });

        it("fails if empty demarche", async () => {
            postMock.mockResolvedValueOnce({ data: { data: {} } });
            const test = demarchesSimplifieesService.sendQuery("", {});
            await expect(test).rejects.toThrowErrorMatchingSnapshot();
        });
    });

    describe("addSchema", () => {
        beforeAll(() => {
            // @ts-expect-error mock
            demarchesSimplifieesSchemaPort.upsert.mockResolvedValue();
        });

        afterAll(() => {
            // @ts-expect-error mock
            demarchesSimplifieesSchemaPort.upsert.mockRestore();
        });

        it("should call upsert", async () => {
            const expected = { data: true } as unknown as DemarchesSimplifieesSchemaEntity;

            await demarchesSimplifieesService.addSchema(expected);

            expect(demarchesSimplifieesSchemaPort.upsert).toBeCalledWith(expected);
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

    const SIREN = new Siren("000000000");
    const SIRET = SIREN.toSiret("00000");

    describe.each`
        IDENTIFIER                                                                          | spyToCall
        ${AssociationIdentifier.fromSiren(SIREN)}                                           | ${demarchesSimplifieesDataPort.findBySiren}
        ${EstablishmentIdentifier.fromSiret(SIRET, AssociationIdentifier.fromSiren(SIREN))} | ${demarchesSimplifieesDataPort.findBySiret}
    `("getRawGrants", ({ IDENTIFIER, spyToCall }) => {
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

        it("gets data from port", async () => {
            await demarchesSimplifieesService.getRawGrants(IDENTIFIER);
            expect(spyToCall).toHaveBeenCalledWith(IDENTIFIER.siren || IDENTIFIER.siret);
        });

        it("call private helper", async () => {
            await demarchesSimplifieesService.getRawGrants(IDENTIFIER);
            expect(toRawGrantsMock).toHaveBeenCalledWith(DATA);
        });

        it("returns data from helper", async () => {
            const expected = RAW_DATA;
            const actual = await demarchesSimplifieesService.getRawGrants(IDENTIFIER);
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

    describe("buildSchema", () => {
        let sendQuerySpy: jest.SpyInstance;
        let generateSchemaInstructionSpy: jest.SpyInstance;
        const SCHEMA_SEED = [{ to: 1 }, { to: 2 }] as unknown as DemarchesSimplifieesSingleSchemaSeed[];
        const FORM_ID = 12345;
        const QUERY_RESULT = "QUERY" as unknown as DemarchesSimplifieesSuccessDto;
        const EXAMPLE = "EXAMPLE" as unknown as DemarchesSimplifieesDataEntity;

        beforeAll(() => {
            sendQuerySpy = jest.spyOn(demarchesSimplifieesService, "sendQuery").mockResolvedValue(QUERY_RESULT);
            generateSchemaInstructionSpy = jest
                // @ts-expect-error -- spy private method
                .spyOn(demarchesSimplifieesService, "generateSchemaInstruction")
                // @ts-expect-error -- mock private method
                .mockImplementation((c: DemarchesSimplifieesSingleSchemaSeed) => Promise.resolve({ from: c.to }));
        });
        jest.mocked(DemarchesSimplifieesDtoAdapter.toEntities).mockReturnValue([EXAMPLE]);

        afterAll(() => {
            sendQuerySpy.mockRestore();
            generateSchemaInstructionSpy.mockRestore();
            jest.mocked(DemarchesSimplifieesDtoAdapter.toEntities).mockRestore();
        });

        it("sends query", async () => {
            await demarchesSimplifieesService.buildSchema(SCHEMA_SEED, FORM_ID);
            expect(sendQuerySpy).toHaveBeenCalledWith(GetDossiersByDemarcheId, { demarcheNumber: FORM_ID });
        });

        it("adapts entities (to get example)", async () => {
            await demarchesSimplifieesService.buildSchema(SCHEMA_SEED, FORM_ID);
            expect(DemarchesSimplifieesDtoAdapter.toEntities).toHaveBeenCalledWith(QUERY_RESULT, FORM_ID);
        });

        it("finds id fo each field", async () => {
            await demarchesSimplifieesService.buildSchema(SCHEMA_SEED, FORM_ID);
            expect(generateSchemaInstructionSpy).toHaveBeenCalledTimes(2);
        });

        it("should returns aggregated results by field", async () => {
            const actual = await demarchesSimplifieesService.buildSchema(SCHEMA_SEED, FORM_ID);
            expect(actual).toMatchSnapshot();
        });
    });

    describe("generateSchemaInstruction", () => {
        const EXAMPLE = {
            demande: {
                champs: {
                    idC3: { label: "labelC3", value: "don't care" },
                    idC1: { label: "labelC1", value: "don't care" },
                },
                annotations: {
                    idA3: { label: "labelA3", value: "don't care" },
                    idA2: { label: "labelA2", value: "don't care" },
                },
            },
        } as unknown as DemarchesSimplifieesDataEntity;
        const USER_INPUT = "userInput";

        beforeAll(() => {
            jest.mocked(input).mockResolvedValue(USER_INPUT);
        });
        afterAll(() => {
            jest.mocked(input).mockRestore();
        });

        it("returns from singleSeed as it is", async () => {
            const expected = { from: "where to get value" };
            // @ts-expect-error -- test private method
            const actual = await demarchesSimplifieesService.generateSchemaInstruction(
                { from: "where to get value", to: "fieldName" },
                EXAMPLE,
            );
            expect(actual).toEqual(expected);
        });

        it("makes prompt if property 'valueToPrompt'", async () => {
            // @ts-expect-error -- test private method
            await demarchesSimplifieesService.generateSchemaInstruction(
                { valueToPrompt: true, to: "fieldName" },
                EXAMPLE,
            );
            expect(input).toHaveBeenCalled();
        });

        it("makes prompt if property 'value'", async () => {
            // @ts-expect-error -- test private method
            await demarchesSimplifieesService.generateSchemaInstruction({ value: "default", to: "fieldName" }, EXAMPLE);
            expect(input).toHaveBeenCalled();
        });

        it("return 'value' singleShema from prompt if property 'valueToPrompt'", async () => {
            const expected = { value: USER_INPUT };
            // @ts-expect-error -- test private method
            const actual = await demarchesSimplifieesService.generateSchemaInstruction(
                { valueToPrompt: true, to: "fieldName" },
                EXAMPLE,
            );
            expect(actual).toEqual(expected);
        });

        it("return 'value' singleShema from prompt if property 'value'", async () => {
            const expected = { value: USER_INPUT };
            // @ts-expect-error -- test private method
            const actual = await demarchesSimplifieesService.generateSchemaInstruction(
                { value: "default", to: "fieldName" },
                EXAMPLE,
            );
            expect(actual).toEqual(expected);
        });

        it("return 'value' from schema if nothing is input", async () => {
            jest.mocked(input).mockResolvedValueOnce("");
            const expected = { value: "default" };
            // @ts-expect-error -- test private method
            const actual = await demarchesSimplifieesService.generateSchemaInstruction(
                { value: "default", to: "fieldName" },
                EXAMPLE,
            );
            expect(actual).toEqual(expected);
        });

        it("finds field from 'possibleLabels' in annotations", async () => {
            // @ts-expect-error -- test private method
            const actual = await demarchesSimplifieesService.generateSchemaInstruction(
                {
                    possibleLabels: ["labelA1", "labelA2"],
                    to: "fieldName",
                },
                EXAMPLE,
            );
            const expected = { from: "demande.annotations.idA2.value" };
            expect(actual).toEqual(expected);
        });

        it("finds field from 'possibleLabels' in champs", async () => {
            // @ts-expect-error -- test private method
            const actual = await demarchesSimplifieesService.generateSchemaInstruction(
                {
                    possibleLabels: ["labelC1", "labelC2"],
                    to: "fieldName",
                },
                EXAMPLE,
            );
            const expected = { from: "demande.champs.idC1.value" };
            expect(actual).toEqual(expected);
        });
    });

    describe("buildFullSchema", () => {
        const FULL_SCHEMA = {
            schema: "SCHEMA",
            commonSchema: "COMMON_SCHEMA",
        } as unknown as DemarchesSimplifieesSchemaSeed;
        const DEMARCHE_ID = 98765;
        const BUILT = "built" as unknown as DemarchesSimplifieesSingleSchema[];
        let buildSchemaSpy: jest.SpyInstance;

        beforeAll(() => {
            buildSchemaSpy = jest.spyOn(demarchesSimplifieesService, "buildSchema").mockResolvedValue(BUILT);
        });

        afterAll(() => {
            buildSchemaSpy.mockRestore();
        });

        it("calls buildsSchema for each schema", async () => {
            await demarchesSimplifieesService.buildFullSchema(FULL_SCHEMA, DEMARCHE_ID);
            expect(buildSchemaSpy).toHaveBeenCalledTimes(2);
        });

        it("returns full formed schema", async () => {
            const expected = { schema: BUILT, commonSchema: BUILT, demarcheId: DEMARCHE_ID };
            const actual = await demarchesSimplifieesService.buildFullSchema(FULL_SCHEMA, DEMARCHE_ID);
            expect(actual).toEqual(expected);
        });
    });
});
