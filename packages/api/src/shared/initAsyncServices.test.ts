import scdlService from "../modules/providers/scdl/scdl.service";
jest.mock("../modules/providers/scdl/scdl.service");
import dataBretagneService from "../modules/providers/dataBretagne/dataBretagne.service";
jest.mock("../modules/providers/dataBretagne/dataBretagne.service");
import { initAsyncServices, refreshGrantAsyncServices } from "./initAsyncServices";

describe("initAsyncServices", () => {
    it.each`
        service
        ${scdlService}
        ${dataBretagneService}
    `("should init $service", async ({ service }) => {
        await initAsyncServices();
        expect(service.init).toHaveBeenCalled();
    });
});

describe("refreshGrantAsyncServices", () => {
    it("init again scdl service to update procuder names", async () => {
        await refreshGrantAsyncServices();
        expect(scdlService.init).toHaveBeenCalled();
    });
});
