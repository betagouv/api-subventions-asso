import ChorusCli from "../../../src/interfaces/cli/Chorus.cli";
import path from "path";
import chorusLinePort from "../../../src/dataProviders/db/providers/chorus/chorus.line.port";
import dataLogPort from "../../../src/dataProviders/db/data-log/dataLog.port";
import paymentFlatPort from "../../../src/dataProviders/db/paymentFlat/paymentFlat.port";

describe("ChorusCli", () => {
    describe("parse cli requests", () => {
        let controller: ChorusCli;
        const EXPORT_DATE = "2023-12-06";
        // change this when you update the fixture
        const NB_ASSOS_IN_FILES = 6;

        beforeEach(() => {
            controller = new ChorusCli();
        });

        // file should have 6 associations and 1 company's payments
        it("should save association but not companies' payments", async () => {
            const expected = NB_ASSOS_IN_FILES;
            const filePath = path.resolve(__dirname, "./__fixtures__/new-chorus-export.xlsx");
            await controller.parse(filePath, EXPORT_DATE);
            const actual = (await chorusLinePort.cursorFind().toArray()).length;
            expect(actual).toEqual(expected);
        });

        // rerun above test twice
        it("should not save duplicates", async () => {
            const expected = NB_ASSOS_IN_FILES;
            await chorusLinePort.createIndexes();
            const filePath = path.resolve(__dirname, "./__fixtures__/new-chorus-export.xlsx");
            await controller.parse(filePath, EXPORT_DATE);
            await controller.parse(filePath, EXPORT_DATE);
            const actual = (await chorusLinePort.cursorFind().toArray()).length;
            expect(actual).toEqual(expected);
        });

        it("should register new import", async () => {
            const filePath = path.resolve(__dirname, "./__fixtures__/new-chorus-export.xlsx");
            await controller.parse(filePath, EXPORT_DATE);
            const actual = await dataLogPort.findAll();
            expect(actual?.[0]).toMatchObject({
                editionDate: new Date(EXPORT_DATE),
                fileName: "new-chorus-export.xlsx",
                integrationDate: expect.any(Date),
                providerId: "chorus",
            });
        });

        it.skip("saves in paymentFlat", async () => {
            // removes skip when #3467 is done
            const expected = NB_ASSOS_IN_FILES;
            await chorusLinePort.createIndexes();
            const filePath = path.resolve(__dirname, "./__fixtures__/new-chorus-export.xlsx");
            await controller.parse(filePath, EXPORT_DATE);
            const actual = (await paymentFlatPort.cursorFind().toArray()).length;
            expect(actual).toEqual(expected);
        });
    });
});
