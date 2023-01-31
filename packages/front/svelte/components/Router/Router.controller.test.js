import RouterController from "./Router.controller";
import * as routerService from "../../services/router.service";
import authService from "@resources/auth/auth.service";

describe("RouterController", () => {
    let controller;

    beforeEach(() => {
        controller = new RouterController();
    });

    describe("loadRoute", () => {
        const getRouteMock = jest.spyOn(routerService, "getRoute").mockReturnValue({
            needAuthentification: false,
            segments: [],
            component: jest.fn()
        });
        const goToUrlMock = jest.spyOn(routerService, "goToUrl").mockReturnValue(null);
        const getPropsMock = jest.spyOn(routerService, "getProps").mockResolvedValue({});
        const buildBreadcrumbsMock = jest.spyOn(routerService, "buildBreadcrumbs").mockReturnValue([]);
        const getCurrentUserMock = jest.spyOn(authService, "getCurrentUser").mockResolvedValue({});
        let getQueryParamsMock;

        beforeEach(() => {
            getQueryParamsMock = jest.spyOn(controller, "getQueryParams").mockReturnValue({});
        });

        afterAll(() => {
            getRouteMock.mockRestore();
            goToUrlMock.mockRestore();
            getPropsMock.mockRestore();
            buildBreadcrumbsMock.mockRestore();
            getCurrentUserMock.mockRestore();
            getQueryParamsMock.mockRestore();
        });

        it("should be call get route", () => {
            const expected = [{}, "path"];
            controller.loadRoute(expected[1], "");

            expect(getRouteMock).toHaveBeenCalledWith(...expected);
        });

        it("should be call getQueryParams", () => {
            const expected = "searchQuery";
            controller.loadRoute("", expected);

            expect(getQueryParamsMock).toHaveBeenCalledWith(expected);
        });

        it("should be call buildBreadcrumbs", () => {
            const expected = "path";
            controller.loadRoute(expected, "");

            expect(buildBreadcrumbsMock).toHaveBeenCalledWith(expected);
        });

        it("should be call getProps", () => {
            const expected = ["path", []];
            controller.loadRoute(expected[0], "");

            expect(getPropsMock).toHaveBeenCalledWith(...expected);
        });

        it("should be call component", () => {
            const mockedCoponent = jest.fn();

            getRouteMock.mockReturnValueOnce({
                needAuthentification: false,
                segments: [],
                component: mockedCoponent
            });

            controller.loadRoute("path", "");

            expect(mockedCoponent).toHaveBeenCalledTimes(1);
        });

        it("should be call getCurrentUser", () => {
            getRouteMock.mockReturnValueOnce({ needAuthentification: true });

            controller.loadRoute("", "");

            expect(getCurrentUserMock).toHaveBeenCalledTimes(1);
        });

        it("should be call goToUrl with params: '/auth/login'", () => {
            const expected = "/auth/login";
            getRouteMock.mockReturnValueOnce({ needAuthentification: true });

            controller.loadRoute("", "");

            expect(goToUrlMock).toHaveBeenCalledWith(expected);
        });

        it("should be call goToUrl with params: '/'", () => {
            const expected = "/";
            getRouteMock.mockReturnValueOnce({ needAuthentification: true });
            getCurrentUserMock.mockReturnValueOnce({ _id: "ID", roles: ["user"] });

            controller.loadRoute("/admin/list", "");

            expect(goToUrlMock).toHaveBeenCalledWith(expected);
        });

        it("should don't call goToUrl", () => {
            getRouteMock.mockReturnValueOnce({ needAuthentification: true, component: jest.fn() });
            getCurrentUserMock.mockReturnValueOnce({ _id: "ID", roles: ["user", "admin"] });

            controller.loadRoute("/admin/list", "");

            expect(goToUrlMock).toHaveBeenCalledTimes(0);
        });
    });

    describe("getQueryParams", () => {
        it("should return a query object", () => {
            const query = "?a=b&c=d";
            const expected = {
                a: "b",
                c: "d"
            };

            const actual = controller.getQueryParams(query);

            expect(actual).toEqual(expected);
        });
    });
});
