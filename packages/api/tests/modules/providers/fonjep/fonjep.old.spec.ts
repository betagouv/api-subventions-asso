import fs from "fs";
import path from "path";

import FonjepParser from "../../../../src/modules/providers/fonjep/fonjep.parser.old";
import FonjepCli from "../../../../src/interfaces/cli/Fonjep.cli.old";
import db from "../../../../src/shared/MongoConnection";
import fonjepVersementPort from "../../../../src/dataProviders/db/providers/fonjep/fonjep.payment.port.old";
import fonjepSubventionPort from "../../../../src/dataProviders/db/providers/fonjep/fonjep.subvention.port.old";

const FILE = fs.readFileSync(path.resolve(__dirname, "./__fixtures__/fonjep.xlsx"));
const EXPORT_DATE = new Date("2022-03-03").toISOString();

describe("FonjepParser", () => {
    describe("parse()", () => {
        it("should return an object with subventions and versements", () => {
            const data = FonjepParser.parse(FILE, new Date(EXPORT_DATE));
            expect(data).toMatchSnapshot();
        });
    });
});

describe("FonjepCli", () => {
    beforeEach(() => {
        fonjepVersementPort.createIndexes();
        fonjepSubventionPort.createIndexes();
    });
    describe("parse()", () => {
        it("should remove temporary collections", async () => {
            const controller = new FonjepCli();
            await controller.parse(path.resolve(__dirname, "./__fixtures__/fonjep.xlsx"), EXPORT_DATE);
            const collections = await db.listCollections().toArray();
            const actual = collections.find(col =>
                ["fonjepSubvention-tmp-collection", "fonjepVersement-tmp-collection"].includes(col.name),
            );
            expect(actual).toBeUndefined();
        });

        it("should create versements", async () => {
            const controller = new FonjepCli();
            await controller.parse(path.resolve(__dirname, "./__fixtures__/fonjep.xlsx"), EXPORT_DATE);
            const actual = await db.collection("fonjepVersement").countDocuments();
            expect(actual).toMatchSnapshot();
        });

        it("should create subventions", async () => {
            const controller = new FonjepCli();
            await controller.parse(path.resolve(__dirname, "./__fixtures__/fonjep.xlsx"), EXPORT_DATE);
            const actual = await db.collection("fonjepSubvention").countDocuments();
            expect(actual).toMatchSnapshot();
        });
    });
});
