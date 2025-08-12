import GisproCli from "../../../src/interfaces/cli/Gispro.cli";
import gisproPort from "../../../src/dataProviders/db/providers/gispro.port";
import path from "path";

describe("Gispro Cli", () => {
    const cli = new GisproCli();
    const FILE_PATH = path.resolve(__dirname, "./__fixtures__/2023 subventions GISPO et TDB_test.xlsx");

    const EXPORT_DATE_STR = "2023-06-06";

    describe("parse", () => {
        it("saves uniformized data from 2023", async () => {
            await cli.parse(FILE_PATH, EXPORT_DATE_STR);
            const savedData = await gisproPort.findAll();
            const noId = savedData.map(({ _id, ...rest }) => rest);
            expect(noId).toMatchSnapshot();
        });
    });
});
