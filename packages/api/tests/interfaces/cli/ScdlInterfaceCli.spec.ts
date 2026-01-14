import path from "path";
import { ObjectId } from "mongodb";
import ScdlCli from "../../../src/interfaces/cli/Scdl.cli";
import miscScdlProducersPort from "../../../src/dataProviders/db/providers/scdl/miscScdlProducers.port";
import miscScdlGrantPort from "../../../src/dataProviders/db/providers/scdl/miscScdlGrant.port";
import dataLogPort from "../../../src/dataProviders/db/data-log/dataLog.port";
import { LOCAL_AUTHORITIES, SCDL_GRANT_DBOS } from "../../dataProviders/db/__fixtures__/scdl.fixtures";
import applicationFlatPort from "../../../src/dataProviders/db/applicationFlat/applicationFlat.port";
import notifyService from "../../../src/modules/notify/notify.service";
import { NotificationType } from "../../../src/modules/notify/@types/NotificationType";
import apiAssoService from "../../../src/modules/providers/apiAsso/apiAsso.service";

describe("SCDL CLI", () => {
    let mockApiAsso: jest.SpyInstance;
    let cli: ScdlCli;
    const FIRST_IMPORT_DATE = "2022-12-12";
    const SECOND_IMPORT_DATE = "2024-12-12";

    const PRODUCER = LOCAL_AUTHORITIES[0]; // producer already persisted in jest.config.integ.init.ts

    beforeEach(async () => {
        // should mock sendRequest but need a full StructureDto fixture
        // this should also be in port and mocked in any integ test
        mockApiAsso = jest
            .spyOn(apiAssoService, "findAssociationBySiren")
            // @ts-expect-error: mock only need informations
            .mockResolvedValue({ denomination_siren: [{ value: PRODUCER.name }] });
        // do not change this before scdl providers list async init has been refactored
        // see jest.config.integ.setup beforeEach to understand this hook necessity
        const producers = await miscScdlProducersPort.findAll();
        if (!producers.find(producer => producer.siret === PRODUCER.siret)) {
            await miscScdlProducersPort.create(PRODUCER);
        }

        cli = new ScdlCli();
    });

    describe("addProducer()", () => {
        it("should create MiscScdlProducerEntity", async () => {
            mockApiAsso.mockResolvedValueOnce({ denomination_siren: [{ value: LOCAL_AUTHORITIES[1].name }] });
            // use second item because first is already created in beforeEach
            await cli.addProducer(LOCAL_AUTHORITIES[1].siret);
            const document = await miscScdlProducersPort.findBySiret(LOCAL_AUTHORITIES[1].siret);
            expect(document).toMatchSnapshot({ _id: expect.any(ObjectId) });
        });
    });

    function testParseCsv(fileNameNoExtension, producerSiret, exportDate) {
        return cli.parse(
            path.resolve(__dirname, `../../../src/modules/providers/scdl/__fixtures__/${fileNameNoExtension}.csv`),
            producerSiret,
            exportDate,
        );
    }

    function testParseXls(fileNameNoExtension, producerSiret, exportDate) {
        return cli.parseXls(
            path.resolve(__dirname, `../../../src/modules/providers/scdl/__fixtures__/${fileNameNoExtension}.xlsx`),
            producerSiret,
            exportDate,
            "Du 01-01-2023 au 30-06-2023",
            2,
        );
    }

    describe("parsing", () => {
        describe.each`
            methodName | test
            ${"parse"} | ${testParseCsv}
        `("$methodName", ({ test }) => {
            it("throw error if SIRET not valid", async () => {
                const INVALID_SIRET = 1234;
                expect(() => test("FAKE_ID", INVALID_SIRET, FIRST_IMPORT_DATE)).rejects.toThrow(
                    `Invalid Siret : ${INVALID_SIRET}`,
                );
            });

            it("throw error if producer not found", async () => {
                expect(() => test("FAKE_ID", "10000000012002", FIRST_IMPORT_DATE)).rejects.toThrow(
                    "Producer does not match any producer in database",
                );
            });

            it("should add grants with exercise from conventionDate", async () => {
                await test("SCDL", PRODUCER.siret, FIRST_IMPORT_DATE);
                const grants = await miscScdlGrantPort.findAll();
                const expectedAny = grants.map(() => ({
                    _id: expect.any(String),
                    updateDate: expect.any(Date),
                }));
                expect(grants).toMatchSnapshot(expectedAny);
            });

            it("should add grants with exercise from its own column", async () => {
                await test("SCDL_WITH_EXERCICE", PRODUCER.siret, FIRST_IMPORT_DATE);
                const grants = await miscScdlGrantPort.findAll(); // only grants from 2023 as it only saves most recent exercise in multi exercise files
                const expectedAny = grants.map(() => ({
                    _id: expect.any(String),
                    updateDate: expect.any(Date),
                }));
                expect(grants).toMatchSnapshot(expectedAny);
            });

            it("registers new import in data-log", async () => {
                await test("SCDL", PRODUCER.siret, FIRST_IMPORT_DATE);
                const actual = await dataLogPort.findAll();
                expect(
                    actual.map(dataLog => ({ ...dataLog, _id: expect.any(String), integrationDate: expect.any(Date) })),
                ).toMatchSnapshot();
            });

            it("persists all data on first producer's importation", async () => {
                await test("SCDL", PRODUCER.siret, FIRST_IMPORT_DATE);
                const actual = await miscScdlGrantPort.findAll();
                expect(actual?.[0]).toMatchSnapshot({ updateDate: expect.any(Date) });
            });

            it("persists new data when data from imported exercises already in DB", async () => {
                await test("SCDL", PRODUCER.siret, FIRST_IMPORT_DATE);
                await test("SCDL_SECOND_IMPORT", PRODUCER.siret, SECOND_IMPORT_DATE);
                const actual = await miscScdlGrantPort.findAll();
                const expectedAny = actual.map(() => ({ updateDate: expect.any(Date) }));
                expect(actual.length).toBe(9); // 9 matches "SCDL_SECOND_IMPORT" length as it should clean exercise and so removing lines from "SCDL" file
                expect(actual).toMatchSnapshot(expectedAny);
            });

            it("persists all data in ApplicationFlat on first producer's importation", async () => {
                await test("SCDL", PRODUCER.siret, FIRST_IMPORT_DATE);
                const actual = await applicationFlatPort.findAll();
                expect(actual?.[0]).toMatchSnapshot({ updateDate: expect.any(Date) });
            });

            it("persists new data in ApplicationFlat when data from imported exercises already in DB", async () => {
                await test("SCDL", PRODUCER.siret, FIRST_IMPORT_DATE);
                await test("SCDL_SECOND_IMPORT", PRODUCER.siret, SECOND_IMPORT_DATE);
                const actual = await applicationFlatPort.findAll();
                const expectedAny = actual.map(() => ({ updateDate: expect.any(Date) }));
                expect(actual).toMatchSnapshot(expectedAny);
            });

            it("throws an error when imported data contains less data what is persisted for a given exercice", async () => {
                await test("SCDL", PRODUCER.siret, FIRST_IMPORT_DATE);
                await expect(test("SCDL_LESS_DATA", PRODUCER.siret, SECOND_IMPORT_DATE)).rejects.toThrow(
                    RegExp(
                        `You are trying to import less grants for exercise 20\\d{2} than what already exist in the database for producer's SIRET ${PRODUCER.siret}\\.`,
                    ),
                );
            });

            it.each`
                error                                                                                           | file
                ${"Missing required headers in file SCDL_ONE_MISSING_MANDATORY.csv : idBeneficiaire"}           | ${"SCDL_ONE_MISSING_MANDATORY"}
                ${"Missing required headers in file SCDL_MANY_MISSING_MANDATORY.csv : idBeneficiaire, montant"} | ${"SCDL_MANY_MISSING_MANDATORY"}
            `("throws an error if missing mandatory header is missing", async ({ error, file }) => {
                await expect(test(file, PRODUCER.siret, FIRST_IMPORT_DATE)).rejects.toThrow(error);
            });

            it("notifies data import success", async () => {
                const spyNotify = jest.spyOn(notifyService, "notify");
                await test("SCDL", PRODUCER.siret, FIRST_IMPORT_DATE);
                expect(spyNotify).toHaveBeenCalledWith(NotificationType.DATA_IMPORT_SUCCESS, {
                    providerName: PRODUCER.name,
                    providerSiret: PRODUCER.siret,
                    exportDate: new Date(FIRST_IMPORT_DATE),
                });
            });
        });

        describe("edge cases", () => {
            it("should add grants with exercise from its own column", async () => {
                await cli.parseXls(
                    path.resolve(
                        __dirname,
                        `../../../src/modules/providers/scdl/__fixtures__/SCDL_WITH_EXERCICE_ALT.xlsx`,
                    ),
                    PRODUCER.siret,
                    FIRST_IMPORT_DATE,
                    "Sheet1",
                );
                const grants = await miscScdlGrantPort.findAll();
                const grantExercices = grants.map(g => g.exercice);
                expect(grantExercices).toMatchSnapshot();
            }, 20000);

            it.each`
                methodName    | test            | exercise
                ${"parse"}    | ${testParseCsv} | ${2019}
                ${"parseXls"} | ${testParseXls} | ${2023}
            `(
                "$methodName should throw error if one exercise from import contain less data that what exist in DB",
                async ({ test, exercise }) => {
                    await test("SCDL", PRODUCER.siret, FIRST_IMPORT_DATE); // import all grants
                    await miscScdlGrantPort.createMany([
                        { ...SCDL_GRANT_DBOS[0], exercice: exercise, allocatorSiret: PRODUCER.siret }, // scdl grant dbo uses PRODUCER
                    ]); // add one more grant in DB

                    await expect(async () => await test("SCDL", PRODUCER.siret, FIRST_IMPORT_DATE)).rejects.toThrow(
                        `You are trying to import less grants for exercise ${exercise} than what already exist in the database for producer's SIRET ${PRODUCER.siret}.`,
                    );
                },
            );
        });
    });

    describe("initApplicationFlat", () => {
        it("creates proper applicationFlat entities in collection", async () => {
            await miscScdlGrantPort.createMany(SCDL_GRANT_DBOS);
            await cli.initApplicationFlat();
            const actual = await applicationFlatPort.findAll();
            expect(actual).toMatchSnapshot();
        });
    });
});
