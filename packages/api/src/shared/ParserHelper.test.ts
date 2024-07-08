import dedent from "dedent";
import { GenericParser } from "../GenericParser";

jest.mock("./GenericParser", () => ({ __esModule: true, ...jest.requireActual("./GenericParser") }));
// TODO fix mock

describe("GenericParser", () => {
    const ADAPTER = jest.fn(v => v);
    const DATA = {
        "weird path": { "another turn": "value1" },
        "second choice": "value2",
        "easy path": "value3",
    };
    const MAPPER = {
        key1: ["weird path", "another turn"],
        key2: [["first choice", "second choice"]],
        key3: { path: ["easy path"], adapter: ADAPTER },
    };

    describe("findValueAndOriginalKeyByPath", () => {
        it("finds nested object", () => {
            const expected = { value: "value1", keyPath: ["weird path", "another turn"] };
            const actual = GenericParser.findValueAndOriginalKeyByPath(DATA, MAPPER.key1);
            expect(actual).toEqual(expected);
        });

        it("finds second option object", () => {
            const expected = { value: "value2", keyPath: ["second choice"] };
            const actual = GenericParser.findValueAndOriginalKeyByPath(DATA, MAPPER.key2);
            expect(actual).toEqual(expected);
        });
    });

    describe("findAndAdaptByPath", () => {
        let findOriginalSpy: jest.SpyInstance;

        beforeEach(() => {
            findOriginalSpy = jest.mocked(GenericParser.findValueAndOriginalKeyByPath).mockReturnValue({
                value: "value",
                keyPath: [],
            });
        });

        afterEach(() => {
            jest.mocked(GenericParser.findValueAndOriginalKeyByPath).mockRestore();
        });

        it("gets original value and path", () => {
            GenericParser.findAndAdaptByPath(DATA, MAPPER.key1);
            expect(GenericParser.findValueAndOriginalKeyByPath).toHaveBeenCalledWith(DATA, MAPPER.key1);
        });

        it("calls sent adapter", () => {
            GenericParser.findAndAdaptByPath(DATA, MAPPER.key3);
            expect(MAPPER.key3.adapter).toHaveBeenCalledWith("value3");
        });
    });

    describe("indexDataByPathObject", () => {
        it("calls 'findAndAdaptByPath' for each property in mapper", () => {});
    });

    describe("ExcelDateToJSDate()", () => {
        it("should return a valid date", () => {
            const expected = new Date("2018-12-31T00:00:00.000Z");
            const actual = GenericParser.ExcelDateToJSDate(43465);
            expect(actual).toEqual(expected);
        });
    });

    describe("parseCsv()", () => {
        const CSV = dedent`this is a string, with , (coma)
        this is a string, with ; (semi-colon)`;

        it("should apply default delimiter", () => {
            const actual = GenericParser.csvParse(Buffer.from(CSV, "utf8"));
            expect(actual).toMatchSnapshot();
        });

        it("should apply custom delimiter", () => {
            const actual = GenericParser.csvParse(Buffer.from(CSV, "utf8"), ";");
            expect(actual).toMatchSnapshot();
        });
    });
});
