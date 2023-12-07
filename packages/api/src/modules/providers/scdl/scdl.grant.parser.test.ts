import path from "path";
import fs from "fs";
import ScdlGrantParser from "./scdl.grant.parser";
import MiscScdlGrant from "./__fixtures__/MiscScdlGrant";
import * as Validators from "../../../shared/Validators";
jest.mock("../../../shared/Validators");
const mockedValidators = jest.mocked(Validators);

describe("ScdlGrantParser", () => {
    describe("parseCsv", () => {
        describe("OFFICIAL SCDL scheme", () => {
            it("should extract data", () => {
                const csvBuffer = fs.readFileSync(path.resolve(__dirname, "./__fixtures__/SCDL.csv"));
                const actual = ScdlGrantParser.parseCsv(csvBuffer);
                expect(actual).toMatchSnapshot();
            });
        });
        describe("DILCRAH_2019 scheme", () => {
            it("should extract data", () => {
                const csvBuffer = fs.readFileSync(path.resolve(__dirname, "./__fixtures__/SCDL_DILCRAH_2019.csv"));
                const actual = ScdlGrantParser.parseCsv(csvBuffer);
                expect(actual).toMatchSnapshot();
            });
        });
    });

    describe("isGrantValid", () => {
        const GRANT = { ...MiscScdlGrant };

        beforeEach(() => {
            mockedValidators.isSiret.mockReturnValue(true);
        });

        it("should return false if siret not valid", () => {
            mockedValidators.isSiret.mockReturnValueOnce(false);
            const expected = false;
            // @ts-expect-error: protected method
            const actual = ScdlGrantParser.isGrantValid(GRANT);
            expect(actual).toEqual(true);
        });
    });
});
