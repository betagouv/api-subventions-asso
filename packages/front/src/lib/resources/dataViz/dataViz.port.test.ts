import type { AmountsVsProgramRegionDto } from "dto";
import dataVizPort from "./dataViz.port";
import requestsService from "$lib/services/requests.service";

vi.mock("$lib/services/requests.service");
const mockedRequestService = vi.mocked(requestsService);

const EXPECTED_DATA = [
    {
        exerciceBudgetaire: 2022,
        montant: 1000,
        programme: "121 - nom du programme",
        regionAttachementComptable: "Normandie",
        mission: "nom de la mission",
    },
] as AmountsVsProgramRegionDto[];
const RES = { data: { amountsVersusProgramRegionData: EXPECTED_DATA } };

describe("DataVizPort", () => {
    describe("getResource", () => {
        it("should call requestService", async () => {
            await dataVizPort.getResource("resource");
            expect(mockedRequestService.get).toHaveBeenCalledWith(`/dataviz/resource`);
        });
    });

    describe("GET methods", () => {
        const mockGetResource = vi.spyOn(dataVizPort, "getResource");

        beforeAll(() => {
            // @ts-expect-error: mock empty axios response
            mockGetResource.mockResolvedValue(RES);
        });

        afterAll(() => {
            mockGetResource.mockRestore();
        });

        describe("getAmountsVsProgramRegion", () => {
            it("should call getResource", async () => {
                await dataVizPort.getAmountsVsProgramRegion();
                expect(mockGetResource).toHaveBeenCalledWith("montant-versus-programme-region");
            });

            it("should return data from requestsService result", async () => {
                const actual = await dataVizPort.getAmountsVsProgramRegion();
                expect(actual).toBe(EXPECTED_DATA);
            });

            it("should throw error if no data found", async () => {
                // @ts-expect-error: mock empty axios response
                mockGetResource.mockResolvedValueOnce({ data: {} });
                await expect(dataVizPort.getAmountsVsProgramRegion()).rejects.toThrow("No data found");
            });

            it("should throw error if data array is empty", async () => {
                // @ts-expect-error: mock empty list
                mockGetResource.mockResolvedValueOnce({ data: { amountsVersusProgramRegionData: [] } });
                await expect(dataVizPort.getAmountsVsProgramRegion()).rejects.toThrow("No data found");
            });
        });
    });
});
