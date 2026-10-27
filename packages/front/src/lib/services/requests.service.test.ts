import axios, { type AxiosResponse } from "axios";
import { NotFoundError } from "../errors";
import errorsService from "../errors/errors.service";
import { PUBLIC_DATASUB_URL } from "$env/static/public";
import requestsService from "$lib/services/requests.service";

vi.mock("axios");

describe("RequestService", () => {
    describe("constructor", () => {
        it("should set baseUrl", () => {
            expect(axios.defaults.baseURL).toBe(PUBLIC_DATASUB_URL);
        });
    });

    describe("http methods", () => {
        let _sendRequestMock;

        beforeAll(() => {
            _sendRequestMock = vi.spyOn(requestsService, "_sendRequest").mockResolvedValue({} as AxiosResponse);
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

                expect(_sendRequestMock).toHaveBeenCalledWith("get", expectedPath, expectedParam, undefined, undefined);
            });
        });

        describe("post", () => {
            it("should call _sendRequest", async () => {
                const expectedPath = "POST_PATH";
                const expectedBody = { test: true };
                await requestsService.post(expectedPath, expectedBody);

                expect(_sendRequestMock).toHaveBeenCalledWith("post", expectedPath, undefined, expectedBody, undefined);
            });
        });

        describe("patch", () => {
            it("should call _sendRequest", async () => {
                const expectedPath = "POST_PATH";
                const expectedBody = { test: true };
                await requestsService.patch(expectedPath, expectedBody);

                expect(_sendRequestMock).toHaveBeenCalledWith(
                    "patch",
                    expectedPath,
                    undefined,
                    expectedBody,
                    undefined,
                );
            });
        });

        describe("delete", () => {
            it("should call _sendRequest", async () => {
                const expectedPath = "DELETE_PATH";
                const expectedParam = { test: true };
                await requestsService.delete(expectedPath, expectedParam);

                expect(_sendRequestMock).toHaveBeenCalledWith(
                    "delete",
                    expectedPath,
                    expectedParam,
                    undefined,
                    undefined,
                );
            });
        });
    });

    describe("_sendRequest", () => {
        const SomeError = NotFoundError;
        let axiosRequestMock;
        let errorServiceMock;

        beforeAll(() => {
            axiosRequestMock = vi.spyOn(axios, "request").mockResolvedValue({ response: { status: 200 } });
            errorServiceMock = vi
                .spyOn(errorsService, "axiosErrorToError")
                .mockReturnValue(new SomeError({ message: "", status: 404 }, {}));
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

        it("should set multipart/form-data header when data is FormData", async () => {
            const formData = new FormData();
            formData.append("file", new Blob(["test"]));

            await requestsService._sendRequest("post", "/path/to", null, formData);

            expect(axiosRequestMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    headers: expect.objectContaining({
                        "Content-Type": "multipart/form-data",
                    }),
                }),
            );
        });

        it("should not set Content-Type header when data is not FormData", async () => {
            const jsonData = { test: true };

            await requestsService._sendRequest("post", "/path/to", null, jsonData);

            expect(axiosRequestMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    headers: {},
                }),
            );
        });
    });
});
