import axios from "axios";
import siretService from "../../../src/modules/external/siret.service";

describe("siret.service.ts", () => {
    describe("findBySiret", () => {
        it("should be called api", async () => {
            const fakeData = { id: "FAKE_DATA" }
            const mock = jest.spyOn(axios, "get").mockImplementationOnce(() => (Promise.resolve({data: fakeData})));

            const result = await siretService.findBySiret("SIRET_FAKE");

            expect(mock).toHaveBeenCalled();
            expect(result).toBe(fakeData)
        });

        it("should return null if error", async () => {
            const mock = jest.spyOn(axios, "get").mockImplementationOnce(() => Promise.reject("ERROR"));

            const result = await siretService.findBySiret("SIRET_FAKE");

            expect(mock).toHaveBeenCalled();
            expect(result).toBe(null)
        });
    });
});