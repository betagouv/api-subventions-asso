import SignupFormController from "./SignupForm.controller";

describe("SignupFormController", () => {
    let ctrl;
    let toStepSpy, getNextStepSpy;
    const ARGS = "args";
    beforeEach(() => (ctrl = new SignupFormController()));

    describe("subscribers", () => {
        it("sets step if stepId is changed", () => {
            const spySet = jest.spyOn(ctrl.step, "set");
            const expected = "STEP";
            ctrl.stepsById.new = expected;
            ctrl.stepId.value = "new";
            expect(spySet).toHaveBeenCalledWith(expected);
        });

        function testUpdateNextStep(trigger) {
            const spySet = jest.spyOn(ctrl.nextStep, "set");
            jest.spyOn(ctrl, "getNextStep").mockReturnValue("next");
            const expected = "next";
            trigger();
            expect(spySet).toHaveBeenCalledWith(expected);
        }

        it("calls updateNextStep if stepId is changed", () => {
            testUpdateNextStep(() => (ctrl.stepId.value = "new"));
        });

        it("calls updateNextStep if currentStepData is changed", () => {
            testUpdateNextStep(() => (ctrl.currentStepData.value = {}));
        });
    });

    describe("onSubmit", () => {
        beforeEach(() => {
            toStepSpy = jest.spyOn(ctrl, "toStep").mockImplementationOnce(jest.fn());
            getNextStepSpy = jest.spyOn(ctrl, "getNextStep").mockReturnValueOnce("next");
        });

        it("gets next step", () => {
            ctrl.onSubmit(ARGS);
            expect(getNextStepSpy).toHaveBeenCalledWith(ARGS);
        });

        it("go to it", () => {
            ctrl.onSubmit(ARGS);
            expect(toStepSpy).toHaveBeenCalledWith("next", ARGS);
        });
    });

    describe("onBack", () => {
        it("go to previous step", () => {
            toStepSpy = jest.spyOn(ctrl, "toStep").mockImplementationOnce(jest.fn());
            ctrl.step.value.previous = "prev";
            ctrl.onBack(ARGS);
            expect(toStepSpy).toHaveBeenCalledWith("prev", ARGS);
        });
    });

    describe("toStep", () => {
        let stateSetSpy;
        const STEP_DATA = { field: "data" };
        const NEXT_STEP = "next";

        beforeEach(() => {
            stateSetSpy = jest.spyOn(ctrl.stepsStateById, "set");
            ctrl.stepId.value = "current";
        });

        it("does not fail if arg is undefined", () => {
            const test = () => ctrl.toStep();
            expect(test).not.toThrow();
        });

        it("sets object with updated data", () => {
            const expected = STEP_DATA;
            ctrl.toStep(NEXT_STEP, STEP_DATA);
            const actual = stateSetSpy.mock.calls[0][0].current;
            expect(actual).toMatchObject(expected);
        });

        it("sets object with previous still up-to-date data", () => {
            const expected = STEP_DATA;
            ctrl.stepsStateById.value = { otherStep: STEP_DATA };
            ctrl.toStep(NEXT_STEP, {});
            const actual = stateSetSpy.mock.calls[0][0].otherStep;
            expect(actual).toMatchObject(expected);
        });

        it("sets stepId with new value", () => {
            ctrl.toStep(NEXT_STEP, {});
            const expected = NEXT_STEP;
            const actual = ctrl.stepId.value;
            expect(actual).toBe(expected);
        });
    });

    describe("getNextStep", () => {
        it("if step.next is a function call it with args", () => {
            const nextBuilder = jest.fn();
            ctrl.step.value.next = nextBuilder;
            ctrl.getNextStep(ARGS);
            expect(nextBuilder).toHaveBeenCalledWith(ARGS);
        });

        it("if step.next is a function and no args call it with currentStepData", () => {
            const nextBuilder = jest.fn();
            ctrl.step.value.next = nextBuilder;
            ctrl.currentStepData.value = "otherArgs";
            ctrl.getNextStep();
            expect(nextBuilder).toHaveBeenCalledWith("otherArgs");
        });

        it("if step.next is a function return its result", () => {
            const expected = "nextF";
            ctrl.step.value.next = jest.fn().mockReturnValueOnce(expected);
            const actual = ctrl.getNextStep(ARGS);
            expect(actual).toBe(expected);
        });

        it("if step.next is a string return it", () => {
            const expected = "next";
            ctrl.step.value.next = expected;
            const actual = ctrl.getNextStep(ARGS);
            expect(actual).toBe(expected);
        });
    });
});
