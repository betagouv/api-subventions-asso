import { beforeEach } from "vitest";
import AgentTypeStepController from "./AgentTypeStep.controller";
import Dispatch from "$lib/core/Dispatch";

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

        it("inits errorMessage", () => {
            const expected = "";
            const actual = ctrl.errorMessage.value;
            expect(actual).toBe(expected);
        });

        it("inits options", () => {
            ctrl = new AgentTypeStepController();
            const actual = ctrl.options;
            expect(actual).toMatchSnapshot();
        });
    });

    describe.each`
        withError | event      | option
        ${true}   | ${"error"} | ${{ value: "none" }}
        ${false}  | ${"valid"} | ${{ value: "some" }}
    `("onUpdate - case $event", ({ event, option }) => {
        it("updates errorMessage store", () => {
            // @ts-expect-error - mock readonly
            ctrl.errorMessage = { set: vi.fn() };
            ctrl.onUpdate(option);
            expect(ctrl.errorMessage.set).toMatchSnapshot();
        });

        it("dispatches event", () => {
            // @ts-expect-error - mock private
            ctrl.dispatch = vi.fn();
            ctrl.onUpdate(option);
            // @ts-expect-error - test private
            expect(ctrl.dispatch).toHaveBeenCalledWith(event);
        });
    });
});
