import { setContext } from "svelte";
vi.mock("svelte");
import type { SpyInstance } from "vitest";
import { AppController } from "./App.controller";
import * as Store from "$lib/core/Store";
vi.mock("$lib/core/Store");
import trackerService from "$lib/services/tracker.service";
vi.mock("$lib/services/tracker.service");
import * as constants from "$env/static/public";
vi.mock("$env/static/public");
import localStorageService from "$lib/services/localStorage.service";
vi.mock("$lib/services/localStorage.service");
import { page } from "$app/stores";
vi.mock("$app/stores");
import { connectedUser } from "$lib/store/user.store";
vi.mock("$lib/store/user.store");
import userService from "$lib/resources/users/user.service";
vi.mock("$lib/resources/users/user.service");

describe("AppController", () => {
    const ENV = "TEST";
    const mockSetter = vi.fn();
    let controller: AppController;
    const mockPageStoreValue = { url: { pathname: "/" } };
    const mockConnectedUserStoreValue = {};
    const mockSubscribe = vi.fn(callback => callback([mockPageStoreValue, mockConnectedUserStoreValue]));

    beforeAll(() => {
        vi.mocked(constants).ENV = ENV;
        vi.mocked(localStorageService).getItem.mockResolvedValue(new Store.default(true));
    });

    beforeEach(() => {
        Store.default.prototype.set = mockSetter;
        // @ts-expect-error: mock derived
        vi.mocked(Store.derived).mockReturnValue({
            subscribe: mockSubscribe,
        });
    });

    describe("constructor", () => {
        let mockHandleBannerDisplay: SpyInstance;
        beforeEach(() => {
            mockHandleBannerDisplay = vi
                .spyOn(AppController.prototype, "handleBannerDisplay")
                // @ts-expect-error: mock
                .mockImplementation(vi.fn());
            controller = new AppController();
        });
        afterEach(() => mockHandleBannerDisplay.mockRestore());
        it("should call initContext()", () => {
            expect(vi.mocked(setContext)).toHaveBeenCalledWith("app", expect.any(Object));
        });

        it("should call trackerService.init()", () => {
            expect(vi.mocked(trackerService).init).toHaveBeenCalledWith(ENV);
        });

        it("should subscribe to page and connectedUser stores", () => {
            expect(mockSubscribe).toHaveBeenCalled();
        });
    });

    describe("handleBannerDisplay", () => {
        // @ts-expect-error: not mandatory for the test
        const USER = {} as UserDto;

        beforeEach(() => {
            controller = new AppController();
        });

        it("should set displayBanner to false if on profile page", () => {
            controller.handleBannerDisplay("/user/profile", USER);
            expect(mockSetter).toHaveBeenCalledWith(false);
        });

        it("should call localStorageService", () => {
            controller.handleBannerDisplay("/", USER);
            expect(localStorageService.getItem).toHaveBeenCalledWith("hide-main-info-banner", false);
        });

        it("should set displayBanner to false from localStorage", () => {
            // @ts-expect-error: mock
            vi.mocked(localStorageService).getItem.mockReturnValueOnce({ value: false });
            controller.handleBannerDisplay("/", USER);
            expect(mockSetter).toHaveBeenCalledWith(true);
        });

        it("should set displayBanner to true from localStorage", () => {
            // @ts-expect-error: mock
            vi.mocked(localStorageService).getItem.mockReturnValueOnce({ value: "true" });
            controller.handleBannerDisplay("/", USER);
            expect(mockSetter).toHaveBeenCalledWith(false);
        });
    });
});
