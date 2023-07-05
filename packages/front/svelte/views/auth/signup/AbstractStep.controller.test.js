import { createForm } from "felte";
import AbstractStepController from "./AbstractStep.controller";

jest.mock("felte");

describe("AbstractStepController", () => {
    let ctrl;
    const FORM_CONFIG = {
        onSubmit: jest.fn(),
        onBack: jest.fn(),
    };
    beforeEach(() => (ctrl = new AbstractStepController(FORM_CONFIG)));

    describe("init", () => {
        const configSpies = {};

        it("creates felt form", () => {
            ctrl.init();
            expect(createForm).toHaveBeenCalled();
        });

        describe.each`
            methodName    | localMethodName    | parentSpy
            ${"onSubmit"} | ${"localOnSubmit"} | ${FORM_CONFIG.onSubmit}
            ${"onBack"}   | ${"localOnBack"}   | ${FORM_CONFIG.onBack}
        `("$methodName in final formConfig", ({ methodName, localMethodName, parentSpy }) => {
            beforeEach(() => {
                ctrl.init();
                configSpies[methodName] = jest.spyOn(ctrl, localMethodName);
            });

            it("calls local method", async () => {
                await ctrl.formConfig[methodName]("args");
                expect(configSpies[methodName]).toHaveBeenCalledWith("args");
            });

            it("calls parent method if not standalone", async () => {
                ctrl.standalone = false;
                await ctrl.formConfig[methodName]("args");
                expect(parentSpy).toHaveBeenCalledWith("args");
            });

            it("does not call parent method if not standalone", async () => {
                await ctrl.formConfig[methodName]("args");
                expect(parentSpy).not.toHaveBeenCalled();
            });
        });
    });

    describe("onBack", () => {
        beforeEach(() => ctrl.init());
        it("calls onBack from formConfig", () => {
            const spy = jest.fn();
            ctrl.formConfig.onBack = spy;
            ctrl.onBack("args");
            expect(spy).toHaveBeenCalledWith("args");
        });
    });
});
