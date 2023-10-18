import dedent from "dedent";
import fs from "fs";
jest.mock("fs");
const mockedFs = jest.mocked(fs);
import ExportDateError from "../../../../../shared/errors/cliErrors/ExportDateError";
import ScdlCliController from "./scdl.cli";
import scdlService from "../../scdl.service";
jest.mock("../../scdl.service");
import ScdlGrantParser from "../../scdl.grant.parser";
import MiscScdlGrant from "../../__fixtures__/MiscScdlGrant";
jest.mock("../../scdl.grant.parser");
const mockedScdlGrantParser = jest.mocked(ScdlGrantParser);

describe("ScdlCliController", () => {
    const GRANT = { ...MiscScdlGrant };
    const CSV_CONTENT = "CSV_CONTENT";

    const FILE_PATH = "FILE_PATH";

    let cli: ScdlCliController;
    beforeEach(() => {
        mockedFs.readFileSync.mockReturnValue(CSV_CONTENT);
        mockedScdlGrantParser.parseCsv.mockReturnValue([GRANT]);
        cli = new ScdlCliController();
    });

    describe("_parse()", () => {
        afterEach(() => {
            mockedScdlGrantParser.parseCsv.mockReset();
        });

        it("should throw ExportDateError", async () => {
            // @ts-expect-error: private method
            expect(() => cli._parse()).rejects.toThrowError(ExportDateError);
        });

        it("should call ScdlGrantParser.parseCsv()", async () => {
            const EXPORT_DATE = new Date();
            // @ts-expect-error: private method
            await cli._parse(FILE_PATH, [], EXPORT_DATE);
            expect(ScdlGrantParser.parseCsv).toHaveBeenLastCalledWith(CSV_CONTENT);
        });

        it("should call scdlService.createManyGrants()", async () => {
            // @ts-expect-error: private method
            await cli._parse(FILE_PATH, [], new Date());
            expect(scdlService.createManyGrants).toHaveBeenCalledWith([
                {
                    ...GRANT,
                    producerId: expect.any(String),
                },
            ]);
        });
    });
});
