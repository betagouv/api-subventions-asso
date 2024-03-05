import { SvelteComponent } from "svelte";
vi.mock("svelte");
import { MainInfoBannerController } from "./MainInfoBanner.controller";

describe("MainInfoBannerController", () => {
    let controller;

    beforeEach(() => {
        controller = new MainInfoBannerController();
    });

    describe("class props", () => {
        it("should contain linkUrl", () => {
            const expected = "/user/profile";
            const actual = controller.linkUrl;
            expect(actual).toEqual(expected);
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
