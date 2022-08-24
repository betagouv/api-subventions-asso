import configurationsService from "./configurations.service";
import configurationsRepository from "./repositories/configurations.repository"

describe("ConfigurationService", () => {
    const getByNameMock: jest.SpyInstance<unknown> = jest.spyOn(configurationsRepository, "getByName");
    const upsertMock: jest.SpyInstance<unknown> = jest.spyOn(configurationsRepository, "upsert");

    describe("getDauphinToken", () => {

        it("should return token", async () => {
            const expected = { data: "TOKEN" };
            getByNameMock.mockImplementationOnce(async () => expected);

            const actual = await configurationsService.getDauphinToken();

            expect(actual).toEqual(expected);
        })

        it("should call repository with good name", async () => {
            const expected = "DAUPHIN-TOKEN";
            getByNameMock.mockImplementationOnce(async () => ({}));

            await configurationsService.getDauphinToken();

            expect(getByNameMock).toHaveBeenCalledWith(expected);
        })

        it("should retrun null", async () => {
            const expected = {data: null};
            getByNameMock.mockImplementationOnce(async () => (expected));

            const actual = await configurationsService.getDauphinToken();

            expect(actual).toEqual(expected);
        })
    });

    describe("setDauphinToken", () => {

        it("should set token", async () => {
            const expected = "TOKEN";
            upsertMock.mockImplementationOnce(async () => ({}));

            await configurationsService.setDauphinToken(expected);

            expect(upsertMock).toHaveBeenCalledWith("DAUPHIN-TOKEN", { data: expected });
        })
    });

    describe("getDauphinTokenAvailableTime", () => {

        it("should return token", async () => {
            const expected = { data: 1000 };
            getByNameMock.mockImplementationOnce(async () => expected);

            const actual = await configurationsService.getDauphinTokenAvailableTime();

            expect(actual).toEqual(expected);
        })

        it("should call repository with good name", async () => {
            const expected = "DAUPHIN-TOKEN-AVAILABLE";
            getByNameMock.mockImplementationOnce(async () => ({}));

            await configurationsService.getDauphinTokenAvailableTime();

            expect(getByNameMock).toHaveBeenCalledWith(expected);
        })

        it("should retrun null", async () => {
            const expected = {data: null};
            getByNameMock.mockImplementationOnce(async () => (expected));

            const actual = await configurationsService.getDauphinTokenAvailableTime();

            expect(actual).toEqual(expected);
        })
    });
})