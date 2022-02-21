import fs from "fs";
import path from "path";
import FonjepRequestEntity from "../../../../src/modules/providers/fonjep/entities/FonjepRequestEntity";

import FonjepParser from "../../../../src/modules/providers/fonjep/fonjep.parser"

describe("FonjepParser", () => {
    it("parse", () => {
        const buffer = fs.readFileSync(path.resolve(__dirname, "./__fixtures__/fonjep.xlsx"));
        const requests = FonjepParser.parse(buffer);

        expect(requests).toHaveLength(1);
        expect(requests[0]).toBeInstanceOf(FonjepRequestEntity);
    })
});