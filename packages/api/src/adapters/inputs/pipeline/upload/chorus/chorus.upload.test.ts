import { OMOGEN_FILES } from "../../../../outputs/api/omogen/omogen.fixtures";
import { OmogenPort } from "../../../../outputs/api/omogen/omogen.port";
import { S3Port } from "../../../../outputs/s3/s3.port";
import { ChorusUpload } from "./chorus.upload";

describe("Chorus Upload", () => {
    describe("run", () => {
        const BUFFER_FILE = Buffer.from([]);
        const mockOmogen = {
            list: jest.fn().mockResolvedValue(OMOGEN_FILES),
            get: jest.fn().mockResolvedValue(BUFFER_FILE),
        } as unknown as jest.Mocked<OmogenPort>;
        const mockS3 = { uploadFile: jest.fn() } as unknown as jest.Mocked<S3Port>;

        const upload = new ChorusUpload(mockOmogen, mockS3);

        it("get the list of files in omogen server", async () => {
            await upload.run();
            expect(mockOmogen.list).toHaveBeenCalled();
        });

        it("get latest file from omogen server", async () => {
            await upload.run();
            expect(mockOmogen.get).toHaveBeenCalledWith(OMOGEN_FILES[0].correlationID);
        });

        it("upload file to s3 bucket", async () => {
            await upload.run();
            expect(mockS3.uploadFile).toHaveBeenCalledWith(BUFFER_FILE, "chorus/2026-11-03");
        });
    });
});
