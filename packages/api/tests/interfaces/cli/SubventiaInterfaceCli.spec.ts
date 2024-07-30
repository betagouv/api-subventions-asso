import path from "node:path";
import SubventiaCli from "../../../src/interfaces/cli/Subventia.cli";
import subventiaRepository from "../../../src/modules/providers/subventia/repositories/subventia.repository";
import { ObjectId } from "mongodb";
import dataLogRepository from "../../../src/modules/data-log/repositories/dataLog.repository";

describe("Subventia Cli", () => {
    let cli: SubventiaCli;

    beforeAll(() => {
        cli = new SubventiaCli();
    });

    describe("_parse()", () => {
        it("should add entities", async () => {
            // @ts-expect-error protected method
            await cli._parse(
                path.resolve(__dirname, "../../../src/modules/providers/subventia/__fixtures__/SUBVENTIA.xlsx"),
                "",
                "2024-03-12",
            );
            const entities = await subventiaRepository.findAll();
            const expectedAny = entities.map(_entity => ({
                _id: expect.any(ObjectId),
            }));

            expect(entities).toMatchSnapshot(expectedAny);
        });

        it("should register new import", async () => {
            const filePath = path.resolve(
                __dirname,
                "../../../src/modules/providers/subventia/__fixtures__/SUBVENTIA.xlsx",
            );
            const EXPORT_DATE = "2024-03-12";
            await cli.parse(path.resolve(__dirname, filePath), "2024-03-12");
            const actual = await dataLogRepository.findsAll();
            expect(actual?.[0]).toMatchObject({
                editionDate: new Date(EXPORT_DATE),
                fileName: filePath,
                integrationDate: expect.any(Date),
                providerId: "subventia",
            });
        });
    });
});
