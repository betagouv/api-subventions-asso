import axios, { AxiosError, AxiosResponse } from "axios";
import providerRequestService from "./providerRequest.service";

jest.mock("axios");
jest.mock("./repositories/providerRequest.repository");

describe("providerRequestService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should send a GET request and create a log", async () => {
        const mockResponse: AxiosResponse = { status: 200, data: {} } as unknown as AxiosResponse;
        (axios.request as jest.Mock).mockResolvedValue(mockResponse);

        // Mock providerRequestService.create
        const createLogMock = jest.spyOn(providerRequestService, "createLog").mockResolvedValue(undefined);

        const providerName = "TestProvider";
        const url = "https://example.com/api";
        const headers = { Authorization: "Bearer Token" };
        const params = { param1: "value1" };

        const response = await providerRequestService.get(url, params, headers, providerName);

        expect(response).toEqual(mockResponse);
        expect(axios.request).toHaveBeenCalledWith({
            method: "GET",
            url,
            headers,
            params,
        });

        // Verify that providerRequestService.create is called
        expect(createLogMock).toHaveBeenCalledWith(providerName, url, expect.any(Date), mockResponse.status, "GET");
    });

    it("should send a POST request and create a log", async () => {
        const mockResponse: AxiosResponse = { status: 201, data: {} } as unknown as AxiosResponse;
        (axios.request as jest.Mock).mockResolvedValue(mockResponse);

        // Mock providerRequestService.create
        const createLogMock = jest.spyOn(providerRequestService, "createLog").mockResolvedValue(undefined);

        const providerName = "TestProvider";
        const url = "https://example.com/api";
        const headers = { Authorization: "Bearer Token" };
        const params = { param1: "value1" };
        const body = { key: "value" };

        const response = await providerRequestService.post(url, params, headers, body, providerName);

        expect(response).toEqual(mockResponse);
        expect(axios.request).toHaveBeenCalledWith({
            method: "POST",
            url,
            headers,
            params,
            data: body,
        });

        // Verify that providerRequestRepository.create is called
        expect(createLogMock).toHaveBeenCalledWith(providerName, url, expect.any(Date), mockResponse.status, "POST");
    });
});
