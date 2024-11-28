import path from "path";
import IOsirisRequestInformations from "../../../src/modules/providers/osiris/@types/IOsirisRequestInformations";
import OsirisRequestEntity from "../../../src/modules/providers/osiris/entities/OsirisRequestEntity";
import OsirisCli from "../../../src/interfaces/cli/Osiris.cli";
import OsirisParser from "../../../src/modules/providers/osiris/osiris.parser";
import osirisService from "../../../src/modules/providers/osiris/osiris.service";
import dataLogRepository from "../../../src/dataProviders/db/data-log/dataLog.port";

describe("OsirisCli", () => {
    const spys: jest.SpyInstance<unknown>[] = [];
    beforeAll(() => {
        spys.push(jest.spyOn(OsirisParser, "parseRequests"), jest.spyOn(OsirisParser, "parseActions"));
    });

    afterAll(() => {
        spys.forEach(spy => spy.mockReset());
    });

    describe("parse cli requests", () => {
        let controller: OsirisCli;

        beforeEach(() => {
            controller = new OsirisCli();
        });

        it("should call osiris parser", async () => {
            const filePath = path.resolve(
                __dirname,
                "../../modules/providers/osiris/__fixtures__/SuiviDossiers_test.xls",
            );
            await controller.parse("requests", filePath, "2022");
            expect(OsirisParser.parseRequests).toHaveBeenCalled();
        });

        it("should throw error because no args", () => {
            expect(controller.parse).rejects.toThrowError("Parse command need type, extractYear and file args");
        });

        it("should throw an error because the file does not exist", () => {
            expect(() => controller.parse("requests", "fake/path", "2022")).rejects.toThrowError(
                "File not found fake/path",
            );
        });

        it("should register new import", async () => {
            const filePath = path.resolve(
                __dirname,
                "../../modules/providers/osiris/__fixtures__/SuiviDossiers_test.xls",
            );
            await controller.parse("requests", filePath, "2022");

            const actual = await dataLogRepository.findAll();
            expect(actual?.[0]).toMatchObject({
                editionDate: expect.any(Date),
                fileName: "SuiviDossiers_test.xls",
                integrationDate: expect.any(Date),
                providerId: "osiris",
            });
        });
    });

    describe("parse cli actions", () => {
        let controller: OsirisCli;
        let consoleWarn: jest.SpyInstance;

        beforeEach(() => {
            controller = new OsirisCli();
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            consoleWarn = jest.spyOn(console, "warn").mockImplementation(() => {});
        });

        afterEach(() => {
            consoleWarn.mockClear();
        });

        afterAll(() => {
            consoleWarn.mockReset();
        });

        it("should call osiris parser", async () => {
            const filePath = path.resolve(
                __dirname,
                "../../modules/providers/osiris/__fixtures__/SuiviActions_test.xls",
            );
            await controller.parse("actions", filePath, "2022");
            expect(consoleWarn).not.toBeCalled();
            expect(OsirisParser.parseActions).toHaveBeenCalled();
        });

        it("should throw error because no args", () => {
            expect(controller.parse).rejects.toThrowError("Parse command need type, extractYear and file args");
        });

        it("should throw an error because the file does not exist", () => {
            expect(() => controller.parse("actions", "fake/path", "2022")).rejects.toThrowError(
                "File not found fake/path",
            );
        });

        it("should register new import", async () => {
            const filePath = path.resolve(
                __dirname,
                "../../modules/providers/osiris/__fixtures__/SuiviActions_test.xls",
            );
            await controller.parse("actions", filePath, "2022");

            const actual = await dataLogRepository.findAll();
            expect(actual?.[0]).toMatchObject({
                editionDate: expect.any(Date),
                fileName: "SuiviActions_test.xls",
                integrationDate: expect.any(Date),
                providerId: "osiris",
            });
        });
    });

    describe("parse cli unknown", () => {
        let controller: OsirisCli;

        beforeEach(() => {
            controller = new OsirisCli();
        });

        it("should throw an error because unknown is not valid type", () => {
            const filePath = path.resolve(
                __dirname,
                "../../modules/providers/osiris/__fixtures__/SuiviDossiers_test.xls",
            );

            expect(() => controller.parse("unknown" as "actions", filePath, "2022")).rejects.toThrowError(
                "The type unknown is not taken into account",
            );
        });
    });

    describe("findByRna cli ", () => {
        let controller: OsirisCli;

        beforeEach(async () => {
            controller = new OsirisCli();

            const entity = new OsirisRequestEntity(
                { siret: "00000000000000", rna: "W123456789", name: "NAME" },
                {
                    osirisId: "FAKE_ID_2",
                    compteAssoId: "COMPTEASSOID",
                    ej: "",
                    amountAwarded: 0,
                    dateCommission: new Date(),
                } as IOsirisRequestInformations,
                {},
                undefined,
                [],
            );
            await osirisService.addRequest(entity);
        });

        it("should throw error because no agrs", () => {
            expect(controller.findByRna).rejects.toThrowError("Parse command need rna args");
        });

        it("should log a file", async () => {
            const consoleInfo = jest.spyOn(console, "info").mockImplementation();
            await controller.findByRna("W123456789");
            expect(consoleInfo).toHaveBeenCalled();

            consoleInfo.mockReset();
        });

        it("should log a file in json", async () => {
            let data = "";
            const consoleInfo = jest
                .spyOn(console, "info")
                .mockImplementation((dataLogged: string) => (data = dataLogged));
            await controller.findByRna("W123456789", "json");
            expect(JSON.parse(data)[0].legalInformations.rna).toBe("W123456789");

            consoleInfo.mockReset();
        });
    });

    describe("findBySiret cli ", () => {
        let controller: OsirisCli;

        beforeEach(async () => {
            controller = new OsirisCli();

            const entity = new OsirisRequestEntity(
                { siret: "00000000000000", rna: "W123456789", name: "NAME" },
                {
                    osirisId: "FAKE_ID_2",
                    compteAssoId: "COMPTEASSOID",
                    ej: "",
                    amountAwarded: 0,
                    dateCommission: new Date(),
                } as IOsirisRequestInformations,
                {},
                undefined,
                [],
            );
            await osirisService.addRequest(entity);
        });

        it("should throw error because no agrs", () => {
            expect(controller.findBySiret).rejects.toThrowError("Parse command need siret args");
        });

        it("should log a file", async () => {
            const consoleInfo = jest.spyOn(console, "info").mockImplementation();
            await controller.findBySiret("00000000000000");
            expect(consoleInfo).toHaveBeenCalled();

            consoleInfo.mockReset();
        });

        it("should log a file in json", async () => {
            let data = "";
            const consoleInfo = jest
                .spyOn(console, "info")
                .mockImplementation((dataLogged: string) => (data = dataLogged));
            await controller.findBySiret("00000000000000", "json");
            expect(JSON.parse(data)[0].legalInformations.siret).toBe("00000000000000");

            consoleInfo.mockReset();
        });
    });
});
