import {
    AMOUNTS_VS_PROGRAMME_REGION_DBOS,
    AMOUNTS_VS_PROGRAMME_REGION_ENTITIES,
} from "../../../modules/dataViz/amountsVsProgrammeRegion/__fixtures__/amountsVSProgrammeRegion.fixture";
import amountsVsProgrammeRegionService from "../../../modules/dataViz/amountsVsProgrammeRegion/amountsVsProgrammeRegion.service";
import { AmountsVsProgrammeRegionHttp } from "./amountsVsProgrammeRegion.http";

const controller = new AmountsVsProgrammeRegionHttp();

const AMOUNTS_VS_PROGRAMME_REGION_DATA = AMOUNTS_VS_PROGRAMME_REGION_DBOS.map(({ _id, ...rest }) => rest);

describe("AmountsVsProgrammeRegionHttp", () => {
    let getAmountsVsProgrammeRegionSpy: jest.SpyInstance;
    beforeAll(() => {
        getAmountsVsProgrammeRegionSpy = jest
            .spyOn(amountsVsProgrammeRegionService, "getAmountsVsProgrammeRegion")
            .mockResolvedValue(AMOUNTS_VS_PROGRAMME_REGION_DATA);
    });

    afterAll(() => {
        getAmountsVsProgrammeRegionSpy.mockRestore();
    });

    describe("getAmountsVsProgrammeRegion", () => {
        it("should call service", async () => {
            await controller.getAmountsVsProgrammeRegion();
            expect(getAmountsVsProgrammeRegionSpy).toHaveBeenCalledTimes(1);
        });

        it("should return data", async () => {
            const expected = { montantVsProgrammeRegionData: AMOUNTS_VS_PROGRAMME_REGION_ENTITIES };
            const actual = await controller.getAmountsVsProgrammeRegion();
            expect(actual).toEqual(expected);
        });
    });
});
