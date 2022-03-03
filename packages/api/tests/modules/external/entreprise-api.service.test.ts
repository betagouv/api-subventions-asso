import axios from "axios";
import entrepriseApiService from "../../../src/modules/external/entreprise-api.service";

describe("RNA", () => {
    describe("findRnaDataByRna", () => {
        it("should be called api", async () => {
            const fakeData = { id: "FAKE_DATA" }
            const mock = jest.spyOn(axios, "get").mockImplementationOnce(() => (Promise.resolve({data: fakeData})));

            const result = await entrepriseApiService.findRnaDataByRna("RNA_FAKE");

            expect(mock).toHaveBeenCalled();
            expect(result).toBe(fakeData)
        });

        it("should return null if error", async () => {
            const mock = jest.spyOn(axios, "get").mockImplementationOnce(() => Promise.reject("ERROR"));

            const result = await entrepriseApiService.findRnaDataByRna("RNA_FAKE");

            expect(mock).toHaveBeenCalled();
            expect(result).toBe(null)
        });
    });

    describe("findRnaDataBySiret", () => {
        it("should be called api", async () => {
            const fakeData = { id: "FAKE_DATA" }
            const mock = jest.spyOn(axios, "get").mockImplementationOnce(() => (Promise.resolve({data: fakeData})));

            const result = await entrepriseApiService.findRnaDataBySiret("SIRET_FAKE");

            expect(mock).toHaveBeenCalled();
            expect(result).toBe(fakeData)
        });

        it("should return null if error", async () => {
            const mock = jest.spyOn(axios, "get").mockImplementationOnce(() => Promise.reject("ERROR"));

            const result = await entrepriseApiService.findRnaDataBySiret("SIRET_FAKE");

            expect(mock).toHaveBeenCalled();
            expect(result).toBe(null)
        });
    });
});


describe("siret.service.ts", () => {
    describe("findSiretDataBySiret", () => {
        it("should be called api", async () => {
            const fakeData = { id: "FAKE_DATA" }
            const mock = jest.spyOn(axios, "get").mockImplementationOnce(() => (Promise.resolve({data: fakeData})));

            const result = await entrepriseApiService.findSiretDataBySiret("SIRET_FAKE");

            expect(mock).toHaveBeenCalled();
            expect(result).toBe(fakeData)
        });

        it("should return null if error", async () => {
            const mock = jest.spyOn(axios, "get").mockImplementationOnce(() => Promise.reject("ERROR"));

            const result = await entrepriseApiService.findSiretDataBySiret("SIRET_FAKE");

            expect(mock).toHaveBeenCalled();
            expect(result).toBe(null)
        });
    });
});