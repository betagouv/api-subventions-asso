import scdlService from "../modules/providers/scdl/scdl.service";
jest.mock("../modules/providers/scdl/scdl.service");
import dataBretagneService from "../modules/providers/dataBretagne/dataBretagne.service";
jest.mock("../modules/providers/dataBretagne/dataBretagne.service");
import { initAsync } from "./initAsync";

describe("initAsync", () => {
    it.each`
        service
        ${scdlService}
        ${dataBretagneService}
    `("should init $service", async ({ service }) => {
        await initAsync();
        expect(service.init).toHaveBeenCalled();
    });
});
