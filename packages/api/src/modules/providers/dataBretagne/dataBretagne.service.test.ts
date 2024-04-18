import dataBretagneService from "./dataBretagne.service";
import dataBretagnePort from "../../../dataProviders/api/dataBretagne/dataBretagne.port";
jest.mock("../../../dataProviders/api/dataBretagne/dataBretagne.port");
import bopPort from "../../../dataProviders/db/bop/bop.port";
jest.mock("../../../dataProviders/db/bop/bop.port");
import { buildId } from "../../../shared/helpers/MongoHelper";
import { PROGRAMMES } from "../../../dataProviders/api/dataBretagne/__fixtures__/DataBretagneProgrammes";
jest.mock("../../../shared/helpers/MongoHelper");

describe("Data Bretagne Service", () => {
    beforeAll(() => {
        jest.mocked(dataBretagnePort.getProgrammes).mockResolvedValue(PROGRAMMES);
    });

    describe("update", () => {
        it("should call dataBretagnePort.getProgramme", async () => {
            await dataBretagneService.update();
            // expect();
        });
        it("should call MongoHelper.buildId()", async () => {
            await dataBretagneService.update();
        });
        it("should call bopPort.replace", async () => {
            await dataBretagneService.update();
        });
    });
});
