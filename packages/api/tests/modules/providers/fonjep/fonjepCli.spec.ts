import path from "path";
import db from "../../../../src/shared/MongoConnection";
import FonjepCli from "../../../../src/interfaces/cli/Fonjep.cli";
import fonjepVersementPort from "../../../../src/dataProviders/db/providers/fonjep/fonjep.versements.port";
import { ObjectId } from "mongodb";
import fonjepTiersPort from "../../../../src/dataProviders/db/providers/fonjep/fonjep.tiers.port";
import fonjepPostesPort from "../../../../src/dataProviders/db/providers/fonjep/fonjep.postes.port";
import fonjepTypePostePort from "../../../../src/dataProviders/db/providers/fonjep/fonjep.typePoste.port";
import fonjepDispositifPort from "../../../../src/dataProviders/db/providers/fonjep/fonjep.dispositif.port";
import dataBretagnePort from "../../../../src/dataProviders/api/dataBretagne/dataBretagne.port";
import { DATA_BRETAGNE_DTOS, PROGRAMS } from "../../../__fixtures__/paymentsFlat.fixture";
import stateBudgetProgramPort from "../../../../src/dataProviders/db/state-budget-program/stateBudgetProgram.port";
import paymentFlatPort from "../../../../src/dataProviders/db/paymentFlat/paymentFlat.port";
import applicationFlatPort from "../../../../src/dataProviders/db/applicationFlat/applicationFlat.port";

const FILEPATH = path.resolve(__dirname, "./__fixtures__/fonjep-new.xlsx");
const EXPORT_DATE = new Date("2022-03-03").toISOString();

describe("FonjepCli", () => {
    let cli: FonjepCli;

    beforeEach(async () => {
        // mock API call to DataBretagne
        jest.spyOn(dataBretagnePort, "login").mockImplementation(jest.fn());
        jest.spyOn(dataBretagnePort, "getCollection").mockImplementation(collection => DATA_BRETAGNE_DTOS[collection]);
        await stateBudgetProgramPort.replace(PROGRAMS);
    });

    describe("parse()", () => {
        beforeAll(async () => {
            cli = new FonjepCli();
        });

        describe("test with all information arround one code poste", () => {
            it("adds applications flat", async () => {
                await cli.parse(path.resolve(__dirname, "./__fixtures__/fonjep-one-code-full.xlsx"), "2025-09-30");
                const actual = await applicationFlatPort.findAll();
                expect(actual).toMatchSnapshot();
            });
            it("adds payments flat", async () => {
                await cli.parse(path.resolve(__dirname, "./__fixtures__/fonjep-one-code-full.xlsx"), "2025-09-30");
                const actual = await paymentFlatPort.findAll();
                expect(actual).toMatchSnapshot();
            });
        });

        it("should remove temporary collections", async () => {
            await cli.parse(FILEPATH, EXPORT_DATE);
            const collections = await db.listCollections().toArray();
            const actual = collections.find(col =>
                [
                    "fonjepDispositif-tmp-collection",
                    "fonjepPoste-tmp-collection",
                    "FonjepTiers-tmp-collection",
                    "FonjepTypePoste-tmp-collection",
                    "FonjepVersement-tmp-collection",
                ].includes(col.name),
            );
            expect(actual).toBeUndefined();
        });

        it("should create or replace Versement collection", async () => {
            await cli.parse(FILEPATH, EXPORT_DATE);
            const actualVersement = await fonjepVersementPort.findAll();
            const expected = actualVersement.map(() => ({
                _id: expect.any(ObjectId),
            }));
            expect(actualVersement).toMatchSnapshot(expected);
        });

        it("should create or replace Tiers collection", async () => {
            await cli.parse(FILEPATH, EXPORT_DATE);
            const actualTiers = await fonjepTiersPort.findAll();
            const expected = actualTiers.map(() => ({
                _id: expect.any(ObjectId),
            }));
            expect(actualTiers).toMatchSnapshot(expected);
        });

        it("should create or replace Poste collection", async () => {
            await cli.parse(FILEPATH, EXPORT_DATE);
            const actualPoste = await fonjepPostesPort.findAll();
            const expected = actualPoste.map(() => ({
                _id: expect.any(ObjectId),
            }));
            expect(actualPoste).toMatchSnapshot(expected);
        });

        it("should create or remplace TypePoste collection", async () => {
            await cli.parse(FILEPATH, EXPORT_DATE);
            const actualTypePoste = await fonjepTypePostePort.findAll();
            const expected = actualTypePoste.map(() => ({
                _id: expect.any(ObjectId),
            }));
            expect(actualTypePoste).toMatchSnapshot(expected);
        });

        it("should create or replace Dispositif collection", async () => {
            await cli.parse(FILEPATH, EXPORT_DATE);
            const actualDispositif = await fonjepDispositifPort.findAll();
            const expected = actualDispositif.map(() => ({
                _id: expect.any(ObjectId),
            }));
            expect(actualDispositif).toMatchSnapshot(expected);
        });

        it("should add FonjepPaymentFlat", async () => {
            await cli.parse(FILEPATH, EXPORT_DATE);
            const paymentsFlat = await paymentFlatPort.findAll();
            expect(paymentsFlat.map(flat => ({ ...flat, _id: expect.any(String) }))).toMatchSnapshot();
        });

        it("should add FonjepApplicationFlat", async () => {
            await cli.parse(FILEPATH, EXPORT_DATE);
            const applications = await applicationFlatPort.findAll();
            expect(
                applications.map(flat => ({ ...flat, _id: expect.any(String), updateDate: expect.any(Date) })),
            ).toMatchSnapshot();
        });
    });
});
