import { Readable, Writable } from "stream";
import fs from "fs";
import sireneEtablissementService from "./sirene-etablissement.service";
import sireneStockEtablissementFileService from "./sirene-stock-etablissement.service";
import sireneStockEtablissementAdapter from "../../../adapters/outputs/api/sirene/sirene-stock-etablissement.adapter";

jest.mock("./sirene-etablissement.service", () => ({
    __esModule: true,
    default: {
        parse: jest.fn(),
    },
}));
jest.mock("../../../adapters/outputs/api/sirene/sirene-stock-etablissement.adapter");
jest.mock("fs", () => {
    const actualFs = jest.requireActual("fs");
    return {
        ...actualFs,
        mkdtempSync: jest.fn().mockReturnValue("tmp"),
        createWriteStream: jest.fn(),
        existsSync: jest.fn().mockReturnValue(true),
        rmSync: jest.fn(),
    };
});

describe("SireneStockEtablissementService", () => {
    describe("getAndParse", () => {
        let getExtractAndSaveFilesMock: jest.SpyInstance;
        let deleteTemporaryFolderMock: jest.SpyInstance;

        beforeAll(() => {
            // @ts-expect-error: private variable
            sireneStockEtablissementFileService.directory_path = "tmp";
            getExtractAndSaveFilesMock = jest
                .spyOn(sireneStockEtablissementFileService, "getExtractAndSaveFiles")
                .mockResolvedValue();
            deleteTemporaryFolderMock = jest
                .spyOn(sireneStockEtablissementFileService, "deleteTemporaryFolder")
                .mockReturnValue();
        });

        afterAll(() => {
            getExtractAndSaveFilesMock.mockRestore();
            deleteTemporaryFolderMock.mockRestore();
        });

        it("downloads file before parsing", async () => {
            await sireneStockEtablissementFileService.getAndParse();
            expect(getExtractAndSaveFilesMock).toHaveBeenCalledTimes(1);
        });

        it("parses downloaded parquet", async () => {
            await sireneStockEtablissementFileService.getAndParse();
            expect(sireneEtablissementService.parse).toHaveBeenCalledWith("tmp/sirene-stock-etablissement.parquet");
        });

        it("deletes temporary folder", async () => {
            await sireneStockEtablissementFileService.getAndParse();
            expect(deleteTemporaryFolderMock).toHaveBeenCalledTimes(1);
        });
    });

    describe("getAndSaveParquet", () => {
        beforeAll(() => {
            jest.mocked(sireneStockEtablissementAdapter.getParquet).mockImplementation(async () => ({
                data: new Readable({
                    read() {
                        this.push("chunk");
                        this.push(null);
                    },
                }),
            }));

            (fs.createWriteStream as jest.Mock).mockImplementation(
                () =>
                    new Writable({
                        write(_chunk, _encoding, callback) {
                            callback();
                        },
                    }),
            );
        });

        it("calls adapter", async () => {
            await sireneStockEtablissementFileService.getAndSaveParquet();
            expect(sireneStockEtablissementAdapter.getParquet).toHaveBeenCalledTimes(1);
        });

        it("resolves when download finishes", async () => {
            const actual = await sireneStockEtablissementFileService.getAndSaveParquet();
            expect(actual).toBe("finish");
        });
    });

    describe("deleteTemporaryFolder", () => {
        it("removes temporary folder", () => {
            // @ts-expect-error: private variable
            sireneStockEtablissementFileService.directory_path = "tmp";
            sireneStockEtablissementFileService.deleteTemporaryFolder();
            expect(fs.rmSync).toHaveBeenCalledWith("tmp", { recursive: true });
        });
    });
});
