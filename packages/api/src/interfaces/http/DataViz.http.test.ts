import amountsVsProgramRegionService from "../../modules/dataViz/amountsVsProgramRegion/amountsVsProgramRegion.service";
import { DataVizHttp } from "./DataViz.http";
import { AMOUNTS_VS_PROGRAM_REGION_ENTITIES } from "../../modules/dataViz/amountsVsProgramRegion/__fixtures__/amountsVSProgramRegion.fixture";
import { AmountsVsProgramRegionDto } from "dto";

const controller = new DataVizHttp();

describe("DataVizHttp", () => {
    const AmountsVsProgramRegionDtoList = AMOUNTS_VS_PROGRAM_REGION_ENTITIES as AmountsVsProgramRegionDto[];

    describe("getAmountsVsProgramRegion", () => {
        let getAmountsVsProgramRegionDataSpy = jest.spyOn(
            amountsVsProgramRegionService,
            "getAmountsVsProgramRegionData",
        );
        beforeAll(() => {
            getAmountsVsProgramRegionDataSpy.mockResolvedValue(AmountsVsProgramRegionDtoList);
        });

        it("should call service", async () => {
            await controller.getAmountsVsProgramRegion();
            expect(amountsVsProgramRegionService.getAmountsVsProgramRegionData).toHaveBeenCalledTimes(1);
        });

        it("should return data", async () => {
            const expected = { amountsVersusProgramRegionData: AmountsVsProgramRegionDtoList };
            const actual = await controller.getAmountsVsProgramRegion();
            expect(actual).toEqual(expected);
        });

        it("should throw error", async () => {
            const ERROR_MESSAGE = "Error";
            getAmountsVsProgramRegionDataSpy.mockImplementationOnce(() => Promise.reject(new Error(ERROR_MESSAGE)));
            expect(() => controller.getAmountsVsProgramRegion()).rejects.toThrowError(ERROR_MESSAGE);
        });
    });
});
