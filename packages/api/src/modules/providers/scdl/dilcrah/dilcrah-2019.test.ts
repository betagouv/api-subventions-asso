import path from "path";
import fs from "fs";
import ScdlGrantParser from "../scdl.grant.parser";

describe("TEST DILCRAH IMPORT", () => {
    it("should extract data", () => {
        const csvBuffer = fs.readFileSync(path.resolve(__dirname, "../__fixtures__/DILCRAH_2019.csv"));
        // @ts-expect-error: give fake ObjectId
        const actual = ScdlGrantParser.parseCsv(csvBuffer, "652527d5d86905f43496e67b");
        // const snapshotExpect = actual.map(subvention => ({
        //     conventionDate: expect.any(Date),
        //     paymentDate: expect.any(Date),
        // }));
        // expect(actual).toMatchSnapshot(snapshotExpect);
        expect(actual).toMatchSnapshot();
    });
});
