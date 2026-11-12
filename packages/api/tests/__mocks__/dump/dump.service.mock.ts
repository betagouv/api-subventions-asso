import { mock } from "jest-mock-extended";
import { MetabaseDumpService } from "../../../src/modules/dump/metabase-dump.service";

export const createMockDumpService = (): jest.Mocked<MetabaseDumpService> => {
    return mock<MetabaseDumpService>();
};
