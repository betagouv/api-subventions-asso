vi.mock("svelte");
import { MainInfoBannerController } from "./MainInfoBanner.controller";

describe("MainInfoBannerController", () => {
    let controller;

    beforeEach(() => {
        controller = new MainInfoBannerController();
        controller.init();
    });

    // eslint-disable-next-line vitest/no-commented-out-tests
    /*describe("class props", () => {
        it("should contain linkUrl", () => {
            const expected = expect.any(String); // "/user/profile"; // TODO clean in #2544
            const actual = controller.linkUrl;
            expect(actual).toEqual(expected);
        });
    });*/

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
