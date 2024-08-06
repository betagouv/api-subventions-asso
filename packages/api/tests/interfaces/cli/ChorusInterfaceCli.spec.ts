import ChorusCli from "../../../src/interfaces/cli/Chorus.cli";
import path from "path";
import chorusLineRepository from "../../../src/modules/providers/chorus/repositories/chorus.line.repository";
import dataLogRepository from "../../../src/modules/data-log/repositories/dataLog.repository";

describe("ChorusCli", () => {
    describe("parse cli requests", () => {
        let controller: ChorusCli;
        const EXPORT_DATE = "2023-12-06";

        beforeEach(() => {
            controller = new ChorusCli();
        });

        describe("new format", () => {
            it("should save entities", async () => {
                const expected = 3;
                const filePath = path.resolve(__dirname, "./__fixtures__/new-chorus-export.xlsx");
                await controller.parse(filePath, EXPORT_DATE);
                const actual = (await chorusLineRepository.cursorFind().toArray()).length;
                expect(actual).toEqual(expected);
            });

            it("should not save duplicates with same file", async () => {
                const expected = 3;
                await chorusLineRepository.createIndexes();
                const filePath = path.resolve(__dirname, "./__fixtures__/new-chorus-export.xlsx");
                await controller.parse(filePath, EXPORT_DATE);
                await controller.parse(filePath, EXPORT_DATE);
                const actual = (await chorusLineRepository.cursorFind().toArray()).length;
                expect(actual).toEqual(expected);
            });

            // Other file is containing two new payment, one association duplicate and one entreprise duplicate
            // Result should be 3 from the first file + 2 from the second one
            // To make this test robust, the duplicate payment for an association is inserted between the two new ones.
            // This is make to be sure that Mongo upsertMany continues even if encounters duplicates
            it("should not save duplicates with another file containing duplicates", async () => {
                const expected = 5;
                await chorusLineRepository.createIndexes();
                const filePath1 = path.resolve(__dirname, "./__fixtures__/new-chorus-export.xlsx");
                const filePath2 = path.resolve(__dirname, "./__fixtures__/new-chorus-export-with-duplicates.xlsx");
                await controller.parse(filePath1, EXPORT_DATE);
                await controller.parse(filePath2, EXPORT_DATE);
                const actual = (await chorusLineRepository.cursorFind().toArray()).length;
                expect(actual).toEqual(expected);
            });

            it("updates duplicate line", async () => {
                const expected = 5;
                await chorusLineRepository.createIndexes();
                const filePath1 = path.resolve(__dirname, "./__fixtures__/new-chorus-export.xlsx");
                const filePath2 = path.resolve(__dirname, "./__fixtures__/new-chorus-export-with-duplicates.xlsx");
                await controller.parse(filePath1, EXPORT_DATE);
                await controller.parse(filePath2, EXPORT_DATE);
                const actual = await chorusLineRepository.findBySiret("32984395500001");
                expect(actual).not.toBeUndefined();
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
