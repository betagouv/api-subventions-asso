import { DataVizController } from "./DataViz.controller";
import dataVizService from "$lib/resources/dataViz/dataViz.service";
vi.mock("$lib/resources/dataViz/dataViz.service");
const mockedDataVizService = vi.mocked(dataVizService);

describe("DataVizController", () => {
    let controller: DataVizController;

    describe("constructor", () => {
        beforeEach(() => {
            controller = new DataVizController();
        });

        it("should call getAmountsVsProramme", async () => {
            await mockedDataVizService.getAmountsVsProgramRegion["amountsVsProgramRegionDataPromise"];
            expect(mockedDataVizService.getAmountsVsProgramRegion).toHaveBeenCalledTimes(1);
        });
    });
});
