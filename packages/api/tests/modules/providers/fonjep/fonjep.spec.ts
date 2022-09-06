import fs from "fs";
import path from "path";

import FonjepParser from "../../../../src/modules/providers/fonjep/fonjep.parser"

describe("FonjepParser", () => {
    describe("parse()", () => {
        it("should return an array of FonjepRequestEntity", () => {
            const EXPORT_DATE = new Date("2022-03-03").toISOString();
            const buffer = fs.readFileSync(path.resolve(__dirname, "./__fixtures__/fonjep.xlsx"));
            const data = FonjepParser.parse(buffer, new Date(EXPORT_DATE));
            expect(data).toMatchSnapshot();
        });
    });
});