import associationPort from "./association.port";
import requestsService from "$lib/services/requests.service";
vi.mock("$lib/services/requests.service");
const mockedRequestService = vi.mocked(requestsService);

describe("AssociationPort", () => {
    // @ts-expect-error: mock
    mockedRequestService.get.mockResolvedValue({ data: {} });
    const SIREN = "SIREN";

    describe("incExtractData", () => {
        it("should call requestsService with association in path", async () => {
            const expected = `/association/${SIREN}/extract-data`;
            await associationPort.incExtractData(SIREN);
            expect(requestsService.get).toHaveBeenCalledWith(expected);
        });
    });

    describe("getByIdentifier", () => {
        it("calls requestsService get", async () => {
            const expected = `/association/${SIREN}`;
            await associationPort.getByIdentifier(SIREN);
            expect(mockedRequestService.get).toHaveBeenCalledWith(expected);
        });

        it("return association from requestsService result", async () => {
            const expected = "";
            const RES = { data: { association: expected } };
            // @ts-expect-error: mock
            mockedRequestService.get.mockResolvedValueOnce(RES);
            const actual = await associationPort.getByIdentifier(SIREN);
            expect(actual).toBe(expected);
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
