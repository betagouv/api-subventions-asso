import path from "path";
import IOsirisActionsInformations from "../../../../../../src/modules/providers/osiris/@types/IOsirisActionsInformations";
import IOsirisRequestInformations from "../../../../../../src/modules/providers/osiris/@types/IOsirisRequestInformations";
import OsirisActionEntity from "../../../../../../src/modules/providers/osiris/entities/OsirisActionEntity";
import OsirisRequestEntity from "../../../../../../src/modules/providers/osiris/entities/OsirisRequestEntity";

// eslint-disable-next-line @typescript-eslint/no-explicit-any

import OsirisCliController from "../../../../../../src/modules/providers/osiris/interfaces/cli/osiris.cli.contoller";
import OsirisParser from "../../../../../../src/modules/providers/osiris/osiris.parser";
import osirisService from "../../../../../../src/modules/providers/osiris/osiris.service";



describe("OsirisCliController", () => {
    const spys: jest.SpyInstance<unknown>[] = [];
    beforeAll(() => {
        spys.push(
            jest.spyOn(OsirisParser, 'parseRequests'),
            jest.spyOn(OsirisParser, 'parseActions'),
        )
    });

    afterAll(() => {
        spys.forEach(spy => spy.mockReset());
    });

    describe('parse cli requests', () => {
        let controller: OsirisCliController;

        beforeEach(() => {
            controller = new OsirisCliController();
        });

        it('should call osiris parser', async () => {
            const filePath = path.resolve(__dirname, "../../__fixtures__/SuiviDossiers_test.xls");
            await controller.parse("requests", filePath);
            expect(OsirisParser.parseRequests).toHaveBeenCalled();
        });

        it('should throw error because no agrs', () => {
            expect(controller.parse).rejects.toThrowError("Parse command need type and file args");
        });

        it('should throw an error because the file does not exist', () => {
            expect(() => controller.parse("requests", "fake/path")).rejects.toThrowError("File not found fake/path");
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
            const filePath = path.resolve(__dirname, "../../__fixtures__/SuiviActions_test.xls");
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

            expect(() => controller.parse("unknown" as "actions",  filePath)).rejects.toThrowError("The type unknown is not taken into account");
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

        it('should log all requests', async () => {
            await controller.findAll("requests");
            expect(consoleInfo).toHaveBeenCalledTimes(1);
        });
    });

    describe('findAll cli json', () => {
        let controller: OsirisCliController;

        beforeEach(async () => {
            controller = new OsirisCliController();

            const request = new OsirisRequestEntity({ siret: "FAKE_SIRET", rna: "RNA", name: "NAME"}, { osirisId: "FAKE_ID_2", compteAssoId: "COMPTEASSOID", ej: "", amountAwarded: 0, dateCommission: new Date()} as IOsirisRequestInformations, {}, undefined, []);
            const action =  new OsirisActionEntity({ osirisActionId: "OSIRISID", compteAssoId: "COMPTEASSOID"} as IOsirisActionsInformations, {}, undefined);

            await osirisService.addRequest(request);
            await osirisService.addAction(action);
        });

        it('should throw error because no agrs', () => {
            expect(controller.findAll).rejects.toThrowError("FindAll command need type args");
        });

        it('should log all requests', async () => {
            let data = "";
            const consoleInfo = jest.spyOn(console, 'info').mockImplementation((dataLogged: string) => data = dataLogged);
            await controller.findAll("requests", "json");
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

    describe('findByRna cli ', () => {
        let controller: OsirisCliController;

        beforeEach(async () => {
            controller = new OsirisCliController();

            const entity =  new OsirisRequestEntity({ siret: "FAKE_SIRET", rna: "FAKE_RNA", name: "NAME"}, { osirisId: "FAKE_ID_2", compteAssoId: "COMPTEASSOID", ej: "", amountAwarded: 0, dateCommission: new Date()} as IOsirisRequestInformations, {}, undefined, []);
            await osirisService.addRequest(entity);
        });

        it('should throw error because no agrs', () => {
            expect(controller.findByRna).rejects.toThrowError("Parse command need rna args");
        });

        it('should log a file', async () => {
            const consoleInfo = jest.spyOn(console, 'info').mockImplementation();
            await controller.findByRna("FAKE_RNA");
            expect(consoleInfo).toHaveBeenCalled();

            consoleInfo.mockReset();
        });

        it('should log a file in json', async () => {
            let data = "";
            const consoleInfo = jest.spyOn(console, 'info').mockImplementation((dataLogged: string) => data = dataLogged);
            await controller.findByRna("FAKE_RNA", "json");
            expect(JSON.parse(data)[0].legalInformations.rna).toBe("FAKE_RNA");

            consoleInfo.mockReset();
        });
    });

    describe('findBySiret cli ', () => {
        let controller: OsirisCliController;

        beforeEach(async () => {
            controller = new OsirisCliController();

            const entity =  new OsirisRequestEntity({ siret: "FAKE_SIRET", rna: "FAKE_RNA", name: "NAME"}, { osirisId: "FAKE_ID_2", compteAssoId: "COMPTEASSOID", ej: "", amountAwarded: 0, dateCommission: new Date()} as IOsirisRequestInformations, {}, undefined, []);
            await osirisService.addRequest(entity);
        });

        it('should throw error because no agrs', () => {
            expect(controller.findBySiret).rejects.toThrowError("Parse command need siret args");
        });

        it('should log a file', async () => {
            const consoleInfo = jest.spyOn(console, 'info').mockImplementation();
            await controller.findBySiret("FAKE_SIRET");
            expect(consoleInfo).toHaveBeenCalled();

            consoleInfo.mockReset();
        });

        it('should log a file in json', async () => {
            let data = "";
            const consoleInfo = jest.spyOn(console, 'info').mockImplementation((dataLogged: string) => data = dataLogged);
            await controller.findBySiret("FAKE_SIRET", "json");
            expect(JSON.parse(data)[0].legalInformations.siret).toBe("FAKE_SIRET");

            consoleInfo.mockReset();
        });
    });
});