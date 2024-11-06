import { AxiosResponse } from "axios";
import associationPort from "./association.port";
import requestsService from "$lib/services/requests.service";
vi.mock("$lib/services/requests.service");
const mockedRequestService = vi.mocked(requestsService);

describe("AssociationPort", () => {
    // @ts-expect-error: mock
    mockedRequestService.get.mockResolvedValue({ data: {} });
    const SIREN = "SIREN";

    describe("getResource", () => {
        it("should call requestService", async () => {
            await associationPort.getResource(SIREN, "resource");
            expect(mockedRequestService.get).toHaveBeenCalledWith(`/association/${SIREN}/resource`);
        });
    });

    describe("GET method", () => {
        const mockGetResource = vi.spyOn(associationPort, "getResource");

        beforeAll(() => {
            // @ts-expect-error: mock empty axios response
            mockGetResource.mockResolvedValue({ data: {} });
        });

        afterAll(() => {
            mockGetResource.mockRestore();
        });

        describe("incExtractData", () => {
            it("should call requestsService with association in path", async () => {
                await associationPort.incExtractData(SIREN);
                expect(mockGetResource).toHaveBeenCalledWith(SIREN, "extract-data");
            });
        });

        describe("getByIdentifier", () => {
            it("calls getResource", async () => {
                await associationPort.getByIdentifier(SIREN);
                expect(mockGetResource).toHaveBeenCalledWith(SIREN);
            });

            it("return association from requestsService result", async () => {
                const expected = "";
                const RES = { data: { association: expected } };
                // @ts-expect-error: mock
                mockGetResource.mockResolvedValueOnce(RES);
                const actual = await associationPort.getByIdentifier(SIREN);
                expect(actual).toBe(expected);
            });
        });

        describe("getGrants", () => {
            it("calls getResource", async () => {
                await associationPort.getGrants(SIREN);
                expect(mockGetResource).toHaveBeenCalledWith(SIREN, "grants");
            });

            it("should return subventions", async () => {
                const expected = [];
                mockGetResource.mockResolvedValueOnce({ data: { subventions: expected } } as AxiosResponse);
                const actual = await associationPort.getGrants(SIREN);
                expect(actual).toEqual(expected);
            });
        });
    });

    describe("search", () => {
        it("calls requestsService get", async () => {
            const expected = `/search/associations/${SIREN}?page=2`;
            await associationPort.search(SIREN, 2);
            expect(mockedRequestService.get).toHaveBeenCalledWith(expected);
        });

        it("calls requestsService get with default page", async () => {
            const expected = `/search/associations/${SIREN}?page=1`;
            await associationPort.search(SIREN);
            expect(mockedRequestService.get).toHaveBeenCalledWith(expected);
        });

        it("return paginated associations from requestsService result", async () => {
            const expected = {};
            const RES = { data: expected };
            // @ts-expect-error: mock
            mockedRequestService.get.mockResolvedValueOnce(RES);
            const actual = await associationPort.search(SIREN);
            expect(actual).toBe(expected);
        });
    });
});
