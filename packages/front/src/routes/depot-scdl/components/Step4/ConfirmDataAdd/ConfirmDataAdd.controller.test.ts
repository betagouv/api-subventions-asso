import { depositLogStore } from "$lib/store/depositLog.store";
import type { UploadedFileInfosDto } from "dto";
import ConfirmDataAddController from "./ConfirmDataAdd.controller";

vi.mock("$lib/stores/depositLogStore", () => ({
    depositLogStore: {
        value: null,
    },
}));

vi.mock("$lib/resources/deposit-log/depositLog.service");

describe("ConfirmDataAddController", () => {
    let controller: ConfirmDataAddController;

    beforeEach(() => {
        vi.clearAllMocks();
        depositLogStore.value = {
            uploadedFileInfos: {
                fileName: "test.csv",
                parseableLines: 165,
                grantCoverageYears: [2025, 2024],
                existingLinesInDbOnSamePeriod: 654,
            } as UploadedFileInfosDto,
            step: 1,
        };
    });

    describe("constructor", () => {
        it("should set addedLines", async () => {
            controller = new ConfirmDataAddController();

            expect(controller.addedLines).toBe(165);
        });

        it("should set existingLinesInDb", async () => {
            controller = new ConfirmDataAddController();

            expect(controller.existingLinesInDb).toBe(654);
        });

        it("should set rangeStartYear", async () => {
            controller = new ConfirmDataAddController();

            expect(controller.rangeStartYear).toBe(2024);
        });

        it("should set rangeEndYear", async () => {
            controller = new ConfirmDataAddController();

            expect(controller.rangeEndYear).toBe(2025);
        });

        it("should set filename", async () => {
            controller = new ConfirmDataAddController();

            expect(controller.filename).toBe("test.csv");
        });
    });
});
