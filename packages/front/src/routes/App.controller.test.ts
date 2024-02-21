import { setContext } from "svelte";
vi.mock("svelte");
import type { SpyInstance } from "vitest";
import { AppController } from "./App.controller";
import Store from "$lib/core/Store";
vi.mock("$lib/core/Store");
import trackerService from "$lib/services/tracker.service";
vi.mock("$lib/services/tracker.service");
import * as constants from "$env/static/public";
vi.mock("$env/static/public");
import localStorageService from "$lib/services/localStorage.service";
vi.mock("$lib/services/localStorage.service");
import { page } from "$app/stores";
vi.mock("$app/stores");

describe("AppController", () => {
    const ENV = "TEST";
    const mockSetter = vi.fn(() => console.log("spySetter"));
    let controller: AppController;

    beforeAll(() => {
        vi.mocked(constants).ENV = ENV;
    });

    beforeEach(() => {
        Store.prototype.set = mockSetter;
        controller = new AppController();
    });

    afterEach(() => {
        vi.mocked(setContext).mockReset();
    });

    describe("constructor", () => {
        it("should call initContext()", () => {
            expect(vi.mocked(setContext)).toHaveBeenCalledWith("app", expect.any(Object));
        });

        it("should call trackerService.init()", () => {
            expect(vi.mocked(trackerService).init).toHaveBeenCalledWith(ENV);
        });
    });

    describe("handleBannerDisplay", () => {
        it.only("should set displayBanner to false if on profile page", () => {
            controller.handleBannerDisplay("/user/profile");
            expect(mockSetter).toHaveBeenCalledWith(false);
        });

        it("should call localStorageService", () => {
            vi.mocked(localStorageService).getItem.mockResolvedValue(new Store(true));
            controller.handleBannerDisplay("/");
            expect(localStorageService.getItem).toHaveBeenCalledWith("hide-main-info-banner", true);
        });
    });
});
