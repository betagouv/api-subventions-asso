import {
    DemarchesSimplifieesSchemaSeed,
    DemarchesSimplifieesSchemaSeedLine,
} from "./entities/DemarchesSimplifieesSchemaSeed";

jest.mock("../../../dataProviders/db/providers/demarchesSimplifiees/demarchesSimplifieesSchema.port");
jest.mock("../../../dataProviders/db/providers/demarchesSimplifiees/demarchesSimplifieesData.port");
jest.mock("./adapters/DemarchesSimplifieesEntityAdapter");
jest.mock("./adapters/DemarchesSimplifieesDtoAdapter");
jest.mock("@inquirer/prompts");
jest.mock("../../configurations/configurations.service");
jest.mock("../../applicationFlat/applicationFlat.service");
jest.mock("../../applicationFlat/applicationFlat.helper");
jest.mock("stream/web");

import configurationsService from "../../configurations/configurations.service";
import DemarchesSimplifieesDtoAdapter from "./adapters/DemarchesSimplifieesDtoAdapter";
import { DemarchesSimplifieesEntityAdapter } from "./adapters/DemarchesSimplifieesEntityAdapter";
import demarchesSimplifieesService from "./demarchesSimplifiees.service";
import DemarchesSimplifieesSchema, { DemarchesSimplifieesSchemaLine } from "./entities/DemarchesSimplifieesSchema";
import GetDossiersByDemarcheId from "./queries/GetDossiersByDemarcheId";
import demarchesSimplifieesDataPort from "../../../dataProviders/db/providers/demarchesSimplifiees/demarchesSimplifieesData.port";
import demarchesSimplifieesSchemaPort from "../../../dataProviders/db/providers/demarchesSimplifiees/demarchesSimplifieesSchema.port";
import { RequestResponse } from "../../provider-request/@types/RequestResponse";
import { DATA_ENTITIES } from "./__fixtures__/DemarchesSimplifieesFixture";
import { DemarchesSimplifieesSuccessDto } from "./dto/DemarchesSimplifieesDto";
import DemarchesSimplifieesDataEntity from "./entities/DemarchesSimplifieesDataEntity";
import { input } from "@inquirer/prompts";
import applicationFlatService from "../../applicationFlat/applicationFlat.service";
import { cursorToStream } from "../../applicationFlat/applicationFlat.helper";
import { DefaultObject } from "../../../@types";
import { ApplicationFlatEntity } from "../../../entities/ApplicationFlatEntity";
import { FindCursor, WithId } from "mongodb";
import { ReadableStream } from "stream/web";

jest.mock("lodash");

