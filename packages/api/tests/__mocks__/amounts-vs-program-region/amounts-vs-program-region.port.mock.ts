import { AmountsVsProgramRegionPort } from "../../../src/dataProviders/db/dataViz/amountVSProgramRegion/amounts-vs-program-region.port";
import { mock } from "jest-mock-extended";

export const createMockAmountsVsRegionPort = (): jest.Mocked<AmountsVsProgramRegionPort> => {
    return mock<AmountsVsProgramRegionPort>();
};
