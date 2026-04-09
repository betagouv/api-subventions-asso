import OverwriteExercicesController from "./OverwriteExercices.controller";
import { depositLogStore } from "$lib/store/depositLog.store";
import type { UploadedFileInfosDto } from "dto";

describe("OverwriteExercicesController", () => {
    let controller: OverwriteExercicesController;

    beforeEach(() => {
        depositLogStore.value = {
            step: 1,
            allocatorSiret: "12345678901234",
            allocatorName: "Allocator Name",
            uploadedFileInfos: {
                fileName: "test-file.csv",
                lineCountsByExercise: [],
            } as unknown as UploadedFileInfosDto,
        };
        controller = new OverwriteExercicesController();
    });

    describe("toggleOne", () => {
        it("should add exercice if not included", () => {
            const exercice = 2023;
            controller.checkedExercices.value = [2021, 2022];

            controller.toggleOne(exercice);

            expect(controller.checkedExercices.value).toEqual([2021, 2022, exercice]);
        });

        it("should remove exercice if included", () => {
            const exercice = 2022;
            controller.checkedExercices.value = [2021, 2022];

            controller.toggleOne(exercice);

            expect(controller.checkedExercices.value).toEqual([2021]);
        });
    });
});
