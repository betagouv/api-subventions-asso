import path from "path";
import OsirisCli from "../../../src/adapters/inputs/cli/Osiris.cli";
import OsirisParser from "../../../src/modules/providers/osiris/osiris.parser";
import dataLogAdapter from "../../../src/adapters/outputs/db/data-log/data-log.adapter";
import { osirisActionAdapter, osirisRequestAdapter } from "../../../src/adapters/outputs/db/providers/osiris";
import { REQUEST_DBO } from "../../../src/modules/providers/osiris/__fixtures__/osiris.request.fixtures";
import { ACTION_DBO } from "../../../src/modules/providers/osiris/__fixtures__/osiris.action.fixtures";
import applicationFlatAdapter from "../../../src/adapters/outputs/db/application-flat/application-flat.adapter";

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
            expect(controller.parse).rejects.toThrow("Parse command need type, extractYear and file args");
        });

        it("should throw an error because the file does not exist", () => {
            expect(() => controller.parse("requests", "fake/path", "2022")).rejects.toThrow("File not found fake/path");
        });

        it("should register new import", async () => {
            const filePath = path.resolve(
                __dirname,
                "../../modules/providers/osiris/__fixtures__/SuiviDossiers_test.xls",
            );
            await controller.parse("requests", filePath, "2022");

            const actual = await dataLogAdapter.findAll();
            expect(actual?.[0]).toMatchObject({
                editionDate: expect.any(Date),
                fileName: "SuiviDossiers_test.xls",
                integrationDate: expect.any(Date),
                providerId: "osiris",
            });
        });

        it("persists requests", async () => {
            const filePath = path.resolve(
                __dirname,
                "../../modules/providers/osiris/__fixtures__/SuiviDossiers_test.xls",
            );
            await controller.parse("requests", filePath, "2022");
            const requests = await osirisRequestAdapter.findAll();
            expect(
                requests.map(request => ({ ...request, _id: expect.any(String), updateDate: expect.any(Date) })),
            ).toMatchSnapshot();
        });
    });

    describe("parse cli actions", () => {
        let controller: OsirisCli;
        let consoleWarn: jest.SpyInstance;

        beforeEach(() => {
            controller = new OsirisCli();

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
            expect(controller.parse).rejects.toThrow("Parse command need type, extractYear and file args");
        });

        it("should throw an error because the file does not exist", () => {
            expect(() => controller.parse("actions", "fake/path", "2022")).rejects.toThrow("File not found fake/path");
        });

        it("should register new import", async () => {
            const filePath = path.resolve(
                __dirname,
                "../../modules/providers/osiris/__fixtures__/SuiviActions_test.xls",
            );
            await controller.parse("actions", filePath, "2022");

            const actual = await dataLogAdapter.findAll();
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

            expect(() => controller.parse("unknown" as "actions", filePath, "2022")).rejects.toThrow(
                "The type unknown is not taken into account",
            );
        });
    });

    describe("application flat commands", () => {
        beforeEach(async () => {
            // jest.useFakeTimers().setSystemTime(new Date("2025-08-05"));
            await osirisRequestAdapter.add(REQUEST_DBO);
            await osirisActionAdapter.add(ACTION_DBO);
            // jest.useFakeTimers().useRealTimers();
        });

        describe("initApplicationFlat", () => {
            it("creates applications flat from requests and actions", async () => {
                await new OsirisCli().initApplicationFlat();
                const applications = await applicationFlatAdapter.findAll();
                expect(applications).toMatchSnapshot();
            });
        });

        describe("syncApplicationFlat", () => {
            it("creates applications flat from requests and actions", async () => {
                await new OsirisCli().syncApplicationFlat(REQUEST_DBO.providerInformations.exercise);
                const applications = await applicationFlatAdapter.findAll();
                expect(applications).toMatchSnapshot();
            });

            it("creates no applications flat if given exercise match no requests", async () => {
                await new OsirisCli().syncApplicationFlat(2000);
                const applications = await applicationFlatAdapter.findAll();
                expect(applications).toMatchSnapshot();
            });
        });
    });
});
