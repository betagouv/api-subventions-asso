import path from "path";
import { ObjectId } from "mongodb";
import ScdlCli from "../../../src/interfaces/cli/Scdl.cli";
import scdlService from "../../../src/modules/providers/scdl/scdl.service";
import miscScdlProducersPort from "../../../src/dataProviders/db/providers/scdl/miscScdlProducers.port";
import miscScdlGrantPort from "../../../src/dataProviders/db/providers/scdl/miscScdlGrant.port";
import MiscScdlProducer from "../../../src/modules/providers/scdl/__fixtures__/MiscScdlProducer";
import dataLogPort from "../../../src/dataProviders/db/data-log/dataLog.port";
import { SCDL_GRANT_DBOS } from "../../dataProviders/db/__fixtures__/scdl.fixtures";

describe("SCDL CLI", () => {
    let cli: ScdlCli;
    const FIRST_IMPORT_DATE = "2022-12-12";
    const SECOND_IMPORT_DATE = "2024-12-12";

    beforeEach(() => {
        cli = new ScdlCli();
    });

    describe("addProducer()", () => {
        it("should create MiscScdlProducerEntity", async () => {
            await cli.addProducer(MiscScdlProducer.slug, MiscScdlProducer.name, MiscScdlProducer.siret);
            const document = await miscScdlProducersPort.findBySlug(MiscScdlProducer.slug);
            expect(document).toMatchSnapshot({ _id: expect.any(ObjectId), lastUpdate: expect.any(Date) });
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
        beforeEach(async () => {
            await miscScdlProducersPort.create({
                slug: MiscScdlProducer.slug,
                name: MiscScdlProducer.name,
                siret: MiscScdlProducer.siret,
                lastUpdate: PRODUCER_CREATION_DATE,
            });
        });

        const PRODUCER_CREATION_DATE = new Date("2025-01-01");
        describe.each`
            methodName    | test
            ${"parse"}    | ${testParseCsv}
            ${"parseXls"} | ${testParseXls}
        `("$methodName", ({ test }) => {
            it("should throw Error()", async () => {
                expect(() => test("FAKE_ID", FIRST_IMPORT_DATE)).rejects.toThrow(Error);
            });

            it("should add grants with exercise from conventionDate", async () => {
                await test("SCDL", MiscScdlProducer.slug, FIRST_IMPORT_DATE);
                const grants = await miscScdlGrantPort.findAll();
                const expectedAny = grants.map(() => ({
                    _id: expect.any(String),
                    updateDate: expect.any(Date),
                }));
                expect(grants).toMatchSnapshot(expectedAny);
            });

            it("should add grants with exercise from its own column", async () => {
                await test("SCDL_WITH_EXERCICE", MiscScdlProducer.slug, FIRST_IMPORT_DATE);
                const grants = await miscScdlGrantPort.findAll(); // only grants from 2023 as it only saves most recent exercise in multi exercise files
                const expectedAny = grants.map(() => ({
                    _id: expect.any(String),
                    updateDate: expect.any(Date),
                }));
                expect(grants).toMatchSnapshot(expectedAny);
            });

            // could not find another way to test the date update
            // jest.useFakeTimers() does not work with mongoDB (at least findOne method) and crash the test
            it("should update producer lastUpdate", async () => {
                await test("SCDL", MiscScdlProducer.slug);
                const actual = (await scdlService.getProducer(MiscScdlProducer.slug))?.lastUpdate;
                expect(actual).not.toEqual(PRODUCER_CREATION_DATE);
            });

            it("registers new import in data-log", async () => {
                await test("SCDL", MiscScdlProducer.slug, FIRST_IMPORT_DATE);
                const actual = await dataLogPort.findAll();
                expect(
                    actual.map(dataLog => ({ ...dataLog, _id: expect.any(String), integrationDate: expect.any(Date) })),
                ).toMatchSnapshot();
            });

            it("persists all data on first producer's importation", async () => {
                await test("SCDL", MiscScdlProducer.slug, FIRST_IMPORT_DATE);
                const actual = await miscScdlGrantPort.findAll();
                expect(actual?.[0]).toMatchSnapshot({ updateDate: expect.any(Date) });
            });

            it("persists new data when data from imported exercises already in DB", async () => {
                await test("SCDL", MiscScdlProducer.slug, FIRST_IMPORT_DATE);
                await test("SCDL_SECOND_IMPORT", MiscScdlProducer.slug, SECOND_IMPORT_DATE);
                const actual = await miscScdlGrantPort.findAll();
                const expectedAny = actual.map(() => ({ updateDate: expect.any(Date) }));
                expect(actual).toMatchSnapshot(expectedAny);
            });

            it("throws an error when imported data contains less data what is persisted for a given exercice", async () => {
                await test("SCDL", MiscScdlProducer.slug, FIRST_IMPORT_DATE);
                await expect(test("SCDL_LESS_DATA", MiscScdlProducer.slug, SECOND_IMPORT_DATE)).rejects.toThrow(
                    RegExp(
                        "You are trying to import less grants for exercise 20\\d{2} than what already exist in the database for producer bretagne\\.",
                    ),
                );
            });

            it.each`
                error                                                         | file
                ${"Mandatory column associationSiret is missing."}            | ${"SCDL_ONE_MISSING_MANDATORY"}
                ${"Mandatory columns associationSiret - amount are missing."} | ${"SCDL_MANY_MISSING_MANDATORY"}
            `("throws an error if missing mandatory header is missing", async ({ error, file }) => {
                await expect(test(file, MiscScdlProducer.slug, FIRST_IMPORT_DATE)).rejects.toThrow(error);
            });
        });

        describe("edge cases", () => {
            it("should add grants with exercise from its own column", async () => {
                await cli.parseXls(
                    path.resolve(
                        __dirname,
                        `../../../src/modules/providers/scdl/__fixtures__/SCDL_WITH_EXERCICE_ALT.xlsx`,
                    ),
                    MiscScdlProducer.slug,
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
                    await test("SCDL", MiscScdlProducer.slug, FIRST_IMPORT_DATE); // import all grants
                    await miscScdlGrantPort.createMany([
                        { ...SCDL_GRANT_DBOS[0], exercice: exercise, producerSlug: MiscScdlProducer.slug },
                    ]); // add one more grant in DB

                    await expect(
                        async () => await test("SCDL", MiscScdlProducer.slug, FIRST_IMPORT_DATE),
                    ).rejects.toThrow(
                        `You are trying to import less grants for exercise ${exercise} than what already exist in the database for producer ${MiscScdlProducer.slug}.`,
                    );
                },
            );
        });
    });
});
