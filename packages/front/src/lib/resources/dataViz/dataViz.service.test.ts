import type { AmountsVsProgramRegionDto } from "dto";
import dataVizService from "./dataViz.service";
import dataVizPort from "./dataViz.port";

vi.mock("./dataViz.port", () => ({
    default: {
        getAmountsVsProgramRegion: vi.fn(),
    },
}));

const mockedDataVizPort = vi.mocked(dataVizPort);

const EXPECTED_DATA = [
    {
        exerciceBudgetaire: 2022,
        montant: 1000,
        programme: "121 - nom du programme",
        regionAttachementComptable: "Normandie",
        mission: "nom de la mission",
    },
] as AmountsVsProgramRegionDto[];

describe("DataVizService", () => {
    beforeAll(() => {
        mockedDataVizPort.getAmountsVsProgramRegion.mockResolvedValue(EXPECTED_DATA);
    });

    describe("getAmountsVsProgramRegion", () => {
        it("should call getAmountsVsProgramRegion", async () => {
            await dataVizService.getAmountsVsProgramRegion();
            expect(mockedDataVizPort.getAmountsVsProgramRegion).toHaveBeenCalled();
        });

        it("should return result from getAmountsVsProgramRegion", async () => {
            const actual = await dataVizService.getAmountsVsProgramRegion();
            expect(actual).toBe(EXPECTED_DATA);
        });

        it("should throw error if dataVizPort throw error", async () => {
            mockedDataVizPort.getAmountsVsProgramRegion.mockRejectedValueOnce(new Error("No data found"));
            await expect(dataVizService.getAmountsVsProgramRegion()).rejects.toThrow("Aucune donnée trouvée");
        });
    });
});
