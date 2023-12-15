import path from "path";
import { ObjectId } from "mongodb";
import ScdlCli from "../../../src/interfaces/cli/Scdl.cli";
import scdlService from "../../../src/modules/providers/scdl/scdl.service";
import miscScdlProducersRepository from "../../../src/modules/providers/scdl/repositories/miscScdlProducer.repository";
import miscScdlGrantRepository from "../../../src/modules/providers/scdl/repositories/miscScdlGrant.repository";

const PRODUCER_ID = "PRODUCER_ID";
const PRODUCER_NAME = "PRODUCER_NAME";

// jest.useFakeTimers().setSystemTime(new Date("2023-01-01"));

describe("SCDL CLI", () => {
    let cli;

    beforeEach(() => {
        cli = new ScdlCli();
    });
    describe("addProducer()", () => {
        it("should create MiscScdlProducerEntity", async () => {
            await cli.addProducer(PRODUCER_ID, PRODUCER_NAME);
            const document = await miscScdlProducersRepository.findByProducerId(PRODUCER_ID);
            expect(document).toMatchSnapshot({ _id: expect.any(ObjectId), lastUpdate: expect.any(Date) });
        });
    });

    describe("parse()", () => {
        it("should throw Error()", async () => {
            expect(() =>
                cli.parse(
                    path.resolve(__dirname, "../../../src/modules/providers/scdl/__fixtures__/SCDL.csv"),
                    "FAKE_ID",
                    new Date(),
                ),
            ).rejects.toThrowError(Error);
        });

        it("should add grants", async () => {
            await cli.addProducer(PRODUCER_ID, PRODUCER_NAME);
            await cli.parse(
                path.resolve(__dirname, "../../../src/modules/providers/scdl/__fixtures__/SCDL.csv"),
                PRODUCER_ID,
                new Date(),
            );
            const grants = await miscScdlGrantRepository.findAll();
            const expectedAny = grants.map(grant => ({
                _id: expect.any(ObjectId),
            }));
            expect(grants).toMatchSnapshot(expectedAny);
        });

        it("should update producer lastUpdate", async () => {
            const EXPORT_DATE = new Date("2023-01-01");
            const expected = EXPORT_DATE;
            await cli.addProducer(PRODUCER_ID, PRODUCER_NAME);
            await cli.parse(
                path.resolve(__dirname, "../../../src/modules/providers/scdl/__fixtures__/SCDL.csv"),
                PRODUCER_ID,
                EXPORT_DATE,
            );
            const actual = (await scdlService.getProducer(PRODUCER_ID))?.lastUpdate;
            expect(actual).toEqual(expected);
        });
    });
});