describe("DemarchesSimplifieesService", () => {
    describe("flat part", () => {
        const STREAM = {} as unknown as ReadableStream<ApplicationFlatEntity>;

        describe("saveFlatFromStream", () => {
            it("calls applicationFlatService", async () => {
                await demarchesSimplifieesService.saveFlatFromStream(STREAM);
                expect(applicationFlatService.saveFromStream).toHaveBeenCalledWith(STREAM);
            });
        });

        describe("initApplicationFlat", () => {
            const DEMARCHE_ID = 42;
            const CURSOR = "CURSOR" as unknown as FindCursor<WithId<DemarchesSimplifieesDataEntity>>; // TODO
            const SCHEMA = { demarcheId: DEMARCHE_ID } as unknown as DemarchesSimplifieesSchema;
            const SCHEMAS_DICT: DefaultObject<DemarchesSimplifieesSchema> = { [DEMARCHE_ID]: SCHEMA };
            const ADAPTED = {} as unknown as ApplicationFlatEntity;
            const DBO = { demarcheId: DEMARCHE_ID };

            let getSchemasByIdSpy: jest.SpyInstance; // TODO mock
            let toFlatAndValidateSpy: jest.SpyInstance;
            let saveFlatSpy: jest.SpyInstance;

            beforeEach(() => {
                getSchemasByIdSpy = jest
                    // @ts-expect-error - spy private
                    .spyOn(demarchesSimplifieesService, "getSchemasByIds")
                    // @ts-expect-error - spy private
                    .mockResolvedValue(SCHEMAS_DICT);
                toFlatAndValidateSpy = jest
                    .spyOn(demarchesSimplifieesService, "toFlatAndValidate")
                    .mockReturnValue(ADAPTED);
                saveFlatSpy = jest
                    .spyOn(demarchesSimplifieesService, "saveFlatFromStream")
                    .mockReturnValue(Promise.resolve());

                jest.mocked(demarchesSimplifieesDataPort.findAllCursor).mockReturnValue(CURSOR);
                jest.mocked(cursorToStream).mockReturnValue(STREAM);
            });

            afterEach(() => {
                getSchemasByIdSpy.mockRestore();
                toFlatAndValidateSpy.mockRestore();
                saveFlatSpy.mockRestore();
            });

            it("finds cursor", async () => {
                await demarchesSimplifieesService.initApplicationFlat();
                expect(demarchesSimplifieesDataPort.findAllCursor).toHaveBeenCalled();
            });

            it("gets schemas", async () => {
                await demarchesSimplifieesService.initApplicationFlat();
                expect(getSchemasByIdSpy).toHaveBeenCalled();
            });

            it("calls helper's cursorToStream with cursor", async () => {
                await demarchesSimplifieesService.initApplicationFlat();
                expect(cursorToStream).toHaveBeenCalledWith(CURSOR, expect.any(Function));
            });

            describe("adaptation", () => {
                it("calls saveFlatAndValidate with each proper schema", async () => {
                    await demarchesSimplifieesService.initApplicationFlat();
                    const adapter = jest.mocked(cursorToStream).mock.calls[0][1];
                    const expected = ADAPTED;
                    const actual = adapter(DBO);
                    expect(toFlatAndValidateSpy).toHaveBeenCalledWith(DBO, SCHEMA);
                    expect(actual).toEqual(expected);
                });
            });

            it("calls saveFlatFromStream with stream from helper", async () => {
                await demarchesSimplifieesService.initApplicationFlat();
                expect(saveFlatSpy).toHaveBeenCalledWith(STREAM);
            });
        });

        describe("toFlatAndValidate", () => {
            const DBO = "DBO" as unknown as DemarchesSimplifieesDataEntity;
            const SCHEMA = { flatSchema: {} } as DemarchesSimplifieesSchema;
            let isDraftSpy: jest.SpyInstance;
            const ADAPTED = { requestedAmount: 456, budgetaryYear: 2004 } as ApplicationFlatEntity;

            beforeAll(() => {
                // @ts-expect-error -- private method
                isDraftSpy = jest.spyOn(demarchesSimplifieesService, "isDraft").mockReturnValue(false);
                jest.mocked(DemarchesSimplifieesEntityAdapter.toFlat).mockReturnValue(ADAPTED);
            });

            afterAll(() => {
                isDraftSpy.mockRestore();
                jest.mocked(DemarchesSimplifieesEntityAdapter.toFlat).mockRestore();
            });

            it("returns null if no flat schema", () => {
                const actual = demarchesSimplifieesService.toFlatAndValidate(DBO, {} as DemarchesSimplifieesSchema);
                expect(actual).toBeNull();
            });

            it("checks if is draft", () => {
                demarchesSimplifieesService.toFlatAndValidate(DBO, SCHEMA);
                expect(isDraftSpy).toHaveBeenCalledWith(DBO);
            });

            it("returns null if draft", () => {
                isDraftSpy.mockReturnValueOnce(true);
                const actual = demarchesSimplifieesService.toFlatAndValidate(DBO, SCHEMA);
                expect(actual).toBeNull();
            });

            it("calls adapter", () => {
                demarchesSimplifieesService.toFlatAndValidate(DBO, SCHEMA);
            });

            it("returns null if no requested amount", () => {
                jest.mocked(DemarchesSimplifieesEntityAdapter.toFlat).mockReturnValueOnce({
                    budgetaryYear: 2004,
                } as ApplicationFlatEntity);
                const actual = demarchesSimplifieesService.toFlatAndValidate(DBO, SCHEMA);
                expect(actual).toBeNull();
            });

            it("returns null if no budgtary year", () => {
                jest.mocked(DemarchesSimplifieesEntityAdapter.toFlat).mockReturnValueOnce({
                    requestedAmount: 1234,
                } as ApplicationFlatEntity);
                const actual = demarchesSimplifieesService.toFlatAndValidate(DBO, SCHEMA);
                expect(actual).toBeNull();
            });

            it("return res from adapter", () => {
                const expected = ADAPTED;
                const actual = demarchesSimplifieesService.toFlatAndValidate(DBO, SCHEMA);
                expect(actual).toEqual(expected);
            });
        });

        describe("bulkUpdateApplicationFlat", () => {
            const ENTITIES = ["e1", "e2"] as unknown as DemarchesSimplifieesDataEntity[];
            const SCHEMA = "SCHEMA" as unknown as DemarchesSimplifieesSchema;
            const STREAM = "STREAM" as unknown as ReadableStream;
            let saveSpy: jest.SpyInstance;
            let adaptSpy: jest.SpyInstance;

            beforeAll(() => {
                saveSpy = jest
                    .spyOn(demarchesSimplifieesService, "saveFlatFromStream")
                    .mockReturnValue(Promise.resolve());
                adaptSpy = jest
                    .spyOn(demarchesSimplifieesService, "toFlatAndValidate")
                    .mockImplementation(e => ((e as unknown as string) + "a") as unknown as ApplicationFlatEntity);
                jest.mocked(ReadableStream.from).mockReturnValue(STREAM);
            });
            afterAll(() => {});

            it("doesn't save anything if no schema", () => {
                demarchesSimplifieesService.bulkUpdateApplicationFlat(ENTITIES, null);
                expect(saveSpy).not.toHaveBeenCalled();
            });

            it("adapts each entity", () => {
                demarchesSimplifieesService.bulkUpdateApplicationFlat(ENTITIES, SCHEMA);
                expect(adaptSpy).toHaveBeenCalledWith(ENTITIES[0], SCHEMA);
                expect(adaptSpy).toHaveBeenCalledWith(ENTITIES[1], SCHEMA);
            });

            it("creates stream from filtered adapted data", () => {
                adaptSpy.mockReturnValueOnce(null);
                demarchesSimplifieesService.bulkUpdateApplicationFlat(ENTITIES, SCHEMA);
                expect(ReadableStream.from).toHaveBeenCalledWith(["e2a"]);
            });

            it("saves created stream", () => {
                demarchesSimplifieesService.bulkUpdateApplicationFlat(ENTITIES, SCHEMA);
                expect(saveSpy).toHaveBeenCalledWith(STREAM);
            });
        });
    });

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
        let sendQueryMock: jest.SpyInstance;
        let toEntitiesMock: jest.SpyInstance;
        let upsertFlatMock: jest.SpyInstance;

        const FORM_ID = 12345;

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
        const SCHEMA = {} as DemarchesSimplifieesSchema;

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
            jest.mocked(demarchesSimplifieesSchemaPort.findById).mockResolvedValue(SCHEMA);
            upsertFlatMock = jest
                .spyOn(demarchesSimplifieesService, "bulkUpdateApplicationFlat")
                .mockImplementation(jest.fn());
        });

        afterAll(() => {
            sendQueryMock.mockRestore();
            toEntitiesMock.mockRestore();
            // @ts-expect-error mock
            demarchesSimplifieesSchemaPort.upsert.mockRestore();
            upsertFlatMock.mockRestore();
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
            expect(demarchesSimplifieesDataPort.bulkUpsert).toHaveBeenCalledWith(expected);
        });

        it("should upsert flat data", async () => {
            const expected = [DOSSIER];
            sendQueryMock.mockResolvedValueOnce(DEMARCHE);
            await demarchesSimplifieesService.updateDataByFormId(FORM_ID);
            expect(upsertFlatMock).toHaveBeenCalledWith(expected, SCHEMA);
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
            expect(demarchesSimplifieesDataPort.bulkUpsert).toHaveBeenCalledTimes(2);
        });

        it("should upsert flat two times for 10001 demandes", async () => {
            toEntitiesMock.mockReturnValueOnce(Array(2001).fill(DOSSIER));
            await demarchesSimplifieesService.updateDataByFormId(FORM_ID);
            expect(upsertFlatMock).toHaveBeenCalledTimes(2);
        });

        it("skips unchanged demandes - not in bulk upsert nor flat upsert", async () => {
            const oldDossier = {
                ...DOSSIER,
                demande: { ...DOSSIER.demande, dateDerniereModification: new Date(0).toString() },
            };
            toEntitiesMock.mockReturnValueOnce([oldDossier]);
            const expected = [];
            await demarchesSimplifieesService.updateDataByFormId(FORM_ID);
            expect(demarchesSimplifieesDataPort.bulkUpsert).toHaveBeenCalledWith(expected);
            expect(upsertFlatMock).toHaveBeenCalledWith(expected, SCHEMA);
        });
    });

    describe("sendQuery", () => {
        let postMock: jest.SpyInstance;
        let buildSearchHeaderMock: jest.SpyInstance;
        const AXIOS_RES = { data: { data: { demarche: {} } } } as RequestResponse<unknown>;

        beforeAll(() => {
            postMock = jest.spyOn(demarchesSimplifieesService.http, "post").mockResolvedValue(AXIOS_RES);
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
            const expected = { data: true } as unknown as DemarchesSimplifieesSchema;

            await demarchesSimplifieesService.addSchema(expected);

            expect(demarchesSimplifieesSchemaPort.upsert).toBeCalledWith(expected);
        });
    });

    describe("buildSchema", () => {
        let generateSchemaInstructionSpy: jest.SpyInstance;
        const SCHEMA_SEED = [{ to: 1 }, { to: 2 }] as unknown as DemarchesSimplifieesSchemaSeedLine[];
        const EXAMPLE = "EXAMPLE" as unknown as DemarchesSimplifieesDataEntity;

        beforeAll(() => {
            generateSchemaInstructionSpy = jest
                // @ts-expect-error -- spy private method
                .spyOn(demarchesSimplifieesService, "generateSchemaInstruction")
                // @ts-expect-error -- mock private method
                .mockImplementation((c: DemarchesSimplifieesSchemaSeedLine) => Promise.resolve({ from: c.to }));
        });

        afterAll(() => {
            generateSchemaInstructionSpy.mockRestore();
        });

        it("finds id fo each field", async () => {
            await demarchesSimplifieesService.buildSchema(SCHEMA_SEED, EXAMPLE);
            expect(generateSchemaInstructionSpy).toHaveBeenCalledTimes(2);
        });

        it("should returns aggregated results by field", async () => {
            const actual = await demarchesSimplifieesService.buildSchema(SCHEMA_SEED, EXAMPLE);
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
        const NUMBER_USER_INPUT = 42;

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
            jest.mocked(input).mockResolvedValueOnce(NUMBER_USER_INPUT.toString());
            const expected = { value: NUMBER_USER_INPUT };
            // @ts-expect-error -- test private method
            const actual = await demarchesSimplifieesService.generateSchemaInstruction(
                { valueToPrompt: true, to: "fieldName" },
                EXAMPLE,
            );
            expect(actual).toEqual(expected);
        });

        it("return number 'value' singleShema from prompt if property 'valueToPrompt'", async () => {
            jest.mocked(input).mockResolvedValueOnce(NUMBER_USER_INPUT.toString());
            const expected = { value: NUMBER_USER_INPUT };
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

        it("return number 'value' singleShema from prompt if property 'value'", async () => {
            jest.mocked(input).mockResolvedValueOnce(NUMBER_USER_INPUT.toString());
            const expected = { value: NUMBER_USER_INPUT };
            // @ts-expect-error -- test private method
            const actual = await demarchesSimplifieesService.generateSchemaInstruction(
                { value: USER_INPUT, to: "fieldName" },
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
        const BUILT = "built" as unknown as DemarchesSimplifieesSchemaLine[];
        const QUERY_RESULT = "QUERY" as unknown as DemarchesSimplifieesSuccessDto;
        const EXAMPLE = "EXAMPLE" as unknown as DemarchesSimplifieesDataEntity;

        let buildSchemaSpy: jest.SpyInstance;
        let sendQuerySpy: jest.SpyInstance;

        beforeAll(() => {
            buildSchemaSpy = jest.spyOn(demarchesSimplifieesService, "buildSchema").mockResolvedValue(BUILT);
            sendQuerySpy = jest.spyOn(demarchesSimplifieesService, "sendQuery").mockResolvedValue(QUERY_RESULT);
            jest.mocked(DemarchesSimplifieesDtoAdapter.toEntities).mockReturnValue([EXAMPLE]);
        });

        afterAll(() => {
            buildSchemaSpy.mockRestore();
            sendQuerySpy.mockRestore();
            jest.mocked(DemarchesSimplifieesDtoAdapter.toEntities).mockRestore();
        });

        it("sends query", async () => {
            await demarchesSimplifieesService.buildFullSchema(FULL_SCHEMA, DEMARCHE_ID);
            expect(sendQuerySpy).toHaveBeenCalledWith(GetDossiersByDemarcheId, { demarcheNumber: DEMARCHE_ID });
        });

        it("adapts entities (to get example)", async () => {
            await demarchesSimplifieesService.buildFullSchema(FULL_SCHEMA, DEMARCHE_ID);
            expect(DemarchesSimplifieesDtoAdapter.toEntities).toHaveBeenCalledWith(QUERY_RESULT, DEMARCHE_ID);
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
