import { HomeController } from "./Home.controller";
import { goto } from "$app/navigation";

vi.mock("$lib/helpers/validatorHelper");
vi.mock("$app/navigation", () => ({ goto: vi.fn() }));

describe("HomeController", () => {
    let ctrl;

    beforeEach(() => {
        ctrl = new HomeController();
    });

    describe("constructor", () => {
        it.each`
            parameterName       | expected
            ${"successMessage"} | ${undefined}
        `("initializes correctly $parameterName", ({ parameterName, expected }) => {
            expect(ctrl[parameterName]).toEqual(expected);
        });

        it("initializes correctly successMessage", () => {
            ctrl = new HomeController({ success: "ACCOUNT_ACTIVATED" });
            const actual = ctrl.successMessage;
            expect(actual).toMatchInlineSnapshot(`
              {
                "content": "Vous pouvez commencer à effectuer vos recherches",
                "title": "Bravo, votre compte a été créé !",
              }
            `);
        });
    });

    describe("onSubmit", () => {
        it("should call goto", () => {
            ctrl.onSubmit();
            expect(goto).toHaveBeenCalledTimes(1);
        });
    });
});
