import StructureStepController from "./StructureStep.controller";
import Dispatch from "$lib/core/Dispatch";
import { isPhoneNumber } from "$lib/helpers/stringHelper";

vi.mock("$lib/core/Dispatch", () => ({
    default: {
        getDispatcher: vi.fn(() => vi.fn()),
    },
}));
vi.mock("$lib/helpers/stringHelper");

describe("StructureStepController", () => {
    let ctrl: StructureStepController;

    beforeEach(() => {
        ctrl = new StructureStepController();
    });

    describe("constructor", () => {
        it("inits dispatch", () => {
            const expected = "Result From Dispatch";
            // @ts-expect-error - mock
            vi.mocked(Dispatch.getDispatcher).mockReturnValueOnce(expected);
            ctrl = new StructureStepController();
            // @ts-expect-error - mock private
            const actual = ctrl.dispatch;
            expect(actual).toBe(expected);
        });

        it.each`
            varName
            ${"options"}
            ${"dirty"}
        `("inits $varName", ({ varName }) => {
            // @ts-expect-error - mock
            expect(ctrl[varName]).toMatchSnapshot();
        });

        describe("validators", () => {
            it.each`
                varName          | emptyValue
                ${"service"}     | ${""}
                ${"jobType"}     | ${[]}
                ${"phoneNumber"} | ${""}
            `("empty $varName returns error", ({ varName, emptyValue }) => {
                const expected = "Ce champ est obligatoire";
                // @ts-expect-error - mock private
                const actual = ctrl.validators[varName](emptyValue);
                expect(actual).toBe(expected);
            });

            it("returns error message if return from helper is false", () => {
                vi.mocked(isPhoneNumber).mockReturnValueOnce(false);
                // @ts-expect-error - mock private
                const actual = ctrl.validators.phoneNumber("not a phone number");
                expect(actual).toMatchInlineSnapshot('"Entrez un numéro de téléphone valide"');
            });

            it("returns undefined if return from helper is true", () => {
                vi.mocked(isPhoneNumber).mockReturnValueOnce(true);
                // @ts-expect-error - mock private
                const actual = ctrl.validators.phoneNumber("a phone number");
                expect(actual).toBeUndefined();
            });

            it.each`
                varName      | correctValue
                ${"service"} | ${"something"}
                ${"jobType"} | ${["some1"]}
            `("filled $varName returns error", ({ varName, correctValue }) => {
                // @ts-expect-error - test private
                const actual = ctrl.validators[varName](correctValue);
                expect(actual).toBeUndefined();
            });
        });
    });

    describe("onUpdate", () => {
        it("updates dirty", () => {
            const KEY = "someKey";
            ctrl.onUpdate({}, KEY);
            const expected = true;
            // @ts-expect-error - test private
            const actual = ctrl.dirty[KEY];
            expect(actual).toBe(expected);
        });

        it("validates all fields", () => {
            const mocks = {
                field1: vi.fn(),
                field2: vi.fn(),
                field3: vi.fn(),
            };
            const values: { [key: string]: string } = {
                field1: "value1",
                field3: "value3",
            };
            // @ts-expect-error - mock private
            ctrl.validators = { ...mocks };

            ctrl.onUpdate(values, "field1");
            for (const [fieldName, validator] of Object.entries(mocks))
                expect(validator).toHaveBeenCalledWith(values[fieldName]);
        });

        it("updates errors store about dirty invalid fields", () => {
            const mocks = {
                field1: vi.fn(),
                field2: vi.fn((..._args) => "some error"),
                field3: vi.fn((..._args) => "some error"),
            };
            // @ts-expect-error - mock private
            ctrl.validators = { ...mocks };
            // @ts-expect-error - mock private
            ctrl.dirty = {
                field2: true,
            };
            const errorSetSpy = vi.spyOn(ctrl.errors, "set");

            ctrl.onUpdate({}, "someField");
            expect(errorSetSpy).toHaveBeenCalledWith({ field2: "some error" });
        });

        it.each`
            isDirty  | isValid  | expectedEvent
            ${true}  | ${false} | ${"error"}
            ${false} | ${false} | ${"error"}
            ${true}  | ${true}  | ${"valid"}
            ${false} | ${true}  | ${"valid"}
        `("dispatches error if dirty field is invalid", ({ isDirty, isValid, expectedEvent }) => {
            const mocks = {
                field: vi.fn((..._args) => (isValid ? undefined : "some error")),
            };
            // @ts-expect-error - mock private
            ctrl.validators = { ...mocks };
            // @ts-expect-error - mock private
            ctrl.dirty = {
                field: isDirty,
            };
            // @ts-expect-error - mock private
            const dispatchSpy = vi.spyOn(ctrl, "dispatch");

            ctrl.onUpdate({}, "someField");
            expect(dispatchSpy).toHaveBeenCalledWith(expectedEvent);
        });
    });
});
