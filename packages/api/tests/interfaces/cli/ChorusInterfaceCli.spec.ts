import ChorusCli from "../../../src/interfaces/cli/Chorus.cli";
import path from "path";
import chorusLineRepository from "../../../src/modules/providers/chorus/repositories/chorus.line.repository";
import dataLogRepository from "../../../src/modules/data-log/repositories/dataLog.repository";

describe("ChorusCli", () => {
    describe("parse cli requests", () => {
        let controller: ChorusCli;
        const EXPORT_DATE = "2023-12-06";
        // change this when you update the fixture
        const NB_ASSOS_IN_FILES = 4;

        beforeEach(() => {
            controller = new ChorusCli();
        });

        describe("new format", () => {
            // file should have 4 associations and 1 company's payments
            it("should save association but not companies' payments", async () => {
                const expected = NB_ASSOS_IN_FILES;
                const filePath = path.resolve(__dirname, "./__fixtures__/new-chorus-export.xlsx");
                await controller.parse(filePath, EXPORT_DATE);
                const actual = (await chorusLineRepository.cursorFind().toArray()).length;
                expect(actual).toEqual(expected);
            });

            // rerun above test twice
            it("should not save duplicates", async () => {
                const expected = NB_ASSOS_IN_FILES;
                await chorusLineRepository.createIndexes();
                const filePath = path.resolve(__dirname, "./__fixtures__/new-chorus-export.xlsx");
                await controller.parse(filePath, EXPORT_DATE);
                await controller.parse(filePath, EXPORT_DATE);
                const actual = (await chorusLineRepository.cursorFind().toArray()).length;
                expect(actual).toEqual(expected);
            });
        });

        it("should register new import", async () => {
            const filePath = path.resolve(__dirname, "./__fixtures__/new-chorus-export.xlsx");
            await controller.parse(filePath, EXPORT_DATE);
            const actual = await dataLogRepository.findAll();
            expect(actual?.[0]).toMatchObject({
                editionDate: new Date(EXPORT_DATE),
                fileName: "new-chorus-export.xlsx",
                integrationDate: expect.any(Date),
                providerId: "chorus",
            });
        });
    });
});
