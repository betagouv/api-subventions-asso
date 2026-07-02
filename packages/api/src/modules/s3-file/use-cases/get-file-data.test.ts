import { S3Port } from "../../../adapters/outputs/s3/s3.port";
import { GetFileData } from "./get-file-data";

describe("GetFileData Use Case", () => {
    const mockAdapter = { getFile: jest.fn() };
    const useCase = new GetFileData(mockAdapter as unknown as S3Port);

    const PATH = "/provider/chorus/2025/chorus-data.xlsx";

    it("calls adapter to get data", async () => {
        await useCase.execute(PATH);
        expect(mockAdapter.getFile).toHaveBeenCalledWith(PATH);
    });

    it("returns file's data", () => {
        const PROMISE_DATA = Promise.resolve("Data");
        mockAdapter.getFile.mockResolvedValue(PROMISE_DATA);
        const expected = PROMISE_DATA;
        const actual = useCase.execute(PATH);
        expect(actual).toEqual(expected);
    });
});
