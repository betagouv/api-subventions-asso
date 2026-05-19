vi.mock("svelte");
import { MainInfoBannerController } from "./MainInfoBanner.controller";
import configurationsService from "$lib/resources/configurations/configurations.service";
import { unmount } from "svelte";

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
        it("should unmount component", () => {
            controller.close();
            expect(unmount).toHaveBeenCalledTimes(1);
        });
    });
});
