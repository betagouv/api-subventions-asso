import axios from "axios";
import { DATASUB_URL } from "$env/static/public"
import { NotFoundError } from "../errors";
import errorsService from "../errors/errors.service";
import requestsService from "$lib/services/requests.service";

describe("RequestService", () => {
    describe("constructor", () => {
        it("should set baseUrl", () => {
            expect(axios.defaults.baseURL).toBe(DATASUB_URL);
        });
    });

    describe("http methods", () => {
        let _sendRequestMock;

        beforeAll(() => {
            _sendRequestMock = jest.spyOn(requestsService, "_sendRequest").mockResolvedValue();
        });
        afterAll(() => {
            _sendRequestMock.mockRestore();
        });

        afterEach(() => {
            _sendRequestMock.mockClear();
        });

        describe("get", () => {
            it("should call _sendRequest", async () => {
                const expectedPath = "GET_PATH";
                const expectedParam = { test: true };
                await requestsService.get(expectedPath, expectedParam);

                expect(_sendRequestMock).toHaveBeenCalledWith("get", expectedPath, expectedParam);
            });
        });

        describe("post", () => {
            it("should call _sendRequest", async () => {
                const expectedPath = "POST_PATH";
                const expectedBody = { test: true };
                await requestsService.post(expectedPath, expectedBody);

                expect(_sendRequestMock).toHaveBeenCalledWith("post", expectedPath, undefined, expectedBody);
            });
        });

        describe("delete", () => {
            it("should call _sendRequest", async () => {
                const expectedPath = "DELETE_PATH";
                const expectedParam = { test: true };
                await requestsService.delete(expectedPath, expectedParam);

                expect(_sendRequestMock).toHaveBeenCalledWith("delete", expectedPath, expectedParam);
            });
        });
    });

    describe("initAuthentication", () => {
        it("should defaults auth header", () => {
            const expected = "TOKEN";
            requestsService.initAuthentication(expected);

            expect(axios.defaults.headers.common["x-access-token"]).toBe(expected);
        });
    });

    describe("addErrorHooks", () => {
        it("should add hooks in errorHooks array", () => {
            const expected = jest.fn();
            requestsService.addErrorHook(NotFoundError, expected);

            expect(requestsService._errorHooks).toEqual([
                expect.objectContaining({
                    ErrorClass: NotFoundError,
                    callback: expected,
                }),
            ]);
        });
    });

    describe("_sendRequest", () => {
        const SomeError = NotFoundError;
        let axiosRequestMock;
        let errorServiceMock;

        beforeAll(() => {
            axiosRequestMock = jest.spyOn(axios, "request").mockResolvedValue();
            errorServiceMock = jest.spyOn(errorsService, "axiosErrorToError").mockReturnValue(SomeError);
        });

        afterAll(() => {
            axiosRequestMock.mockRestore();
            errorServiceMock.mockRestore();
        });

        it("should call axios with good params", async () => {
            const type = "get";
            const path = "path/to";
            const params = { query: true };
            const data = { body: true };

            await requestsService._sendRequest(type, path, params, data);

            expect(axiosRequestMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    url: path,
                    method: type,
                    data,
                    params,
                }),
            );
        });
    });

    describe("_errorCatcher", () => {
        const SomeError = NotFoundError;
        let errorServiceMock;

        beforeAll(() => {
            errorServiceMock = jest.spyOn(errorsService, "axiosErrorToError").mockReturnValue(SomeError);
        });

        afterAll(() => {
            errorServiceMock.mockRestore();
        });

        it("should throw SomeError", () => {
            const fakeError = {
                response: {
                    data: {
                        message: "",
                        code: "",
                    },
                },
            };

            expect(() => requestsService._errorCatcher(fakeError)).toThrowError(SomeError);
        });

        it("should call hooks", async () => {
            const fakeError = {
                response: {
                    data: {
                        message: "",
                        code: "",
                    },
                },
            };

            const callback = jest.fn();

            requestsService._errorHooks.push({
                ErrorClass: SomeError,
                callback,
            });

            try {
                requestsService._errorCatcher(fakeError);
            } catch {
                expect(callback).toBeCalledTimes(1);
            }
        });
    });
});
