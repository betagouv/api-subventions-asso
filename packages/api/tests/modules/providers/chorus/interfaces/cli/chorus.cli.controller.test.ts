import ChorusCliController from "../../../../../../src/modules/providers/chorus/interfaces/cli/chorus.cli.controller";
import path from "path";
import chorusLineRepository from "../../../../../../src/modules/providers/chorus/repositories/chorus.line.repository";

describe("ChorusCliController", () => {
    describe("parse cli requests", () => {
        let controller: ChorusCliController;

        beforeEach(() => {
            controller = new ChorusCliController();
        });

        it("should save entities", async () => {
            const expected = 3;
            const filePath = path.resolve(__dirname, "../../__fixtures__/chorus-export.xlsx");
            await controller.parse(filePath);
            const actual = (await chorusLineRepository.cursorFind().toArray()).length;
            expect(actual).toEqual(expected);
        });

        it("should not save duplicates", async () => {
            const expected = 3;
            const filePath = path.resolve(__dirname, "../../__fixtures__/chorus-export.xlsx");
            await controller.parse(filePath);
            await controller.parse(filePath);
            const actual = (await chorusLineRepository.cursorFind().toArray()).length;
            expect(actual).toEqual(expected);
        });
    });
});
