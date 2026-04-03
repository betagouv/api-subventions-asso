import { mock } from "jest-mock-extended";
import { DepositScdlProcessService } from "../../../src/modules/deposit-scdl-process/deposit-scdl-process.service";

export const createDepositScdlProcessService = (): jest.Mocked<DepositScdlProcessService> => {
    return mock<DepositScdlProcessService>();
};
