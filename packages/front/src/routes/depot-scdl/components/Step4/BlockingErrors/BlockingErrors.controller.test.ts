import BlockingErrorsController from "./BlockingErrors.controller";
import { depositLogStore } from "$lib/store/depositLog.store";
import depositLogService from "$lib/resources/deposit-log/depositLog.service";

vi.mock("$lib/stores/depositLogStore", () => ({
    depositLogStore: {
        value: null,
    },
}));

const downloadErrorFileMock = vi.spyOn(depositLogService, "downloadErrorFile");
let controller: BlockingErrorsController;

beforeEach(() => {
    depositLogStore.value = {
        step: 2,
        permissionAlert: true,
        allocatorSiret: "12345678901234",
        overwriteAlert: true,
        uploadedFileInfos: {
            fileName: "test.csv",
            errorStats: { count: 0, errorSample: [] },
            parseableLines: 123,
            existingLinesInDbOnSamePeriod: 12,
            totalLines: 124,
            uploadDate: new Date(),
            grantCoverageYears: [2024],
            allocatorsSiret: ["12345678901234"],
        },
    };
    controller = new BlockingErrorsController();
    vi.clearAllMocks();
});

describe("BlockingErrorsController", () => {
    it("call downloadErrorFile with params", async () => {
        downloadErrorFileMock.mockResolvedValue();

        await controller.downloadErrorFile();

        expect(depositLogService.downloadErrorFile).toHaveBeenCalledWith(depositLogStore.value!.uploadedFileInfos!);
    });
});
