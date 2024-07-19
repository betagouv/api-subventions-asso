import path from "path";
import { ObjectId } from "mongodb";
import ScdlCli from "../../../src/interfaces/cli/Scdl.cli";
import scdlService from "../../../src/modules/providers/scdl/scdl.service";
import miscScdlProducersRepository from "../../../src/modules/providers/scdl/repositories/miscScdlProducer.repository";
import miscScdlGrantRepository from "../../../src/modules/providers/scdl/repositories/miscScdlGrant.repository";
import MiscScdlProducer from "../../../src/modules/providers/scdl/__fixtures__/MiscScdlProducer";

describe("SCDL CLI", () => {
    let cli;
    const DATE_STR = "2022-12-12";

    beforeEach(() => {
        cli = new ScdlCli();
    });
    describe("addProducer()", () => {
        it("should create MiscScdlProducerEntity", async () => {
            await cli.addProducer(MiscScdlProducer.slug, MiscScdlProducer.name, MiscScdlProducer.siret);
            const document = await miscScdlProducersRepository.findBySlug(MiscScdlProducer.slug);
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
        describe.each`
            methodName    | test
            ${"parse"}    | ${testParseCsv}
            ${"parseXls"} | ${testParseXls}
        `("$methodName", ({ test }) => {
            it("should throw Error()", async () => {
                expect(() => test("FAKE_ID", DATE_STR)).rejects.toThrowError(Error);
            });

            it("should add grants with exercise from conventionDate", async () => {
                await cli.addProducer(MiscScdlProducer.slug, MiscScdlProducer.name, MiscScdlProducer.siret);
                await test("SCDL", MiscScdlProducer.slug, DATE_STR);
                const grants = await miscScdlGrantRepository.findAll();
                const expectedAny = grants.map(grant => ({
                    _id: expect.any(String),
                }));
                expect(grants).toMatchSnapshot(expectedAny);
            }, 10000);

            it("should add grants with exercise from its own column", async () => {
                await cli.addProducer(MiscScdlProducer.slug, MiscScdlProducer.name, MiscScdlProducer.siret);
                await test("SCDL_WITH_EXERCICE", MiscScdlProducer.slug, DATE_STR);
                const grants = await miscScdlGrantRepository.findAll();
                const expectedAny = grants.map(grant => ({
                    _id: expect.any(String),
                }));
                expect(grants).toMatchSnapshot(expectedAny);
            }, 10000);

            it("should update producer lastUpdate", async () => {
                const EXPORT_DATE = new Date("2023-01-01");
                const expected = EXPORT_DATE;
                await cli.addProducer(MiscScdlProducer.slug, MiscScdlProducer.name, MiscScdlProducer.siret);
                await test("SCDL", MiscScdlProducer.slug, EXPORT_DATE);
                const actual = (await scdlService.getProducer(MiscScdlProducer.slug))?.lastUpdate;
                expect(actual).toEqual(expected);
            }, 10000);
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
                const grants = await miscScdlGrantRepository.findAll();
                const expectedAny = grants.map(grant => ({
                    _id: expect.any(String),
                }));
                expect(grants).toMatchSnapshot(expectedAny);
            }, 20000);
        });
    });
});
