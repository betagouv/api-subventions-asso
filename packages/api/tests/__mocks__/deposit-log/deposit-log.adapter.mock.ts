import { DepositLogPort } from "../../../src/adapters/db/deposit-log/deposit-log.port";
import { mock } from "jest-mock-extended";

export const createMockDepositLogPort = (): jest.Mocked<DepositLogPort> => {
    return mock<DepositLogPort>();
};
