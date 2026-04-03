import { DS_DTO, DS_ENTITY, DS_FLAT, SCHEMA } from "./__fixtures__/demarchesSimplifiees.fixture";
import demarchesSimplifieesService from "../../../src/modules/providers/demarches-simplifiees/demarchesSimplifiees.service";
import demarchesSimplifieesSchemaAdapter from "../../../src/adapters/outputs/db/providers/demarches-simplifiees/demarches-simplifiees-schema.adapter";
import DemarchesSimplifieesCli from "../../../src/adapters/inputs/cli/DemarchesSimplifiees.cli";
import demarchesSimplifieesDataAdapter from "../../../src/adapters/outputs/db/providers/demarches-simplifiees/demarches-simplifiees-data.adapter";
import applicationFlatAdapter from "../../../src/adapters/outputs/db/application-flat/application-flat.adapter";
import { ApplicationFlatEntity } from "../../../src/entities/flats/ApplicationFlatEntity";

import * as inquirerPrompt from "@inquirer/prompts";

describe("DemarchesSimplifieesCli", () => {
    let sendHttpQueryMock: jest.SpyInstance;
    const cli = new DemarchesSimplifieesCli();

    beforeAll(() => {
        sendHttpQueryMock = jest.spyOn(demarchesSimplifieesService, "sendQuery").mockResolvedValue(DS_DTO);
    });

    afterAll(() => {
        sendHttpQueryMock.mockRestore();
    });

    describe("on data", () => {
        beforeEach(async () => {
            await demarchesSimplifieesSchemaAdapter.upsert(SCHEMA);
        });

        describe("updateAll", () => {
            it("inserts new application", async () => {
                await cli.updateAll();
                const actual = await demarchesSimplifieesDataAdapter.findAllCursor().toArray();
                expect(actual).toMatchObject([{ ...DS_ENTITY, _id: expect.anything() }]);
            });

            it("inserts new application in flat collections", async () => {
                await cli.updateAll();
                const actual = await applicationFlatAdapter.findAll();
                expect(actual).toMatchObject([DS_FLAT]);
            });

            it("updates existing application", async () => {
                const OLD_ENTITY = JSON.parse(JSON.stringify(DS_ENTITY));
                OLD_ENTITY.demande.champs["Q2hhbXAtMjUwNjg0MA=="].value = "2500";
                await demarchesSimplifieesDataAdapter.upsert(OLD_ENTITY);
                await cli.updateAll();
                const actual = await demarchesSimplifieesDataAdapter.findAllCursor().toArray();
                expect(actual).toMatchObject([DS_ENTITY]);
            });

            it("updates existing application in flat collection", async () => {
                const OLD_ENTITY: ApplicationFlatEntity = {
                    ...DS_FLAT,
                    requestedAmount: 2500,
                } as unknown as ApplicationFlatEntity; // TODO
                await applicationFlatAdapter.upsertOne(OLD_ENTITY);
                await cli.updateAll();
                const actual = await applicationFlatAdapter.findAll();
                expect(actual).toMatchObject([DS_FLAT]);
            });

            it("does not save draft", async () => {
                const DRAFT_DTO = JSON.parse(JSON.stringify(DS_DTO));
                DRAFT_DTO.data.demarche.state = "en_construction";
                sendHttpQueryMock.mockResolvedValueOnce(DRAFT_DTO);
                await cli.updateAll();
                const actual = (await demarchesSimplifieesDataAdapter.findAllCursor().toArray()).length;
                expect(actual).toBe(0);
            });

            it.each`
                mandatoryAttr
                ${"budgetaryYear"}
                ${"requestedAmount"}
            `("does not save flat application with no $mandatoryAttr", async ({ mandatoryAttr }) => {
                const SCHEMA_MISSING = JSON.parse(JSON.stringify(SCHEMA));
                SCHEMA_MISSING.flatSchema = SCHEMA_MISSING.flatSchema.filter(s => s.to != mandatoryAttr);
                await demarchesSimplifieesSchemaAdapter.upsert(SCHEMA_MISSING);

                await cli.updateAll();
                const actual = await applicationFlatAdapter.findAll();
                expect(actual.length).toBe(0);
            });
        });

        describe("initApplicationFlat", () => {
            beforeEach(async () => {
                await demarchesSimplifieesSchemaAdapter.upsert(SCHEMA);
                await demarchesSimplifieesDataAdapter.upsert(DS_ENTITY);
            });

            it("creates flat application for each ds application", async () => {
                await cli.initApplicationFlat();
                const actual = await applicationFlatAdapter.findAll();
                expect(actual).toMatchObject([DS_FLAT]);
            });

            it.each`
                mandatoryAttr
                ${"budgetaryYear"}
                ${"requestedAmount"}
            `("ignores application with no $mandatoryAttr", async ({ mandatoryAttr }) => {
                const SCHEMA_MISSING = JSON.parse(JSON.stringify(SCHEMA));
                SCHEMA_MISSING.flatSchema = SCHEMA_MISSING.flatSchema.filter(s => s.to != mandatoryAttr);
                await demarchesSimplifieesSchemaAdapter.upsert(SCHEMA_MISSING);

                await cli.initApplicationFlat();
                const actual = (await applicationFlatAdapter.findAll()).length;
                expect(actual).toBe(0);
            });
        });
    });

    describe("on schemas", () => {
        let inputMock: jest.SpyInstance;

        beforeAll(() => {
            inputMock = jest.spyOn(inquirerPrompt, "input");
        });
        afterAll(() => {
            inputMock.mockRestore();
        });

        describe("generateSchema", () => {
            it("creates required schema", async () => {
                for (let i = 0; i < 3; i++) {
                    inputMock.mockResolvedValueOnce("");
                    inputMock.mockResolvedValueOnce("2025");
                }
                const PATH = "tests/interfaces/cli/__fixtures__/demarcheSimplifieesSeed.fixture.json";
                await cli.generateSchema(PATH, 42);

                // I only test flat schema because it is what is meant to remain
                const actual = (await demarchesSimplifieesSchemaAdapter.findAll()).map(s => s.flatSchema);
                expect(actual).toMatchObject([SCHEMA.flatSchema]);
            });
        });
    });
});
