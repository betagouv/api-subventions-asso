import MultiStepFormController from "./MultiStepForm.controller";
import Store from "@core/Store";

describe("MultiStepFormController", () => {
    const controller = new MultiStepFormController([], jest.fn());
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
            const controller = new MultiStepFormController(data, jest.fn());
            controller.data.set([{ foo: "bar", fez: "baz" }]);
            const expected = { foo: "bar", fez: "baz" };
            const actual = controller._getFlattenedData();
            expect(actual).toEqual(expected);
        });
    });

    describe("next", () => {
        it("should increase currentStepIndex", () => {
            const expected = 1;
            const controller = new MultiStepFormController([{}, {}], jest.fn());
            controller.next();
            const actual = controller.currentStep.value.index;
            expect(actual).toEqual(expected);
        });
    });

    describe("previous", () => {
        it("should decrease currentStepIndex", () => {
            const expected = 0;
            const controller = new MultiStepFormController([{}, {}], jest.fn());
            controller.currentStepIndex.set(1);
            controller.previous();
            const actual = controller.currentStep.value.index;
            expect(actual).toEqual(expected);
        });
    });
});
