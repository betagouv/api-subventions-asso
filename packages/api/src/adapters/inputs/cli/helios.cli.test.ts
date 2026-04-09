import { HeliosCli } from "./helios.cli";

describe("Helios CLI", () => {
    let cli: HeliosCli;
    const BUFFER = Buffer.from("helios file");
    beforeEach(() => {
        cli = new HeliosCli();
    });

    describe("parse", () => {
        it("use helios parser to extract data to entities", () => {
            cli.parse(BUFFER);
            expect(ParseHeliosDataUseCase.execute).toHaveBeenCalledWith();
        });
    });
});
