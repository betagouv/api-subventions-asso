import ExportDateError from '../../../../../shared/errors/cliErrors/ExportDateError';
import FonjepCliController from './fonjep.cli.controller'

describe("FonjepCliController", () => {
    const cli = new FonjepCliController();
    describe("_parse()", () => {
        const PATH = "path/to/test";
        it("should throw ExportDateError without exportDate", async () => {
            const expected = new ExportDateError();
            let actual;
            try {
                // @ts-expect-error: protected method
                 actual = await cli._parse(PATH);
            } catch (e) {
                actual = e
            }
            expect(actual).toEqual(expected);
        });
    });
});