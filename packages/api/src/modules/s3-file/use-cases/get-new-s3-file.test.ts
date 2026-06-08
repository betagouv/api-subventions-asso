import { S3Port } from "../../../adapters/outputs/s3/s3.port";
import { FileStatus } from "../@types/FileStatus";
import { GetNewS3File } from "./get-new-s3-file";

describe("GetNewS3File Use Case", () => {
    const PREFIX = "/providers";
    const IMPORT_DATE = new Date();
    const FILE_PATH = `${PREFIX}/my/path/key`;
    const mockAdapter = {
        listFiles: jest.fn().mockResolvedValue([{ path: FILE_PATH, importDate: IMPORT_DATE }]),
        getFileTags: jest.fn().mockResolvedValue({ status: FileStatus.NOT_IMPORTED }),
    };
    const useCase = new GetNewS3File(mockAdapter as unknown as S3Port);

    it("retrieves files for given S3 key", async () => {
        await useCase.execute(PREFIX);
        expect(mockAdapter.listFiles).toHaveBeenCalledWith(PREFIX);
    });

    it("retrieves files tags", async () => {
        await useCase.execute(PREFIX);
        expect(mockAdapter.getFileTags).toHaveBeenCalledWith(FILE_PATH);
    });

    it("returns new files that are not yet imported", async () => {
        const expected = [{ path: FILE_PATH, importDate: IMPORT_DATE }];
        const actual = await useCase.execute(PREFIX);
        expect(actual).toEqual(expected);
    });
});
