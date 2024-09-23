import MultiStepFormController from "./MultiStepForm.controller";
import Store from "$lib/core/Store";

describe("MultiStepFormController", () => {
    const mockOnSubmit = vi.fn();
    const mockBuildContext = vi.fn();

    const controller = new MultiStepFormController([], mockOnSubmit, mockBuildContext);
    describe("constructor", () => {
        it.each`
            property
            ${"currentStep"}
            ${"data"}
        `("should set Stores", ({ property }) => {
            const expected = Store;
            const actual = controller[property];
            expect(actual.constructor).toEqual(expected);
        });
    });

    describe("_getFlattenedData", () => {
        it("should return flattened data", () => {
            const data = [{}, {}];
            const controller = new MultiStepFormController(data, mockOnSubmit, mockBuildContext);
            controller.data.set([{ foo: "bar", fez: "baz" }]);
            const expected = { foo: "bar", fez: "baz" };
            const actual = controller._getFlattenedData();
            expect(actual).toEqual(expected);
        });
    });

    describe("next", () => {
        it("should increase currentStepIndex", () => {
            const expected = 1;
            const controller = new MultiStepFormController([{}, {}], mockOnSubmit, mockBuildContext);
            controller.next();
            const actual = controller.currentStep.value.index;
            expect(actual).toEqual(expected);
        });
    });

    describe("previous", () => {
        it("should decrease currentStepIndex", () => {
            const expected = 0;
            const controller = new MultiStepFormController([{}, {}], mockOnSubmit, mockBuildContext);
            // @ts-expect-error: mock step
            controller.currentStep.set({ index: 1 });
            controller.previous();
            const actual = controller.currentStep.value.index;
            expect(actual).toEqual(expected);
        });
    });
});
