import axios from "axios";
import rnaService from "../../../src/modules/external/rna.service";

describe("rna.service.ts", () => {
    describe("findByRna", () => {
        it("should be called api", async () => {
            const fakeData = { id: "FAKE_DATA" }
            const mock = jest.spyOn(axios, "get").mockImplementationOnce(() => (Promise.resolve({data: fakeData})));

            const result = await rnaService.findByRna("RNA_FAKE");

            expect(mock).toHaveBeenCalled();
            expect(result).toBe(fakeData)
        });

        it("should return null if error", async () => {
            const mock = jest.spyOn(axios, "get").mockImplementationOnce(() => Promise.reject("ERROR"));

            const result = await rnaService.findByRna("RNA_FAKE");

            expect(mock).toHaveBeenCalled();
            expect(result).toBe(null)
        });
    });

    describe("findBySiret", () => {
        it("should be called api", async () => {
            const fakeData = { id: "FAKE_DATA" }
            const mock = jest.spyOn(axios, "get").mockImplementationOnce(() => (Promise.resolve({data: fakeData})));

            const result = await rnaService.findBySiret("SIRET_FAKE");

            expect(mock).toHaveBeenCalled();
            expect(result).toBe(fakeData)
        });

        it("should return null if error", async () => {
            const mock = jest.spyOn(axios, "get").mockImplementationOnce(() => Promise.reject("ERROR"));

            const result = await rnaService.findBySiret("SIRET_FAKE");

            expect(mock).toHaveBeenCalled();
            expect(result).toBe(null)
        });
    });
});