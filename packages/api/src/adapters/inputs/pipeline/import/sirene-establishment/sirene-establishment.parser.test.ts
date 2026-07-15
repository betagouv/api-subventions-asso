import fs from "fs";
import SireneEstablishmentParser from "./sirene-establishment.parser";

jest.mock("fs", () => ({
    ...jest.requireActual("fs"),
    existsSync: jest.fn().mockReturnValue(true),
}));

describe("SireneEstablishmentParser", () => {
    const onBatch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.mocked(fs.existsSync).mockReturnValue(true);
    });

    describe("parse", () => {
        it("throws if file is not provided", async () => {
            await expect(new SireneEstablishmentParser().parse("", onBatch)).rejects.toThrow(
                "Parse command need file args",
            );
        });

        it("throws if file does not exist", async () => {
            jest.mocked(fs.existsSync).mockReturnValue(false);
            await expect(new SireneEstablishmentParser().parse("file.parquet", onBatch)).rejects.toThrow(
                "File not found file.parquet",
            );
        });
    });

    describe("formatProgress", () => {
        it("returns count over total with percentage", () => {
            expect(SireneEstablishmentParser.formatProgress(25, 100)).toBe("25/100 (25.00%)");
        });
    });
});
