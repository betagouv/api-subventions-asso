import { MissingFilePathError } from "../@errors/MissingFilePathError";
import HeliosCli from "./helios.cli";
import HeliosParser from "./helios.parser";

describe("Helios CLI", () => {
    let cli: HeliosCli;
    const FILE_PATH = "/path/to/file";
    beforeEach(() => {
        cli = new HeliosCli();
    });

    describe("parse", () => {
        it("throws error if no file path provided", () => {
            expect(() => cli.parse(FILE_PATH)).rejects.toThrow(MissingFilePathError);
        });

        it("use helios parser to extract data to entities", () => {
            cli.parse(FILE_PATH);
            expect(HeliosParser.parse).toHaveBeenCalledWith(FILE_PATH);
        });
    });
});
