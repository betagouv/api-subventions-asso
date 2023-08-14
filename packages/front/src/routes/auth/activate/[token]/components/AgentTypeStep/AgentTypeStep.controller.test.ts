import { beforeEach } from "vitest";
import AgentTypeStepController from "./AgentTypeStep.controller";
import Dispatch from "$lib/core/Dispatch";
import { derived } from "$lib/core/Store";

vi.mock("$lib/core/Dispatch", () => ({
    default: {
        getDispatcher: vi.fn(() => vi.fn()),
    },
}));
vi.mock("$lib/core/Store", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- mock
    const actual = (await vi.importActual("$lib/core/Store")) as any;
    return {
        ...actual,
        derived: vi.fn(actual.derived),
    };
});
vi.mock("svelte");

describe("AgentTypeStepController", () => {
    let ctrl: AgentTypeStepController;

    beforeEach(() => {
        ctrl = new AgentTypeStepController();
    });

    describe("constructor", () => {
        it("inits dispatch", () => {
            const expected = "Result From Dispatch";
            // @ts-expect-error - mock
            vi.mocked(Dispatch.getDispatcher).mockReturnValueOnce(expected);
            ctrl = new AgentTypeStepController();
            // @ts-expect-error - mock private
            const actual = ctrl.dispatch;
            expect(actual).toBe(expected);
        });

        it("inits showNoneMessage", () => {
            const expected = false;
            // @ts-expect-error - test private
            const actual = ctrl.showNoneMessage.value;
            expect(actual).toBe(expected);
        });

        describe("inits option store", () => {
            it("sets value from derived", () => {
                const expected = "Function";
                // @ts-expect-error - mock
                vi.mocked(derived).mockReturnValueOnce(expected);
                ctrl = new AgentTypeStepController();
                const actual = ctrl.options;
                expect(actual).toBe(expected);
            });

            it("derived depends on showNoneMessage", () => {
                // @ts-expect-error - test private
                expect(derived).toHaveBeenCalledWith(ctrl.showNoneMessage, expect.any(Function));
            });

            it.each`
                arg      | label
                ${true}  | ${"with"}
                ${false} | ${"without"}
            `("derived callback $label hint", ({ arg }) => {
                const callback = vi.mocked(derived).mock.calls[0][1] as (show: boolean) => object[];
                const actual = callback(arg);
                expect(actual).toMatchSnapshot();
            });
        });
    });

    describe.each`
        withError | label              | event      | option
        ${true}   | ${"with error"}    | ${"error"} | ${{ value: "none" }}
        ${false}  | ${"without error"} | ${"valid"} | ${{ value: "some" }}
    `("onUpdate", ({ withError, event, option }) => {
        it("dispatches $event event", () => {
            // @ts-expect-error - mock private
            ctrl.showNoneMessage = { set: vi.fn() };
            ctrl.onUpdate(option);
            // @ts-expect-error - test private
            expect(ctrl.showNoneMessage.set).toHaveBeenCalledWith(withError);
        });

        it("updates showNoneMessage store", () => {
            // @ts-expect-error - mock private
            ctrl.dispatch = vi.fn();
            ctrl.onUpdate(option);
            // @ts-expect-error - test private
            expect(ctrl.dispatch).toHaveBeenCalledWith(event);
        });
    });
});
