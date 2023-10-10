import { exec } from "child_process";

jest.mock("child_process", () => ({
    exec: jest.fn((path, cb) => cb())
}));

import DecompressHistoryUniteLegalUseCase from "./DecompressHistoryUniteLegalUseCase";

describe("DecompressHistoryUniteLegalUseCase", () => {
    it("should call exec with file path", async () => {
        const path = "Fake/path";
        
        await DecompressHistoryUniteLegalUseCase(path);

        expect(exec).toHaveBeenCalledWith(`unzip ${path} -d ./output`, expect.any(Function));
    })

    it('should return uncompress file path', async () => {
        const path = "Fake/path";
        const expected = "./output/StockUniteLegaleHistorique_utf8.csv";
        
        const acutal = await DecompressHistoryUniteLegalUseCase(path);

        expect(acutal).toBe(expected);
    })
});