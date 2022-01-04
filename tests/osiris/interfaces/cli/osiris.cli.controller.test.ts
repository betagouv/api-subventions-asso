import path from "path";

jest.mock('../../../../src/osiris/osiris.parser', () => ({
    parseFolders: jest.fn(() => [])
}));


import OsirisCliController from "../../../../src/osiris/interfaces/cli/osiris.cli.contoller";
import OsirisParser from "../../../../src/osiris/osiris.parser";


describe("OsirisCliController", () => {
    describe('parse cli folders', () => {
        let controller: OsirisCliController;

        beforeEach(() => {
            controller = new OsirisCliController();
        });

        it('should call osiris parser', () => {
            const filePath = path.resolve(__dirname, "../../__fixtures__/SuiviDossiers_test.xls");
            controller.parse("folders", filePath);
            expect(OsirisParser.parseFolders).toHaveBeenCalled();
        });

        it('should throw error because no agrs', () => {
            expect(controller.parse).toThrowError("Parse command neet type and file args");
        });

        it('should throw an error because the file does not exist', () => {
            expect(() => controller.parse("folders", "fake/path")).toThrowError("File not found fake/path");
        });
    });

    describe('parse cli actions', () => {
        let controller: OsirisCliController;

        beforeEach(() => {
            controller = new OsirisCliController();
        });

        it('should call osiris parser', () => {
            const filePath = path.resolve(__dirname, "../../__fixtures__/SuiviDossiers_test.xls");
            controller.parse("actions", filePath);
            // Temporary test
        });

        // it('should throw error because no agrs', () => {
        //     expect(controller.parse).toThrowError("Parse command neet type and file args");
        // });

        // it('should throw an error because the file does not exist', () => {
        //     expect(() => controller.parse("folders", "fake/path")).toThrowError("File not found fake/path");
        // });
    });

    describe('parse cli unknown', () => {
        let controller: OsirisCliController;

        beforeEach(() => {
            controller = new OsirisCliController();
        });

        it('should throw an error because unknown is not valid type', () => {
            const filePath = path.resolve(__dirname, "../../__fixtures__/SuiviDossiers_test.xls");

            expect(() => controller.parse("unknown",  filePath)).toThrowError("The type unknown is not taken into account");
        });
    });
});