import { goToUrl } from "$lib/services/router.service";
import type { DepositScdlLogResponseDto } from "dto";
import { DepositScdlController } from "./DepositScdl.controller";

vi.mock("$lib/services/router.service");

describe("DepositScdlController", () => {
    let controller;
    const COMPONENTS_LIST = { 1: "step1Component", 2: "step2Component", 3: "step3Component" };
    const DEPOSIT_LOG: DepositScdlLogResponseDto = {
        step: 1,
        overwriteAlert: true,
        allocatorSiret: "12345678901234",
    };
    beforeEach(() => {
        // @ts-expect-error: mock using string instead of svelte component
        controller = new DepositScdlController(COMPONENTS_LIST);
        controller.depositLog.set(DEPOSIT_LOG);
    });

    describe("onMount", () => {
        beforeEach(() => {
            vi.spyOn(controller, "restartNewForm");
            vi.spyOn(controller, "displayResume");
        });

        it("start new form is no deposit log stored", () => {
            controller.depositLog.set(null);
            controller.onMount();
            expect(controller.restartNewForm).toHaveBeenCalledTimes(1);
        });

        it("display resume page", () => {
            controller.onMount();
            expect(controller.displayResume).toHaveBeenCalledTimes(1);
        });
    });

    describe("displayResume", () => {
        it("change view and step", () => {
            controller.displayResume();
            expect(controller.currentView.value).toEqual("resume");
            expect(controller.currentStep.value).toEqual(DEPOSIT_LOG.step + 1);
        });
    });

    describe("startNewForm", () => {
        it("set view and step", () => {
            controller.startNewForm();
            expect(controller.currentView.value).toEqual("form");
            expect(controller.currentStep.value).toEqual(1);
        });
    });

    describe("restartNewForm", () => {
        it("set view and step", () => {
            controller.restartNewForm();
            expect(controller.currentView.value).toEqual("welcome");
            expect(controller.currentStep.value).toEqual(null);
        });
    });

    describe("resumeForm", () => {
        it("set view and step", () => {
            controller.resumeForm();
            expect(controller.currentView.value).toEqual("form");
            expect(controller.currentStep.value).toEqual(controller.depositLog.value.step + 2);
        });
    });

    describe("nextStep", () => {
        it("set current step", () => {
            const CURRENT_STEP = 1;
            controller.currentStep.set(CURRENT_STEP);
            controller.nextStep();
            expect(controller.currentStep.value).toEqual(CURRENT_STEP + 1);
        });

        it("return to home if last step", () => {
            const CURRENT_STEP = Object.keys(COMPONENTS_LIST).length;
            controller.currentStep.set(CURRENT_STEP);
            controller.nextStep();
            expect(goToUrl).toHaveBeenCalledTimes(1);
        });
    });

    describe("prevStep", () => {
        let mockRestartNewForm;

        beforeEach(() => {
            mockRestartNewForm = vi.spyOn(controller, "restartNewForm");
        });

        it("return to home if form is complete", () => {
            const CURRENT_STEP = Object.keys(COMPONENTS_LIST).length;
            controller.currentStep.set(CURRENT_STEP);
            controller.prevStep();
            expect(goToUrl).toHaveBeenCalledTimes(1);
        });

        it("restart a new form when current step is one", () => {
            const CURRENT_STEP = 1;
            controller.currentStep.set(CURRENT_STEP);
            controller.prevStep();
            expect(mockRestartNewForm).toHaveBeenCalledTimes(1);
        });

        it("lower step by one", () => {
            const CURRENT_STEP = 2;
            controller.currentStep.set(CURRENT_STEP);
            controller.prevStep();
            const expected = CURRENT_STEP - 1;
            const actual = controller.currentStep.value;
            expect(actual).toEqual(expected);
        });
    });

    describe("loading", () => {
        it("set view", () => {
            controller.loading();
            expect(controller.currentView.value).toEqual("loading");
        });
    });
});
