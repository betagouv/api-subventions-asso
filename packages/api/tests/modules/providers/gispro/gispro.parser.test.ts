import path from "path";
import fs from "fs";
import GisproActionEntity from "../../../../src/modules/providers/gispro/entities/GisproActionEntity";
import GisproParser from "../../../../src/modules/providers/gispro/gispro.parser";

describe("GisproParser", () => {
    const parser = GisproParser;

    describe("parseRequests()", () => {
        it("return the expected number of items", () => {
            const actual = parser.parseActions(
                fs.readFileSync(path.resolve(__dirname, "./__fixtures__/gispro-test.xltx"))
            );
            expect(actual).toHaveLength(1);
        });
        it("return an array of GisproActionEntity", () => {
            const entities = parser.parseActions(
                fs.readFileSync(path.resolve(__dirname, "./__fixtures__/gispro-test.xltx"))
            );
            const actual = entities.every(entity => entity instanceof GisproActionEntity);
            expect(actual).toBeTruthy();
        });
    });
});
