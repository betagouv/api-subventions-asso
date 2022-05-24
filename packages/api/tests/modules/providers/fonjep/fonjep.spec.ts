import fs from "fs";
import path from "path";

import FonjepParser from "../../../../src/modules/providers/fonjep/fonjep.parser"

describe("FonjepParser", () => {
    describe("parse()", () => {
        it("should return an array of FonjepRequestEntity", () => {
            const EXPORT_DATE = "2022-03-03";
            const buffer = fs.readFileSync(path.resolve(__dirname, "./__fixtures__/fonjep.xlsx"));
            const entities = FonjepParser.parse(buffer, EXPORT_DATE);
            expect(entities).toMatchSnapshot();
        });
    });
});