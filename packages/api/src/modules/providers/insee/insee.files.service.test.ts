import { exec } from "child_process";
import inseeFilesService from "./insee.files.service";

jest.mock("child_process", () => ({
    exec: jest.fn((path, cb) => cb()),
}));

describe("FilesUniteLegalService", () => {
    describe("decompressArchive", () => {
        const PATH = "Fake/path";
        const OUT_PATH = "./output/out.csv";

        it("should call exec with file path", async () => {
            await inseeFilesService.decompressArchive(PATH, OUT_PATH);
            expect(exec).toHaveBeenCalledWith(`unzip ${PATH} -d ./output`, expect.any(Function));
        });

        it("should return uncompress file path", async () => {
            const expected = OUT_PATH;
            const actual = await inseeFilesService.decompressArchive(PATH, OUT_PATH);
            expect(actual).toBe(expected);
        });
    });
});
