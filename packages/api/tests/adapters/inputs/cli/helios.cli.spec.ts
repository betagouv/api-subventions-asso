import path from "path";
import HeliosCli from "../../../../src/adapters/inputs/cli/helios/helios.cli";

describe("Helios CLI", () => {
    describe("parse", () => {
        it("persist data", async () => {
            const cli = new HeliosCli();
            const data = await cli.parse(path.resolve(__dirname, "./helios.fixture.ods"));
            expect(data).toMatchSnapshot();
        });
    });
});
