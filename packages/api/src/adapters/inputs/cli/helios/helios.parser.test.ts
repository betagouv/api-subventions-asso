import HeliosParser from "./helios.parser";

describe("Helios Parser", () => {
    const FILE_PATH = "/file/to/path";
    const HELIOS_DATA = [{ foo: "bar" }];
    beforeEach(() => {
        jest.spyOn(HeliosParser, "read").mockReturnValue(HELIOS_DATA);
    });

    describe("parse()", () => {
        it("read the page", () => {
            HeliosParser.parse(FILE_PATH);
            expect(HeliosParser.read).toHaveBeenCalledWith(FILE_PATH);
        });

        it("returns data", () => {
            const expected = HELIOS_DATA;
            const actual = HeliosParser.parse(FILE_PATH);
            expect(actual).toEqual(expected);
        });
    });
});
