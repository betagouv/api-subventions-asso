import { S3Port } from "../../../adapters/outputs/s3/s3.port";
import { TagImportedFile } from "./tag-imported-file";

const FILES_PATH = ["/path/1", "/path/2"];

describe("TagImportedFile", () => {
    const mockAdapter = { tagFile: jest.fn() } as unknown as S3Port;
    const useCase = new TagImportedFile(mockAdapter);

    it("calls adapter with status tag as imported", () => {
        useCase.execute(FILES_PATH[0]);
        expect(mockAdapter.tagFile).toHaveBeenCalledWith(FILES_PATH[0], { name: "status", value: "imported" });
    });
});
