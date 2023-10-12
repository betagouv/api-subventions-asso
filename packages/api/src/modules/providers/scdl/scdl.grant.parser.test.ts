import path from "path";
import fs from "fs";
import ScdlGrantParser from "./scdl.grant.parser";
import { ObjectId } from "mongodb";

describe("TEST DILCRAH IMPORT", () => {
    it("should extract data", () => {
        const csvBuffer = fs.readFileSync(path.resolve(__dirname, "./__fixtures__/SCDL.csv"));
        const actual = ScdlGrantParser.parseCsv(csvBuffer, new ObjectId("6527eb1a89c6f9a9bd230ed8"));
        expect(actual).toMatchSnapshot();
    });
});
