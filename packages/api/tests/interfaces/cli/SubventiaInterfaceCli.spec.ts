import path from "node:path";
import SubventiaCli from "../../../src/interfaces/cli/Subventia.cli";
import subventiaPort from "../../../src/dataProviders/db/providers/subventia/subventia.port";
import { ObjectId } from "mongodb";
import dataLogPort from "../../../src/dataProviders/db/data-log/dataLog.port";
import applicationFlatPort from "../../../src/dataProviders/db/applicationFlat/applicationFlat.port";
import { SUBVENTIA_DBO } from "../../../src/modules/providers/subventia/__fixtures__/subventia.fixture";
import { ApplicationFlatEntity } from "../../../src/entities/ApplicationFlatEntity";

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
                new Date("2024-03-12"),
            );
            const entities = await subventiaPort.findAll();
            const expectedAny = entities.map(() => ({
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
            const actual = await dataLogPort.findAll();
            expect(actual?.[0]).toMatchObject({
                editionDate: new Date(EXPORT_DATE),
                fileName: "SUBVENTIA.xlsx",
                integrationDate: expect.any(Date),
                providerId: "subventia",
            });
        });
    });

    describe("initApplicationFlat()", () => {
        it("creates applications flat from subventia dbos", async () => {
            await subventiaPort.create(SUBVENTIA_DBO);
            await cli.initApplicationFlat();
            const cursor = await applicationFlatPort.cursorFind();
            const applications: ApplicationFlatEntity[] = [];
            while (await cursor.hasNext()) {
                const application = (await cursor.next()) as ApplicationFlatEntity;
                applications.push({ ...application, updateDate: expect.any(Date) });
            }
            expect(applications).toMatchSnapshot();
        });
    });
});
