import path from "path";
import db from "../../../../src/shared/MongoConnection";
import FonjepCli from "../../../../src/interfaces/cli/Fonjep.cli";
import fonjepVersementPort from "../../../../src/dataProviders/db/providers/fonjep/fonjep.versements.port";
import { ObjectId } from "mongodb";
import fonjepTiersPort from "../../../../src/dataProviders/db/providers/fonjep/fonjep.tiers.port";
import fonjepPostesPort from "../../../../src/dataProviders/db/providers/fonjep/fonjep.postes.port";
import fonjepTypePostePort from "../../../../src/dataProviders/db/providers/fonjep/fonjep.typePoste.port";
import fonjepDispositifPort from "../../../../src/dataProviders/db/providers/fonjep/fonjep.dispositif.port";

const FILEPATH = path.resolve(__dirname, "./__fixtures__/fonjep.xlsx");
const EXPORT_DATE = new Date("2022-03-03").toISOString();

describe("FonjepCli", () => {
    let cli: FonjepCli;
    describe("parse()", () => {
        beforeAll(async () => {
            cli = new FonjepCli();
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

        it("should create or replace versement collection", async () => {
            await cli.parse(FILEPATH, EXPORT_DATE);
            const actualVersement = await fonjepVersementPort.findAll();
            const expected = actualVersement.map(_versement => ({
                _id: expect.any(ObjectId),
            }));
            expect(actualVersement).toMatchSnapshot(expected);
        });

        it("should create or replace Tiers collection", async () => {
            await cli.parse(FILEPATH, EXPORT_DATE);
            const actualTiers = await fonjepTiersPort.findAll();
            const expected = actualTiers.map(_tiers => ({
                _id: expect.any(ObjectId),
            }));
            expect(actualTiers).toMatchSnapshot(expected);
        });

        it("should create or replace Poste collection", async () => {
            await cli.parse(FILEPATH, EXPORT_DATE);
            const actualPoste = await fonjepPostesPort.findAll();
            const expected = actualPoste.map(_poste => ({
                _id: expect.any(ObjectId),
            }));
            expect(actualPoste).toMatchSnapshot(expected);
        });

        it("should create or remplace TypePoste collection", async () => {
            await cli.parse(FILEPATH, EXPORT_DATE);
            const actualTypePoste = await fonjepTypePostePort.findAll();
            const expected = actualTypePoste.map(_typePoste => ({
                _id: expect.any(ObjectId),
            }));
            expect(actualTypePoste).toMatchSnapshot(expected);
        });

        it("should create or replace Dispositif collection", async () => {
            await cli.parse(FILEPATH, EXPORT_DATE);
            const actualDispositif = await fonjepDispositifPort.findAll();
            const expected = actualDispositif.map(_dispositif => ({
                _id: expect.any(ObjectId),
            }));
            expect(actualDispositif).toMatchSnapshot(expected);
        });
    });
});