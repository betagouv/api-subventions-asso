import DownloadFile from "../../../usecases/download-file";
import { RemoveFile } from "../../../usecases/remove-file";
import { SireneUniteLegalePipeline } from "../pipeline/import/sirene-unite-legale/sirene-unite-legale.pipeline";
import SireneStockUniteLegaleCli from "./sirene-stock-unite-legale.cli";

function createCli() {
    const pipeline = { run: jest.fn() };
    const download = { execute: jest.fn() };
    const remove = { execute: jest.fn() };

    return {
        pipeline,
        download,
        remove,
        cli: new SireneStockUniteLegaleCli(
            pipeline as unknown as SireneUniteLegalePipeline,
            download as unknown as DownloadFile,
            remove as unknown as RemoveFile,
        ),
    };
}

describe("SireneStockUniteLegaleCli", () => {
    describe("_parse", () => {
        it("runs the import pipeline", async () => {
            const { cli, pipeline } = createCli();

            // @ts-expect-error: protected method
            await cli._parse("file.parquet");

            expect(pipeline.run).toHaveBeenCalledWith("file.parquet");
        });
    });

    describe("import", () => {
        const { cli, download, remove } = createCli();
        const parseMock = jest.spyOn(cli, "parse").mockResolvedValue();

        beforeEach(() => {
            download.execute.mockResolvedValue({ filePath: "file.parquet" });
            remove.execute.mockResolvedValue(undefined);
        });

        afterAll(() => parseMock.mockReset());

        it("downloads, parses and removes the file", async () => {
            await cli.import();

            expect({
                downloadCalls: download.execute.mock.calls,
                parseCalls: parseMock.mock.calls.map(([filePath]) => filePath),
                removeCalls: remove.execute.mock.calls,
            }).toEqual({
                downloadCalls: [[]],
                parseCalls: ["file.parquet"],
                removeCalls: [["file.parquet"]],
            });
        });
    });
});
