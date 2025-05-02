import path from "path";
import { ObjectId } from "mongodb";
import ScdlCli from "../../../src/interfaces/cli/Scdl.cli";
import scdlService from "../../../src/modules/providers/scdl/scdl.service";
import miscScdlProducersPort from "../../../src/dataProviders/db/providers/scdl/miscScdlProducers.port";
import miscScdlGrantPort from "../../../src/dataProviders/db/providers/scdl/miscScdlGrant.port";
import MiscScdlProducer from "../../../src/modules/providers/scdl/__fixtures__/MiscScdlProducer";
import dataLogPort from "../../../src/dataProviders/db/data-log/dataLog.port";

describe("SCDL CLI", () => {
    let cli: ScdlCli;
    const DATE_STR = "2022-12-12";

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
        const PRODUCER_CREATION_DATE = new Date("2025-01-01");
        describe.each`
            methodName    | test
            ${"parse"}    | ${testParseCsv}
            ${"parseXls"} | ${testParseXls}
        `("$methodName", ({ test }) => {
            beforeEach(async () => {
                await miscScdlProducersPort.create({
                    slug: MiscScdlProducer.slug,
                    name: MiscScdlProducer.name,
                    siret: MiscScdlProducer.siret,
                    lastUpdate: PRODUCER_CREATION_DATE,
                });
            });

            it("should throw Error()", async () => {
                expect(() => test("FAKE_ID", DATE_STR)).rejects.toThrowError(Error);
            });

            it("should add grants with exercise from conventionDate", async () => {
                await test("SCDL", MiscScdlProducer.slug, DATE_STR);
                const grants = await miscScdlGrantPort.findAll();
                const expectedAny = grants.map(() => ({
                    _id: expect.any(String),
                }));
                expect(grants).toMatchSnapshot(expectedAny);
            });

            it("should add grants with exercise from its own column", async () => {
                await test("SCDL_WITH_EXERCICE", MiscScdlProducer.slug, DATE_STR);
                const grants = await miscScdlGrantPort.findAll();
                const expectedAny = grants.map(() => ({
                    _id: expect.any(String),
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

            it("should register new import", async () => {
                await test("SCDL", MiscScdlProducer.slug, DATE_STR);
                const actual = await dataLogPort.findAll();
                expect(actual?.[0]).toMatchObject({
                    editionDate: new Date(DATE_STR),
                    fileName: expect.any(String),
                    integrationDate: expect.any(Date),
                    providerId: MiscScdlProducer.slug,
                });
            });
        });

        describe("edge cases", () => {
            it("should add grants with exercise from its own column", async () => {
                await cli.addProducer(MiscScdlProducer.slug, MiscScdlProducer.name, MiscScdlProducer.siret);

                await cli.parseXls(
                    path.resolve(
                        __dirname,
                        `../../../src/modules/providers/scdl/__fixtures__/SCDL_WITH_EXERCICE_ALT.xlsx`,
                    ),
                    MiscScdlProducer.slug,
                    DATE_STR,
                    "Sheet1",
                );
                const grants = await miscScdlGrantPort.findAll();
                const grantExercices = grants.map(g => g.exercice);
                expect(grantExercices).toMatchSnapshot();
            }, 20000);
        });
    });
});
