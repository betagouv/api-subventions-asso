import { AMOUNTS_VS_PROGRAMME_REGION_DBOS, AMOUNTS_VS_PROGRAMME_REGION_ENTITIES } from "../../../../modules/dataViz/amountsVsProgrammeRegion/__fixtures__/amountsVSProgrammeRegion.fixture";
import AmountsVsProgrammeRegionAdapter from "./amountsVsProgrammeRegion.adapter";
describe("AmountsVsProgrammeRegionAdapter", () => {

    describe("toDbo", () => {

        it.each([[AMOUNTS_VS_PROGRAMME_REGION_ENTITIES[0], AMOUNTS_VS_PROGRAMME_REGION_DBOS[0]],
            [AMOUNTS_VS_PROGRAMME_REGION_ENTITIES[1], AMOUNTS_VS_PROGRAMME_REGION_DBOS[1]]
        ]
        )("should return right mapping", (entity, dbo) => {
            
            const actual = AmountsVsProgrammeRegionAdapter.toDbo(entity);
            const expected = {...dbo, _id: expect.any(Object)};
            expect(actual).toEqual(expected);
        });

    });


});