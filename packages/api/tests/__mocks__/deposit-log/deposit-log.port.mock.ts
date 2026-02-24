import { DepositLogPort } from "../../../src/dataProviders/db/deposit-log/depositLog.port";
import { mock } from "jest-mock-extended";

export const createMockDepositLogPort = (): jest.Mocked<DepositLogPort> => {
    return mock<DepositLogPort>();
};
