import { S3Port } from "../../../adapters/outputs/s3/s3.port";
import { TagNewFile } from "./tag-new-file";

const FILES_PATH = ["/path/1", "/path/2"];

describe("TagNewFile Use Case", () => {
    const mockAdapter = { tagFile: jest.fn() } as unknown as S3Port;
    const useCase = new TagNewFile(mockAdapter);

    it("calls adapter with status tag as not imported", () => {
        useCase.execute(FILES_PATH[0]);
        expect(mockAdapter.tagFile).toHaveBeenCalledWith(FILES_PATH[0], { name: "status", value: "not-imported" });
    });
});
