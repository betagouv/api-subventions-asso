import axios from "axios";
import documentPort from "./documents.port";

vi.mock("axios");

describe("DocumentsPort", () => {
    beforeAll(() => axios.get.mockImplementation(() => Promise.resolve({ data: "" })));
    const DOC_URL = "/path";

    describe("search", () => {
        it("calls axios get", async () => {
            const expected = [DOC_URL, { responseType: "blob" }];
            await documentPort.getDauphinBlob(DOC_URL);
            expect(axios.get).toHaveBeenCalledWith(...expected);
        });

        it("return documents list from axios result", async () => {
            const expected = [];
            const RES = { data: expected };
            axios.get.mockResolvedValueOnce(RES);
            const actual = await documentPort.getDauphinBlob(DOC_URL);
            expect(actual).toBe(expected);
        });
    });
});
