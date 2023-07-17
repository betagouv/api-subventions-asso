import associationPort from "./association.port";
import requestsService from "@services/requests.service";

jest.mock("@services/requests.service");

describe("AssociationPort", () => {
    requestsService.get.mockImplementation(() => ({ catch: jest.fn() }));
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
            expect(requestsService.get).toHaveBeenCalledWith(expected);
        });

        it("return association from requestsService result", async () => {
            const expected = "";
            const RES = { data: { association: expected } };
            requestsService.get.mockResolvedValueOnce(RES);
            const actual = await associationPort.getByIdentifier(SIREN);
            expect(actual).toBe(expected);
        });
    });

    describe("search", () => {
        it("calls requestsService get", async () => {
            const expected = `/search/associations/${SIREN}`;
            await associationPort.search(SIREN);
            expect(requestsService.get).toHaveBeenCalledWith(expected);
        });

        it("return association list from requestsService result", async () => {
            const expected = [];
            const RES = { data: { result: expected } };
            requestsService.get.mockResolvedValueOnce(RES);
            const actual = await associationPort.search(SIREN);
            expect(actual).toBe(expected);
        });
    });
});
