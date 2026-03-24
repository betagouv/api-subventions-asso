import { AmountsVsProgramRegionDto } from "./AmountsVsProgramRegionDto";

export interface GetAmountsVsProgramRegionSuccessResponse {
    amountsVersusProgramRegionData: AmountsVsProgramRegionDto[];
}

export type GetAmountsVsProgramRegionResponseDto = GetAmountsVsProgramRegionSuccessResponse;
