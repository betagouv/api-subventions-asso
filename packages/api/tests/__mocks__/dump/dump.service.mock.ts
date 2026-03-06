import { mock } from "jest-mock-extended";
import { DumpService } from "../../../src/modules/dump/dump.service";

export const createMockDumpService = (): jest.Mocked<DumpService> => {
    return mock<DumpService>();
};
