vi.mock("svelte");
import type { MainInfoBannerDto } from "dto";
import { MainInfoBannerController } from "./MainInfoBanner.controller";
import configurationsService from "$lib/resources/configurations/configurations.service";

describe("MainInfoBannerController", () => {
    let controller;

    beforeEach(() => {
        controller = new MainInfoBannerController();
    });
    describe("init", () => {
        const configurationsServiceMock = vi.spyOn(configurationsService, "getMainInfoBanner");
        it("should call configurationsService", async () => {
            await controller.init();
            const expected = {};
            configurationsServiceMock.mockImplementationOnce(async () => expected);
            expect(configurationsServiceMock).toHaveBeenCalledTimes(1);
        });
    });

    describe("close()", () => {
        beforeEach(() => {
            controller.component = { $destroy: vi.fn() };
        });
        it("should destroy component", () => {
            controller.close();
            expect(controller.component.$destroy).toHaveBeenCalledTimes(1);
        });
    });
});
