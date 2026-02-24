jest.mock("../../modules/dump/dump.pipedrive.parser");
jest.mock("../../modules/dump/dump.service");
import fs from "fs";

import DumpPipedriveParser from "../../modules/dump/dump.pipedrive.parser";

import DumpCli from "./Dump.cli";
import { createMockDumpService } from "../../../tests/__mocks__/dump/dump.service.mock";
import { DumpService } from "../../modules/dump/dump.service";

describe("importPipedriveData", () => {
    let mockDumpService: jest.Mocked<DumpService>;
    let dumpCli: DumpCli;

    const FILE_PATH = "path/file.xlsx";

    // @ts-expect-error -- mock
    const mockBuffer = "buffer" as Buffer;

    let fsExistsSyncMock: jest.SpyInstance;

    beforeEach(() => {
        mockDumpService = createMockDumpService();
        dumpCli = new DumpCli(mockDumpService);
    });

    beforeAll(() => {
        // @ts-expect-error: mock
        jest.spyOn(fs, "readFileSync").mockReturnValue(mockBuffer);
        fsExistsSyncMock = jest.spyOn(fs, "existsSync").mockReturnValue(true);
    });

    it("fails if no file path given", () => {
        const notAString = 42;
        let actual;
        try {
            // @ts-expect-error -- test mistyping
            dumpCli.importPipedriveData(notAString);
        } catch (e) {
            actual = e;
        }
        expect(actual).toMatchInlineSnapshot(`[Error: Parse command need file args]`);
    });

    it("fails if file does not exist", () => {
        fsExistsSyncMock.mockReturnValueOnce(false);
        let actual;
        try {
            dumpCli.importPipedriveData(FILE_PATH);
        } catch (e) {
            actual = e;
        }
        expect(actual).toMatchInlineSnapshot(`[Error: File not found path/file.xlsx]`);
    });

    it("reads file", () => {
        dumpCli.importPipedriveData(FILE_PATH);
        expect(fsExistsSyncMock).toHaveBeenCalledWith(FILE_PATH);
    });

    it("parses file content", () => {
        // @ts-expect-error -- mock
        const mockBuffer = "buffer" as Buffer;
        // @ts-expect-error: mock
        jest.mocked(fs.readFileSync).mockReturnValueOnce(mockBuffer);
        dumpCli.importPipedriveData(FILE_PATH);
        expect(DumpPipedriveParser.parse).toHaveBeenCalledWith(mockBuffer);
    });

    it("imports parsed content", () => {
        // @ts-expect-error -- mock
        const parsedData = "buffer" as DefaultObject<string | number>;
        jest.mocked(DumpPipedriveParser.parse).mockReturnValueOnce(parsedData);
        dumpCli.importPipedriveData(FILE_PATH);
        expect(mockDumpService.importPipedriveData).toHaveBeenCalledWith(parsedData);
    });
});
