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

describe("SCDL CLI", () => {
    let cli: ScdlCli;
    const FIRST_IMPORT_DATE = "2022-12-12";
    const SECOND_IMPORT_DATE = "2024-12-12";

    const PRODUCER = LOCAL_AUTHORITIES[0]; // producer already persisted in jest.config.integ.init.ts

    beforeEach(async () => {
        // do not change this before scdl providers list async init has been refactored
        // see jest.config.integ.setup beforeEach to understand this hook necessity
        const producers = await miscScdlProducersPort.findAll();
        if (!producers.find(producer => producer.slug === LOCAL_AUTHORITIES[0].slug)) {
            await miscScdlProducersPort.create(LOCAL_AUTHORITIES[0]);
        }

        cli = new ScdlCli();
    });

    describe("addProducer()", () => {
        it("should create MiscScdlProducerEntity", async () => {
            // use second item because first is already created in beforeEach
            await cli.addProducer(LOCAL_AUTHORITIES[1].slug, LOCAL_AUTHORITIES[1].name, LOCAL_AUTHORITIES[1].siret);
            const document = await miscScdlProducersPort.findBySlug(PRODUCER.slug);
            expect(document).toMatchSnapshot({ _id: expect.any(ObjectId) });
        });
    });

    function testParseCsv(fileNameNoExtension, producerSlug, exportDate) {
        return cli.parse(
            path.resolve(__dirname, `../../../src/modules/providers/scdl/__fixtures__/${fileNameNoExtension}.csv`),
            producerSlug,
            exportDate,
        );
    }

    function testParseXls(fileNameNoExtension, producerSlug, exportDate) {
        return cli.parseXls(
            path.resolve(__dirname, `../../../src/modules/providers/scdl/__fixtures__/${fileNameNoExtension}.xlsx`),
            producerSlug,
            exportDate,
            "Du 01-01-2023 au 30-06-2023",
            2,
        );
    }

    describe("parsing", () => {
        describe.each`
            methodName    | test
            ${"parse"}    | ${testParseCsv}
            ${"parseXls"} | ${testParseXls}
        `("$methodName", ({ test }) => {
            it("should throw Error()", async () => {
                expect(() => test("FAKE_ID", FIRST_IMPORT_DATE)).rejects.toThrow(Error);
            });

            it("should add grants with exercise from conventionDate", async () => {
                await test("SCDL", PRODUCER.slug, FIRST_IMPORT_DATE);
                const grants = await miscScdlGrantPort.findAll();
                const expectedAny = grants.map(() => ({
                    _id: expect.any(String),
                    updateDate: expect.any(Date),
                }));
                expect(grants).toMatchSnapshot(expectedAny);
            });

            it("should add grants with exercise from its own column", async () => {
                await test("SCDL_WITH_EXERCICE", PRODUCER.slug, FIRST_IMPORT_DATE);
                const grants = await miscScdlGrantPort.findAll(); // only grants from 2023 as it only saves most recent exercise in multi exercise files
                const expectedAny = grants.map(() => ({
                    _id: expect.any(String),
                    updateDate: expect.any(Date),
                }));
                expect(grants).toMatchSnapshot(expectedAny);
            });

            it("registers new import in data-log", async () => {
                await test("SCDL", PRODUCER.slug, FIRST_IMPORT_DATE);
                const actual = await dataLogPort.findAll();
                expect(
                    actual.map(dataLog => ({ ...dataLog, _id: expect.any(String), integrationDate: expect.any(Date) })),
                ).toMatchSnapshot();
            });

            it("persists all data on first producer's importation", async () => {
                await test("SCDL", PRODUCER.slug, FIRST_IMPORT_DATE);
                const actual = await miscScdlGrantPort.findAll();
                expect(actual?.[0]).toMatchSnapshot({ updateDate: expect.any(Date) });
            });

            it("persists new data when data from imported exercises already in DB", async () => {
                await test("SCDL", PRODUCER.slug, FIRST_IMPORT_DATE);
                await test("SCDL_SECOND_IMPORT", PRODUCER.slug, SECOND_IMPORT_DATE);
                const actual = await miscScdlGrantPort.findAll();
                const expectedAny = actual.map(() => ({ updateDate: expect.any(Date) }));
                expect(actual).toMatchSnapshot(expectedAny);
            });

            it("persists all data in ApplicationFlat on first producer's importation", async () => {
                await test("SCDL", PRODUCER.slug, FIRST_IMPORT_DATE);
                const actual = await applicationFlatPort.findAll();
                expect(actual?.[0]).toMatchSnapshot({ updateDate: expect.any(Date) });
            });

            it("persists new data in ApplicationFlat when data from imported exercises already in DB", async () => {
                await test("SCDL", PRODUCER.slug, FIRST_IMPORT_DATE);
                await test("SCDL_SECOND_IMPORT", PRODUCER.slug, SECOND_IMPORT_DATE);
                const actual = await applicationFlatPort.findAll();
                const expectedAny = actual.map(() => ({ updateDate: expect.any(Date) }));
                expect(actual).toMatchSnapshot(expectedAny);
            });

            it("throws an error when imported data contains less data what is persisted for a given exercice", async () => {
                await test("SCDL", PRODUCER.slug, FIRST_IMPORT_DATE);
                await expect(test("SCDL_LESS_DATA", PRODUCER.slug, SECOND_IMPORT_DATE)).rejects.toThrow(
                    RegExp(
                        `You are trying to import less grants for exercise 20\\d{2} than what already exist in the database for producer ${PRODUCER.slug}\\.`,
                    ),
                );
            });

            it.each`
                error                                                         | file
                ${"Mandatory column associationSiret is missing."}            | ${"SCDL_ONE_MISSING_MANDATORY"}
                ${"Mandatory columns associationSiret - amount are missing."} | ${"SCDL_MANY_MISSING_MANDATORY"}
            `("throws an error if missing mandatory header is missing", async ({ error, file }) => {
                await expect(test(file, PRODUCER.slug, FIRST_IMPORT_DATE)).rejects.toThrow(error);
            });

            it("notifies data import success", async () => {
                const spyNotify = jest.spyOn(notifyService, "notify");
                await test("SCDL", PRODUCER.slug, FIRST_IMPORT_DATE);
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
                    PRODUCER.slug,
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
                    await test("SCDL", PRODUCER.slug, FIRST_IMPORT_DATE); // import all grants
                    await miscScdlGrantPort.createMany([
                        { ...SCDL_GRANT_DBOS[0], exercice: exercise, producerSlug: PRODUCER.slug }, // scdl grant dbo uses PRODUCER
                    ]); // add one more grant in DB

                    await expect(async () => await test("SCDL", PRODUCER.slug, FIRST_IMPORT_DATE)).rejects.toThrow(
                        `You are trying to import less grants for exercise ${exercise} than what already exist in the database for producer ${PRODUCER.slug}.`,
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
