import axios from "axios"
import qs from "qs";
import apiEntrepriseService from "./apiEntreprise.service";

describe("ApiEntrepriseService", () => {
    describe("sendRequest", () => {
        const axiosGetMock = jest.spyOn(axios, "get");
        const qsMock = jest.spyOn(qs, "stringify");

        it('should return data', async () => {
            const expected = { test: true };
            axiosGetMock.mockImplementationOnce(async () => ({
                status: 200,
                data: expected
            }))

            // @ts-expect-error sendRequest is private methode
            const actual = await apiEntrepriseService.sendRequest('test', {}, "");

            expect(expected).toBe(actual);
        })

        it("should return null (axios throw error)", async () => {
            const expected = null;
            axiosGetMock.mockImplementationOnce(async() => { throw new Error("ERROR") });

            // @ts-expect-error sendRequest is private methode
            const actual = await apiEntrepriseService.sendRequest('test', {}, "");

            expect(expected).toBe(actual);
        })

        it("should return null (axios status 404)", async () => {
            const expected = null;
            axiosGetMock.mockImplementationOnce(async() => ({
                status: 404,
                data: { test: true }
            }));

            // @ts-expect-error sendRequest is private methode
            const actual = await apiEntrepriseService.sendRequest('test', {}, "");

            expect(expected).toBe(actual);
        })

        it("should call queryString with default params", async () => {
            const expected = {
                context: "aides publiques",
                recipent: "12004101700035",
                object: 'TEST',
            };

            axiosGetMock.mockImplementationOnce(async() => ({
                status: 200,
                data: { test: true }
            }));

            qsMock.mockImplementationOnce(() => "QUERY");

            // @ts-expect-error sendRequest is private methode
            apiEntrepriseService.sendRequest('test', {}, expected.object);

            expect(qsMock).toHaveBeenCalledWith(expect.objectContaining(expected));
        })
    })
})