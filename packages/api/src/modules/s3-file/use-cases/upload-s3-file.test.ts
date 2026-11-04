import { S3Port } from "../../../adapters/outputs/s3/s3.port";
import { UploadS3File } from "./upload-s3-file";

describe("UploadS3File UseCase", () => {
    const mockAdapter = { uploadFile: jest.fn() } as unknown as jest.Mocked<S3Port>;
    const usecase = new UploadS3File(mockAdapter);
    const FILE = Buffer.from([]);
    const KEY = "path/to/file";

    it("uploads file", () => {
        usecase.execute({ file: FILE, key: KEY });
        expect(mockAdapter.uploadFile).toHaveBeenCalledWith(FILE, KEY);
    });
});
