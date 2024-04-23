import dataBretagneService from "./dataBretagne.service";
import dataBretagnePort from "../../../dataProviders/api/dataBretagne/dataBretagne.port";
jest.mock("../../../dataProviders/api/dataBretagne/dataBretagne.port");
import bopPort from "../../../dataProviders/db/bop/bop.port";
jest.mock("../../../dataProviders/db/bop/bop.port");
import { PROGRAMMES } from "../../../dataProviders/api/dataBretagne/__fixtures__/DataBretagneProgrammes";
import BopAdapter from "../../../dataProviders/db/bop/bop.adapter";
jest.mock("../../../dataProviders/db/bop/bop.adapter");

describe("Data Bretagne Service", () => {
    beforeAll(() => {
        jest.mocked(dataBretagnePort.getProgrammes).mockResolvedValue(PROGRAMMES);
    });

    describe("update", () => {
        it("should call dataBretagnePort.getProgramme", async () => {
            await dataBretagneService.update();
            expect(jest.mocked(dataBretagnePort.getProgrammes)).toHaveBeenCalledTimes(1);
        });

        it("should call bopPort.replace", async () => {
            await dataBretagneService.update();
            expect(jest.mocked(bopPort).replace).toHaveBeenCalledTimes(1);
        });

        it("should call BopAdapter.toDbo", async () => {
            await dataBretagneService.update();
            expect(jest.mocked(BopAdapter).toDbo).toHaveBeenCalledTimes(PROGRAMMES.length);
        });

        it("should throw error if no programmes", async () => {
            jest.mocked(dataBretagnePort.getProgrammes).mockResolvedValueOnce([]);
            expect(() => dataBretagneService.update()).rejects.toThrowError("Unhandled error from API Data Bretagne");
        });
    });
});
