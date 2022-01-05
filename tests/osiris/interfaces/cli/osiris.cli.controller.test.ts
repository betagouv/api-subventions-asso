import path from "path";
import OsirisFolderEntity from "../../../../src/osiris/entities/OsirisFoldersEntity";

jest.mock('../../../../src/osiris/osiris.parser', () => ({
    parseFolders: jest.fn(() => [])
}));


import OsirisCliController from "../../../../src/osiris/interfaces/cli/osiris.cli.contoller";
import OsirisParser from "../../../../src/osiris/osiris.parser";
import osirisService from "../../../../src/osiris/osiris.service";


describe("OsirisCliController", () => {
    describe('parse cli folders', () => {
        let controller: OsirisCliController;

        beforeEach(() => {
            controller = new OsirisCliController();
        });

        it('should call osiris parser', async () => {
            const filePath = path.resolve(__dirname, "../../__fixtures__/SuiviDossiers_test.xls");
            await controller.parse("folders", filePath);
            expect(OsirisParser.parseFolders).toHaveBeenCalled();
        });

        it('should throw error because no agrs', () => {
            expect(controller.parse).rejects.toThrowError("Parse command need type and file args");
        });

        it('should throw an error because the file does not exist', () => {
            expect(() => controller.parse("folders", "fake/path")).rejects.toThrowError("File not found fake/path");
        });
    });

    describe('parse cli actions', () => {
        let controller: OsirisCliController;
        let consoleWarn: jest.SpyInstance;

        beforeEach(() => {
            controller = new OsirisCliController();
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
        });

        afterEach(() => {
            consoleWarn.mockClear();
        });

        afterAll(() => {
            consoleWarn.mockReset();
        });

        it('should call osiris parser', async () => {
            const filePath = path.resolve(__dirname, "../../__fixtures__/SuiviDossiers_test.xls");
            await controller.parse("actions", filePath);
            expect(consoleWarn).toBeCalled();
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

            expect(() => controller.parse("unknown",  filePath)).rejects.toThrowError("The type unknown is not taken into account");
        });
    });


    describe('findAll cli', () => {
        let controller: OsirisCliController;
        let consoleInfo: jest.SpyInstance;


        beforeEach(() => {
            controller = new OsirisCliController();
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            consoleInfo = jest.spyOn(console, 'info').mockImplementation(() => {});
        });

        afterEach(() => {
            consoleInfo.mockClear();
        });

        afterAll(() => {
            consoleInfo.mockReset();
        });

        it('should log all folders', async () => {
            await controller.findAll("folders");
            expect(consoleInfo).toHaveBeenCalledTimes(1);
        });
    });

    describe('findAll cli json', () => {
        let controller: OsirisCliController;

        beforeEach(async () => {
            controller = new OsirisCliController();

            const entity = { folder: { osirisId: "FAKE_ID"}, association: { rna: "FAKE_RNA"} } as unknown as OsirisFolderEntity;
            await osirisService.addFolder(entity);

        });

        it('should log all folders', async () => {
            let data = "";
            const consoleInfo = jest.spyOn(console, 'info').mockImplementation((dataLogged: string) => data = dataLogged);
            await controller.findAll("folders", "json");
            expect(JSON.parse(data)).toHaveLength(1);

            consoleInfo.mockReset();
        });
    });

    describe('findFolderByRna cli ', () => {
        let controller: OsirisCliController;

        beforeEach(async () => {
            controller = new OsirisCliController();

            const entity = { folder: { osirisId: "FAKE_ID"}, association: { rna: "FAKE_RNA"} } as unknown as OsirisFolderEntity;
            await osirisService.addFolder(entity);
        });

        it('should throw error because no agrs', () => {
            expect(controller.findFolderByRna).rejects.toThrowError("Parse command need rna args");
        });

        it('should log a folder', async () => {
            const consoleInfo = jest.spyOn(console, 'info').mockImplementation();
            await controller.findFolderByRna("FAKE_RNA");
            expect(consoleInfo).toHaveBeenCalled();

            consoleInfo.mockReset();
        });

        it('should log a folder in json', async () => {
            let data = "";
            const consoleInfo = jest.spyOn(console, 'info').mockImplementation((dataLogged: string) => data = dataLogged);
            await controller.findFolderByRna("FAKE_RNA", "json");
            expect(JSON.parse(data).association.rna).toBe("FAKE_RNA");

            consoleInfo.mockReset();
        });
    });

    describe('findFolderBySiret cli ', () => {
        let controller: OsirisCliController;

        beforeEach(async () => {
            controller = new OsirisCliController();

            const entity = { folder: { osirisId: "FAKE_ID"}, association: { siret: "FAKE_SIRET"} } as unknown as OsirisFolderEntity;
            await osirisService.addFolder(entity);
        });

        it('should throw error because no agrs', () => {
            expect(controller.findFolderBySiret).rejects.toThrowError("Parse command need siret args");
        });

        it('should log a folder', async () => {
            const consoleInfo = jest.spyOn(console, 'info').mockImplementation();
            await controller.findFolderBySiret("FAKE_SIRET");
            expect(consoleInfo).toHaveBeenCalled();

            consoleInfo.mockReset();
        });

        it('should log a folder in json', async () => {
            let data = "";
            const consoleInfo = jest.spyOn(console, 'info').mockImplementation((dataLogged: string) => data = dataLogged);
            await controller.findFolderBySiret("FAKE_SIRET", "json");
            expect(JSON.parse(data).association.siret).toBe("FAKE_SIRET");

            consoleInfo.mockReset();
        });
    });
});