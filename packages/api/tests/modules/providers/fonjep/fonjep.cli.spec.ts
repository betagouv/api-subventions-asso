import path from "path";
import FonjepCliController from "../../../../src/modules/providers/fonjep/interfaces/cli/fonjep.cli.controller"

describe("Fonjep CLI", () => {

    const cli = new FonjepCliController();

    describe("_compare", () => {
        it("should return true", () => {
            const actual = cli._compare(path.resolve(__dirname, "./__fixtures__/fonjep.xlsx"), path.resolve(__dirname, "./__fixtures__/fonjep-new.xlsx"));
            expect(actual).toBeTruthy();
        })
    })
})