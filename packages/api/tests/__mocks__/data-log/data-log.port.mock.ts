import { mock } from "jest-mock-extended";
import { DataLogPort } from "../../../src/dataProviders/db/data-log/data-log.port";

export const createMockDataLogPort = (): jest.Mocked<DataLogPort> => {
    return mock<DataLogPort>();
};
