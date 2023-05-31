import * as routerService from "../../services/router.service";
import RouterController from "./Router.controller";
import authService from "@resources/auth/auth.service";

describe("RouterController", () => {
    let controller;

    beforeEach(() => {
        controller = new RouterController({});
    });

    describe("loadRoute", () => {
        const getRouteMock = jest.spyOn(routerService, "getRoute").mockReturnValue({
            disableAuth: true,
            segments: [],
            component: jest.fn(),
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

        it("should call get route", () => {
            const expected = [{}, "path"];
            controller.loadRoute(expected[1], "");

            expect(getRouteMock).toHaveBeenCalledWith(...expected);
        });

        it("should call getQueryParams", () => {
            const expected = "searchQuery";
            controller.loadRoute("", expected);

            expect(getQueryParamsMock).toHaveBeenCalledWith(expected);
        });

        it("should not add query in props", () => {
            const expected = undefined;
            controller.loadRoute("", undefined);
            const actual = controller.props.query;

            expect(actual).toEqual(expected);
        });

        it("should call buildBreadcrumbs", () => {
            const expected = "path";
            controller.loadRoute(expected, "");

            expect(buildBreadcrumbsMock).toHaveBeenCalledWith(expected);
        });

        it("should call getProps", () => {
            const expected = ["path", []];
            controller.loadRoute(expected[0], "");

            expect(getPropsMock).toHaveBeenCalledWith(...expected);
        });

        it("should call component", () => {
            const mockedComponent = jest.fn();

            getRouteMock.mockReturnValueOnce({
                disableAuth: true,
                segments: [],
                component: mockedComponent,
            });

            controller.loadRoute("path", "");

            expect(mockedComponent).toHaveBeenCalledTimes(1);
        });

        it("should call getCurrentUser", () => {
            getRouteMock.mockReturnValueOnce({ disableAuth: false });

            controller.loadRoute("", "");

            expect(getCurrentUserMock).toHaveBeenCalledTimes(1);
        });

        it("should call goToUrl with params: '/auth/login' plus search query", () => {
            const expected = "/auth/login?url=%2Ftada";

            const oldLocation = window.location;
            delete window.location;
            window.location = new URL(`${oldLocation.origin}/tada`);

            getRouteMock.mockReturnValueOnce({ disableAuth: false });

            controller.loadRoute("", "");

            delete window.location;
            window.location = oldLocation;

            expect(goToUrlMock).toHaveBeenCalledWith(expected);
        });

        it("should call goToUrl with params: '/'", () => {
            const expected = "/";
            getRouteMock.mockReturnValueOnce({ disableAuth: false });
            getCurrentUserMock.mockReturnValueOnce({ _id: "ID", roles: ["user"] });

            controller.loadRoute("/admin/list", "");

            expect(goToUrlMock).toHaveBeenCalledWith(expected);
        });

        it("should not call goToUrl if user has enough roles", () => {
            getRouteMock.mockReturnValueOnce({ disableAuth: false, component: jest.fn() });
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
                c: "d",
            };

            const actual = controller.getQueryParams(query);

            expect(actual).toEqual(expected);
        });
    });
});
