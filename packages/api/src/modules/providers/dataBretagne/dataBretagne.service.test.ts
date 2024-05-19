import dataBretagneService from "./dataBretagne.service";
import dataBretagnePort from "../../../dataProviders/api/dataBretagne/dataBretagne.port";
jest.mock("../../../dataProviders/api/dataBretagne/dataBretagne.port");
import programmePort from "../../../dataProviders/db/programme/programme.port";
jest.mock("../../../dataProviders/db/programme/programme.port");
import { PROGRAMMES } from "../../../dataProviders/api/dataBretagne/__fixtures__/DataBretagneProgrammes";
import ProgrammeAdapter from "../../../dataProviders/db/programme/programme.adapter";
jest.mock("../../../dataProviders/db/programme/programme.adapter");

describe("Data Bretagne Service", () => {
    beforeAll(() => {
        jest.mocked(dataBretagnePort.getProgrammes).mockResolvedValue(PROGRAMMES);
    });

    describe("update", () => {
        it("should call dataBretagnePort.getProgramme", async () => {
            await dataBretagneService.update();
            expect(jest.mocked(dataBretagnePort.getProgrammes)).toHaveBeenCalledTimes(1);
        });

        it("should call programmePort.replace", async () => {
            await dataBretagneService.update();
            expect(jest.mocked(programmePort).replace).toHaveBeenCalledTimes(1);
        });

        it("should call ProgrammerAdapter.toDbo", async () => {
            await dataBretagneService.update();
            expect(jest.mocked(ProgrammeAdapter).toDbo).toHaveBeenCalledTimes(PROGRAMMES.length);
        });

        it("should throw error if no programmes", async () => {
            jest.mocked(dataBretagnePort.getProgrammes).mockResolvedValueOnce([]);
            expect(() => dataBretagneService.update()).rejects.toThrowError("Unhandled error from API Data Bretagne");
        });
    });
});
