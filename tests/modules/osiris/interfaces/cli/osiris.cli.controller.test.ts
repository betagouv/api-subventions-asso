import path from "path";
import OsirisActionEntity from "../../../../../src/modules/osiris/entities/OsirisActionEntity";
import OsirisFileEntity from "../../../../../src/modules/osiris/entities/OsirisFileEntity";

// eslint-disable-next-line @typescript-eslint/no-explicit-any

import OsirisCliController from "../../../../../src/modules/osiris/interfaces/cli/osiris.cli.contoller";
import OsirisParser from "../../../../../src/modules/osiris/osiris.parser";
import osirisService from "../../../../../src/modules/osiris/osiris.service";



describe("OsirisCliController", () => {
    const spys: jest.SpyInstance<unknown>[] = [];
    beforeAll(() => {
        spys.push(
            jest.spyOn(OsirisParser, 'parseFiles'),
            jest.spyOn(OsirisParser, 'parseActions'),
        )
    });

    afterAll(() => {
        spys.forEach(spy => spy.mockReset());
    });

    describe('parse cli files', () => {
        let controller: OsirisCliController;

        beforeEach(() => {
            controller = new OsirisCliController();
        });

        it('should call osiris parser', async () => {
            const filePath = path.resolve(__dirname, "../../__fixtures__/SuiviDossiers_test.xls");
            await controller.parse("files", filePath);
            expect(OsirisParser.parseFiles).toHaveBeenCalled();
        });

        it('should throw error because no agrs', () => {
            expect(controller.parse).rejects.toThrowError("Parse command need type and file args");
        });

        it('should throw an error because the file does not exist', () => {
            expect(() => controller.parse("files", "fake/path")).rejects.toThrowError("File not found fake/path");
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
            expect(consoleWarn).not.toBeCalled();
            expect(OsirisParser.parseActions).toHaveBeenCalled();
        });

        it('should throw error because no agrs', () => {
            expect(controller.parse).rejects.toThrowError("Parse command need type and file args");
        });

        it('should throw an error because the file does not exist', () => {
            expect(() => controller.parse("actions", "fake/path")).rejects.toThrowError("File not found fake/path");
        });
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

        it('should log all files', async () => {
            await controller.findAll("files");
            expect(consoleInfo).toHaveBeenCalledTimes(1);
        });
    });

    describe('findAll cli json', () => {
        let controller: OsirisCliController;

        beforeEach(async () => {
            controller = new OsirisCliController();

            const file = { file: { osirisId: "FAKE_ID"}, association: { rna: "FAKE_RNA"} } as unknown as OsirisFileEntity;
            const action = { file: { osirisId: "FAKE_ID"}, beneficiaryAssociation: { rna: "FAKE_RNA"} } as unknown as OsirisActionEntity;

            await osirisService.addFile(file);
            await osirisService.addAction(action);
        });

        it('should throw error because no agrs', () => {
            expect(controller.findAll).rejects.toThrowError("FindAll command need type args");
        });

        it('should log all files', async () => {
            let data = "";
            const consoleInfo = jest.spyOn(console, 'info').mockImplementation((dataLogged: string) => data = dataLogged);
            await controller.findAll("files", "json");
            expect(JSON.parse(data)).toHaveLength(1);

            consoleInfo.mockReset();
        });

        it('should log all actions', async () => {
            let data = "";
            const consoleInfo = jest.spyOn(console, 'info').mockImplementation((dataLogged: string) => data = dataLogged);
            await controller.findAll("actions", "json");
            expect(JSON.parse(data)).toHaveLength(1);

            consoleInfo.mockReset();
        });
    });

    describe('findFilesByRna cli ', () => {
        let controller: OsirisCliController;

        beforeEach(async () => {
            controller = new OsirisCliController();

            const entity = { file: { osirisId: "FAKE_ID"}, association: { rna: "FAKE_RNA"} } as unknown as OsirisFileEntity;
            await osirisService.addFile(entity);
        });

        it('should throw error because no agrs', () => {
            expect(controller.findFilesByRna).rejects.toThrowError("Parse command need rna args");
        });

        it('should log a file', async () => {
            const consoleInfo = jest.spyOn(console, 'info').mockImplementation();
            await controller.findFilesByRna("FAKE_RNA");
            expect(consoleInfo).toHaveBeenCalled();

            consoleInfo.mockReset();
        });

        it('should log a file in json', async () => {
            let data = "";
            const consoleInfo = jest.spyOn(console, 'info').mockImplementation((dataLogged: string) => data = dataLogged);
            await controller.findFilesByRna("FAKE_RNA", "json");
            expect(JSON.parse(data)[0].association.rna).toBe("FAKE_RNA");

            consoleInfo.mockReset();
        });
    });

    describe('findFilesBySiret cli ', () => {
        let controller: OsirisCliController;

        beforeEach(async () => {
            controller = new OsirisCliController();

            const entity = { file: { osirisId: "FAKE_ID"}, association: { siret: "FAKE_SIRET"} } as unknown as OsirisFileEntity;
            await osirisService.addFile(entity);
        });

        it('should throw error because no agrs', () => {
            expect(controller.findFilesBySiret).rejects.toThrowError("Parse command need siret args");
        });

        it('should log a file', async () => {
            const consoleInfo = jest.spyOn(console, 'info').mockImplementation();
            await controller.findFilesBySiret("FAKE_SIRET");
            expect(consoleInfo).toHaveBeenCalled();

            consoleInfo.mockReset();
        });

        it('should log a file in json', async () => {
            let data = "";
            const consoleInfo = jest.spyOn(console, 'info').mockImplementation((dataLogged: string) => data = dataLogged);
            await controller.findFilesBySiret("FAKE_SIRET", "json");
            expect(JSON.parse(data)[0].association.siret).toBe("FAKE_SIRET");

            consoleInfo.mockReset();
        });
    });
});