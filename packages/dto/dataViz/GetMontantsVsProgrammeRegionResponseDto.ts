
import { WithoutId } from "mongodb";
import { amountsVsProgrammeRegionDbo } from "../../api/src/modules/dataViz/amountsVsProgrammeRegion/entitiyAndDbo/amountsVsProgrammeRegion.dbo";
export interface GetMontantsVsProgrammeRegionSuccessResponse {
    montantVsProgrammeRegionData: WithoutId<amountsVsProgrammeRegionDbo>[];
}

export type GetMontantsVsProgrammeRegionResponseDto = GetMontantsVsProgrammeRegionSuccessResponse;
