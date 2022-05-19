import ChorusCliController from "../../../../../../src/modules/providers/chorus/interfaces/cli/chorus.cli.controller"
import ChorusParser from "../../../../../../src/modules/providers/chorus/chorus.parser"
import path from "path";

describe("ChorusCliController", () => {
    const spys: jest.SpyInstance<unknown>[] = [];
    beforeAll(() => {
        spys.push(
            jest.spyOn(ChorusParser, 'parse'),
        )
    });

    afterAll(() => {
        spys.forEach(spy => spy.mockReset());
    });

    describe('parse cli requests', () => {
        let controller: ChorusCliController;

        beforeEach(() => {
            controller = new ChorusCliController();
        });

        it('should call osiris parse', async () => {
            const filePath = path.resolve(__dirname, "../../__fixtures__/infbud-53.tests.csv");
            await controller.parse(filePath);
            expect(ChorusParser.parse).toHaveBeenCalled();
        });
    });

});