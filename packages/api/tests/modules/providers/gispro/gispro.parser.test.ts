import path from 'path';
import fs from "fs";
import GisproRequestEntity from '../../../../src/modules/providers/gispro/entities/GisproRequestEntity';
import GisproParser from '../../../../src/modules/providers/gispro/gispro.parser';

describe("GisproParser", () => {
    const parser = GisproParser;

    describe("parseRequests()", () => {
        it("return the expected number of items", () => {
            // const expected = GisproRequestEntity;
            const actual = parser.parseRequests(fs.readFileSync(path.resolve(__dirname, "./__fixtures__/gispro.xlsx")));
            expect(actual).toHaveLength(4);
        })
        it("return an array of GisproRequestEntity", () => {
            const entities = parser.parseRequests(fs.readFileSync(path.resolve(__dirname, "./__fixtures__/gispro.xlsx")));
            console.log({entities});
            const actual = entities.reduce((acc, entity) => { 
                if (!acc) return acc;
                if (!(entity instanceof GisproRequestEntity)) acc = false;
                return acc;
            }, true)
            expect(actual).toBeTruthy();
        })
    })
})