import path from "path";
import fs from "fs";
import ScdlGrantParser from "./scdl.grant.parser";
import { ObjectId } from "mongodb";

describe("ScdlGrantParser", () => {
    describe("OFFICIAL SCDL scheme", () => {
        it("should extract data", () => {
            const csvBuffer = fs.readFileSync(path.resolve(__dirname, "./__fixtures__/SCDL.csv"));
            const actual = ScdlGrantParser.parseCsv(csvBuffer, new ObjectId("6527eb1a89c6f9a9bd230ed8"));
            console.log(actual);
            expect(actual).toMatchSnapshot();
        });
    });
    describe("DILCRAH_2019 scheme", () => {
        it("should extract data", () => {
            const csvBuffer = fs.readFileSync(path.resolve(__dirname, "./__fixtures__/SCDL_DILCRAH_2019.csv"));
            const actual = ScdlGrantParser.parseCsv(csvBuffer, new ObjectId("6527eb1a89c6f9a9bd230ed8"));
            expect(actual).toMatchSnapshot();
        });
    });
});
