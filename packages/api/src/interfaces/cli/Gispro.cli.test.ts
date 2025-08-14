import GisproCli from "./Gispro.cli";
import fs from "fs";
import gisproService from "../../modules/providers/dauphin-gispro/gispro.service";

jest.mock("fs");
jest.mock("../../modules/providers/dauphin-gispro/gispro.service");

describe("Gispro cli", () => {
    const cli = new GisproCli();
    const FILE_PATH = "path/to/the/file";
    const LOGS = [];
    const YEAR = 2024;
    const EXPORT_DATE = new Date(YEAR, 5, 5);

    describe("parse", () => {
        it("reads file", async () => {
            // @ts-expect-error -- test purposes
            await cli._parse(FILE_PATH, LOGS, EXPORT_DATE);
            expect(fs.readFileSync).toHaveBeenCalledWith(FILE_PATH);
        });

        it("calls service with file content and year from exportDate", async () => {
            const FILE_CONTENT = "file_content" as unknown as Buffer;
            jest.mocked(fs.readFileSync).mockReturnValueOnce(FILE_CONTENT);
            // @ts-expect-error -- test purposes
            await cli._parse(FILE_PATH, LOGS, EXPORT_DATE);
            expect(gisproService.parseSaveXls).toHaveBeenCalledWith(FILE_CONTENT, YEAR);
        });
    });
});
