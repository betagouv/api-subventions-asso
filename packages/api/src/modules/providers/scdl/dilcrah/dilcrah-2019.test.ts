import path from "path";
import fs from "fs";
import ScdlGrantParser from "../scdl.grant.parser";
import { DILCRAH_2019_MAPPER } from "./dilcrah-2019.mapper";

describe("TEST DILCRAH IMPORT", () => {
    it("should extract data", () => {
        const csvBuffer = fs.readFileSync(path.resolve(__dirname, "../__fixtures__/DILCRAH_2019.csv"));
        // @ts-expect-error: give fake ObjectId
        const actual = ScdlGrantParser.parseCsv(csvBuffer, DILCRAH_2019_MAPPER, "652527d5d86905f43496e67b");
        expect(actual).toMatchSnapshot();
    });
});
