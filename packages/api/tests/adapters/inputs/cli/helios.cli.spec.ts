import path from "path";
import createHeliosCli from "../../../../src/adapters/inputs/cli/helios/helios.cli.factory";
import heliosAdapter from "../../../../src/adapters/outputs/db/providers/helios/helios.adapter";

describe("Helios CLI", () => {
    describe("parse", () => {
        it("persist data", async () => {
            const cli = createHeliosCli();
            await cli.parse(path.resolve(__dirname, "./helios.fixture.ods"));
            expect(await heliosAdapter.findAll()).toMatchSnapshot();
        });
    });
});
