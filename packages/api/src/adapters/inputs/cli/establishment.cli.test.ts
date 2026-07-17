import fs from "fs";
import dataLogService from "../../../modules/data-log/dataLog.service";
import { GenericParser } from "../../../shared/GenericParser";
import EstablishmentCli from "./establishment.cli";

jest.mock("fs", () => ({
    ...jest.requireActual("fs"),
    existsSync: jest.fn(),
    writeFileSync: jest.fn(),
}));
jest.mock("../../../shared/GenericParser", () => ({ GenericParser: { findFiles: jest.fn() } }));
jest.mock("../../../modules/data-log/dataLog.service", () => ({ addFromFile: jest.fn().mockResolvedValue(undefined) }));
jest.mock("../../../modules/notify/use-cases/notify-import-success.use-case", () => ({
    notifyImportSuccessUseCase: { execute: jest.fn().mockResolvedValue(undefined) },
}));
jest.mock("../../../modules/notify/use-cases/notify-import-failure.use-case", () => ({
    notifyImportFailureUseCase: { execute: jest.fn().mockResolvedValue(undefined) },
}));
jest.mock("../pipeline/import/sirene-establishment/sirene-establishment.import", () => ({
    __esModule: true,
    default: {},
    SireneEstablishmentImport: class {},
}));

describe("EstablishmentCli", () => {
    beforeEach(() => {
        jest.mocked(fs.existsSync).mockReturnValue(true);
        jest.mocked(GenericParser.findFiles).mockReturnValue(["file.parquet"]);
    });

    describe("_parse", () => {
        it("calls establishment import", async () => {
            const establishmentImport = { run: jest.fn() };
            // @ts-expect-error: protected method
            await new EstablishmentCli(establishmentImport as never)._parse("file.parquet");
            expect(establishmentImport.run).toHaveBeenCalledWith("file.parquet");
        });
    });

    describe("parse", () => {
        it("uses CliController data-log flow", async () => {
            const establishmentImport = {
                run: jest.fn().mockResolvedValue({ parsedCount: 1, importedCount: 1, errorCount: 0 }),
            };
            await new EstablishmentCli(establishmentImport as never).parse("file.parquet", "2026-07-08");
            expect(dataLogService.addFromFile).toHaveBeenCalled();
        });
    });
});
