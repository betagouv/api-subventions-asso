import providerRequestService from "./providerRequest.service";
import axios, { AxiosResponse, AxiosError } from "axios";
import providerRequestRepository from "./repositories/providerRequest.repository";

jest.mock("axios");
jest.mock("./repositories/providerRequest.repository");

describe("ProviderRequestService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should send a GET request", async () => {
        const url = "https://example.com";
        const option = {
            providerName: "ExampleProvider",
            // Other request options
        };

        // Mock Axios to return a response
        const mockResponse = { status: 200, data: "Response Data" };
        (axios.request as jest.Mock).mockResolvedValue(mockResponse);

        const result = await providerRequestService.get(url, option);

        expect(axios.request).toHaveBeenCalledWith({
            method: "GET",
            url,
        });

        // Add more assertions to check the result
    });

    it("should send a POST request", async () => {
        const url = "https://example.com";
        const option = {
            providerName: "ExampleProvider",
            // Other request options
        };

        // Mock Axios to return a response
        const mockResponse = { status: 200, data: "Response Data" };
        (axios.request as jest.Mock).mockResolvedValue(mockResponse);

        const result = await providerRequestService.post(url, option);

        expect(axios.request).toHaveBeenCalledWith({
            method: "POST",
            url,
        });

        // Add more assertions to check the result
    });

    it("should create a log for successful requests", async () => {
        const url = "https://example.com";
        const option = {
            providerName: "ExampleProvider",
            // Other request options
        };

        // Mock Axios to return a response
        const mockResponse = { status: 200, data: "Response Data" };
        (axios.request as jest.Mock).mockResolvedValue(mockResponse);

        // Mock providerRequestRepository.create to do nothing
        (providerRequestRepository.create as jest.Mock).mockResolvedValue(undefined);

        await providerRequestService.get(url, option);

        // Check if createLog was called with the expected arguments
        expect(providerRequestRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({
                providerName: option.providerName,
                route: url,
                responseCode: mockResponse.status,
                type: "GET",
            }),
        );

        // Add more assertions as needed
    });

    it("should create a log for failed requests", async () => {
        const url = "https://example.com";
        const option = {
            providerName: "ExampleProvider",
            // Other request options
        };

        // Mock Axios to throw an error
        const mockError = { status: 404, message: "Not Found" };
        (axios.request as jest.Mock).mockRejectedValue(mockError);

        // Mock providerRequestRepository.create to do nothing
        (providerRequestRepository.create as jest.Mock).mockResolvedValue(undefined);

        // Ensure that the error status is set
        mockError.status = 404;

        try {
            await providerRequestService.get(url, option);
        } catch (error) {
            // Check if createLog was called with the expected arguments
            expect(providerRequestRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    providerName: option.providerName,
                    route: url,
                    responseCode: mockError.status,
                    type: "GET",
                }),
            );
        }

        // Add more assertions as needed
    });
});
