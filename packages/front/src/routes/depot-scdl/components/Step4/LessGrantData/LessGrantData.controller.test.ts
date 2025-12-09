import { depositLogStore } from "$lib/store/depositLog.store";
import LessGrantDataController from "./LessGrantData.controller";
import type { UploadedFileInfosDto } from "dto";

vi.mock("$lib/stores/depositLogStore", () => ({
    depositLogStore: {
        value: null,
    },
}));

vi.mock("$lib/resources/deposit-log/depositLog.service");

describe("LessGrantDataController", () => {
    let controller: LessGrantDataController;

    beforeEach(() => {
        vi.clearAllMocks();
        depositLogStore.value = {
            uploadedFileInfos: {
                fileName: "test.csv",
                grantCoverageYears: [2019, 2020, 2017],
                parseableLines: 123,
                existingLinesInDbOnSamePeriod: 456,
            } as UploadedFileInfosDto,
            step: 1,
        };
    });

    describe("constructor", () => {
        it("should set rangeStartYear with min value", async () => {
            controller = new LessGrantDataController();

            expect(controller.rangeStartYear).toBe(2017);
        });

        it("should set rangeEndYear with max value", async () => {
            controller = new LessGrantDataController();

            expect(controller.rangeEndYear).toBe(2020);
        });

        it("should set detectedLines with uploadedFileInfos", async () => {
            controller = new LessGrantDataController();

            expect(controller.detectedLines).toBe(123);
        });

        it("should set existingLinesInDb with uploadedFileInfos", async () => {
            controller = new LessGrantDataController();

            expect(controller.existingLinesInDb).toBe(456);
        });
    });
});
