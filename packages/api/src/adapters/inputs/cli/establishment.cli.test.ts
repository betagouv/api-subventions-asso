import fs from "fs";
import { GenericParser } from "../../../shared/GenericParser";
import EstablishmentCli from "./establishment.cli";
import { SireneEstablishmentPipeline } from "../pipeline/import/sirene-establishment/sirene-establishment.pipeline";
import { RemoveFile } from "../../../usecases/remove-file";
import { ImportNotifier } from "../pipeline/import/import-notifier";
import DownloadFile from "../../../usecases/download-file";
import { DownloadAndImport } from "../pipeline/import/download-and-import.pipeline";

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
jest.mock("../pipeline/import/sirene-establishment/sirene-establishment.pipeline", () => ({
    __esModule: true,
    default: {},
    SireneEstablishmentPipeline: class {},
}));

describe("EstablishmentCli", () => {
    const pipeline = {
        run: jest.fn().mockResolvedValue({ parsedCount: 1, importedCount: 1, errorCount: 0 }),
    } as unknown as jest.Mocked<SireneEstablishmentPipeline>;
    const download = { execute: jest.fn() } as unknown as jest.Mocked<DownloadFile>;
    const remove = { execute: jest.fn() } as unknown as jest.Mocked<RemoveFile>;
    const notifier = {} as unknown as jest.Mocked<ImportNotifier>;
    const mockDownloadAndImportRun = jest.spyOn(DownloadAndImport.prototype, "run").mockResolvedValue();

    const cli = new EstablishmentCli(pipeline, download, remove, notifier);

    beforeEach(() => {
        jest.mocked(fs.existsSync).mockReturnValue(true);
        jest.mocked(GenericParser.findFiles).mockReturnValue(["file.parquet"]);
    });

    describe("_parse", () => {
        it("calls establishment import", async () => {
            // @ts-expect-error: protected method
            await cli._parse("file.parquet");
            expect(pipeline.run).toHaveBeenCalledWith("file.parquet");
        });
    });

    describe("import", () => {
        it("run DownloadAndImport", async () => {
            await cli.import();
            expect(mockDownloadAndImportRun).toHaveBeenCalled();
        });
    });
});
