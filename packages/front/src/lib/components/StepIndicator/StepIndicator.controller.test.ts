import StepIndicatorController from "$lib/components/StepIndicator/StepIndicator.controller";

describe("StepIndicatorController", () => {
    const steps = ["step 1", "step 2", "step 3"];

    describe("init", () => {
        it("should init properties correctly", () => {
            const controller = new StepIndicatorController(1, steps);

            expect(controller.currentStep).toBe(1);
            expect(controller.totalSteps).toBe(3);
            expect(controller.currentStepTitle).toBe("step 1");
            expect(controller.nextStepTitle).toBe("step 2");
        });
    });

    describe("currentStepTitle", () => {
        it("should return empty string if currentStep is out of bounds", () => {
            const controller = new StepIndicatorController(4, steps);
            expect(controller.currentStepTitle).toBe("");
        });
    });

    describe("nextStepTitle", () => {
        it("should return next step title", () => {
            const controller = new StepIndicatorController(2, steps);
            expect(controller.currentStepTitle).toBe("step 2");
            expect(controller.nextStepTitle).toBe("step 3");
        });

        it("should return empty string if currentStep is the last step", () => {
            const controller = new StepIndicatorController(3, steps);
            expect(controller.currentStepTitle).toBe("step 3");
            expect(controller.nextStepTitle).toBe("");
        });
    });
});
