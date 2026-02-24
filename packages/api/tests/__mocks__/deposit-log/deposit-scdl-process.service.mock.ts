import { mock } from "jest-mock-extended";
import { DepositScdlProcessService } from "../../../src/modules/deposit-scdl-process/depositScdlProcess.service";

export const createDepositScdlProcessService = (): jest.Mocked<DepositScdlProcessService> => {
    return mock<DepositScdlProcessService>();
};
