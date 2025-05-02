import { beforeEach } from "vitest";
import AgentTypeStepController from "./AgentTypeStep.controller";
import Dispatch from "$lib/core/Dispatch";
import Store from "$lib/core/Store";
vi.mock("$lib/core/Dispatch", () => ({
    default: {
        getDispatcher: vi.fn(() => vi.fn()),
    },
}));
vi.mock("$lib/core/Store");
vi.mock("svelte");

describe("AgentTypeStepController", () => {
    let ctrl: AgentTypeStepController;

    beforeEach(() => {
        ctrl = new AgentTypeStepController();
    });

    describe("constructor", () => {
        const STORE_VALUE = "some value";
        beforeAll(() => {
            vi.spyOn(Store.prototype, "value", "get").mockReturnValue(STORE_VALUE);
        });

        it("inits dispatch", () => {
            const expected = "Result From Dispatch";
            // @ts-expect-error - mock
            vi.mocked(Dispatch.getDispatcher).mockReturnValueOnce(expected);
            ctrl = new AgentTypeStepController();
            // @ts-expect-error: access private property
            const actual = ctrl.dispatch;
            expect(actual).toBe(expected);
        });

        it("inits errorMessage", () => {
            const actual = ctrl.errorMessage.value;
            expect(actual).toBe(STORE_VALUE);
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
    `("onUpdate - case $event", ({ event, option, withError }) => {
        it("updates errorMessage store", () => {
            const errorSpy = vi.spyOn(ctrl.errorMessage, "set").mockImplementation(vi.fn());
            const expected = withError
                ? 'Data.Subvention est réservé aux agents publics. Pour toute question, vous pouvez nous contacter à <a href="mailto:contact@datasubvention.beta.gouv.fr">contact@datasubvention.beta.gouv.fr</a>'
                : "";
            ctrl.onUpdate(option);
            const actual = errorSpy.mock.calls?.[0]?.[0];
            expect(actual).toBe(expected);
            errorSpy.mockRestore();
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
