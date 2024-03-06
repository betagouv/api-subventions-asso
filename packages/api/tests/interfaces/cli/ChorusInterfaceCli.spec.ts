import ChorusCli from "../../../src/interfaces/cli/Chorus.cli";
import path from "path";
import chorusLineRepository from "../../../src/modules/providers/chorus/repositories/chorus.line.repository";

describe("ChorusCli", () => {
    describe("parse cli requests", () => {
        let controller: ChorusCli;

        beforeEach(() => {
            controller = new ChorusCli();
        });

        // keep this in case we need to re import old files
        describe("old format", () => {
            it("should save entities", async () => {
                const expected = 3;
                const filePath = path.resolve(__dirname, "./__fixtures__/old-chorus-export.xlsx");
                await controller.parse(filePath);
                const actual = (await chorusLineRepository.cursorFind().toArray()).length;
                expect(actual).toEqual(expected);
            });

            it("should not save duplicates with same file", async () => {
                const expected = 3;
                await chorusLineRepository.createIndexes();
                const filePath = path.resolve(__dirname, "./__fixtures__/old-chorus-export.xlsx");
                await controller.parse(filePath);
                await controller.parse(filePath);
                const actual = (await chorusLineRepository.cursorFind().toArray()).length;
                expect(actual).toEqual(expected);
            });

            // Other file is containing two new payment, one association duplicate and one entreprise duplicate
            // Result should be 3 from the first file + 2 from the second one
            // To make this test robust, the duplicate payment for an association is inserted between the two new ones.
            // This is make to be sure that Mongo insertMany continues even if it encounters a Duplicate Error
            it("should not save duplicates with another file containing duplicates", async () => {
                const expected = 5;
                await chorusLineRepository.createIndexes();
                const filePath1 = path.resolve(__dirname, "./__fixtures__/old-chorus-export.xlsx");
                const filePath2 = path.resolve(__dirname, "./__fixtures__/old-chorus-export-with-duplicates.xlsx");
                await controller.parse(filePath1);
                await controller.parse(filePath2);
                const actual = (await chorusLineRepository.cursorFind().toArray()).length;
                expect(actual).toEqual(expected);
            });
        });

        describe("new format", () => {
            it("should save entities", async () => {
                const expected = 3;
                const filePath = path.resolve(__dirname, "./__fixtures__/new-chorus-export.xlsx");
                await controller.parse(filePath);
                const actual = (await chorusLineRepository.cursorFind().toArray()).length;
                expect(actual).toEqual(expected);
            });

            it("should not save duplicates with same file", async () => {
                const expected = 3;
                await chorusLineRepository.createIndexes();
                const filePath = path.resolve(__dirname, "./__fixtures__/new-chorus-export.xlsx");
                await controller.parse(filePath);
                await controller.parse(filePath);
                const actual = (await chorusLineRepository.cursorFind().toArray()).length;
                expect(actual).toEqual(expected);
            });

            // Other file is containing two new payment, one association duplicate and one entreprise duplicate
            // Result should be 3 from the first file + 2 from the second one
            // To make this test robust, the duplicate payment for an association is inserted between the two new ones.
            // This is make to be sure that Mongo insertMany continues even if it encounters a Duplicate Error
            it("should not save duplicates with another file containing duplicates", async () => {
                const expected = 5;
                await chorusLineRepository.createIndexes();
                const filePath1 = path.resolve(__dirname, "./__fixtures__/new-chorus-export.xlsx");
                const filePath2 = path.resolve(__dirname, "./__fixtures__/new-chorus-export-with-duplicates.xlsx");
                await controller.parse(filePath1);
                await controller.parse(filePath2);
                const actual = (await chorusLineRepository.cursorFind().toArray()).length;
                expect(actual).toEqual(expected);
            });
        });
    });
});
