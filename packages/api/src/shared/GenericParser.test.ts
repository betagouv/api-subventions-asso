import dedent from "dedent";
import { GenericParser } from "./GenericParser";
import { DefaultObject, NestedBeforeAdaptation, ParserInfo, ParserPath } from "../@types";
import xlsx from "node-xlsx";

jest.mock("node-xlsx");

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
        key4: ["weird path", ["other possibility", "another turn"]],
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

        it("finds nested object with choices", () => {
            const expected = { value: "value1", keyPath: ["weird path", "another turn"] };
            const actual = GenericParser.findValueAndOriginalKeyByPath(DATA, MAPPER.key4);
            expect(actual).toEqual(expected);
        });
    });

    describe("findAndAdaptByPath", () => {
        let findOriginalSpy: jest.SpyInstance;

        beforeAll(() => {
            findOriginalSpy = jest.spyOn(GenericParser, "findValueAndOriginalKeyByPath").mockReturnValue({
                value: "value",
                keyPath: [],
            });
        });

        afterAll(() => {
            findOriginalSpy.mockRestore();
        });

        it("gets original value and path", () => {
            GenericParser.findAndAdaptByPath(DATA, MAPPER.key1);
            expect(GenericParser.findValueAndOriginalKeyByPath).toHaveBeenCalledWith(DATA, MAPPER.key1);
        });

        it("calls sent adapter", () => {
            GenericParser.findAndAdaptByPath(DATA, MAPPER.key3);
            expect(ADAPTER).toHaveBeenCalledWith("value");
        });
    });

    describe("indexDataByPathObject", () => {
        let adaptByPathSpy: jest.SpyInstance;
        const DATA = "data" as unknown as NestedBeforeAdaptation;
        const MAPPER = {
            value1: "path1",
            value2: "path2",
        } as unknown as DefaultObject<ParserPath | ParserInfo>;
        beforeAll(() => {
            adaptByPathSpy = jest.spyOn(GenericParser, "findAndAdaptByPath").mockReturnValue("");
        });

        it("calls 'findAndAdaptByPath' for each property in mapper", () => {
            GenericParser.indexDataByPathObject(MAPPER, DATA);
            expect(GenericParser.findAndAdaptByPath).toHaveBeenCalledWith(DATA, "path1");
            expect(GenericParser.findAndAdaptByPath).toHaveBeenCalledWith(DATA, "path2");
        });

        it("returns accumulated adapted values", () => {
            adaptByPathSpy.mockReturnValueOnce("adapted1");
            adaptByPathSpy.mockReturnValueOnce("adapted2");
            const expected = { value1: "adapted1", value2: "adapted2" };
            const actual = GenericParser.indexDataByPathObject(MAPPER, DATA);
            expect(actual).toEqual(expected);
        });
    });

    describe("linkHeaderToData", () => {
        it("trim headers", () => {
            const HEADERS = ["  header1   "];
            const DATA = ["value1"];
            const expected = {
                header1: "value1",
            };
            const actual = GenericParser.linkHeaderToData(HEADERS, DATA);
            expect(actual).toEqual(expected);
        });

        it("links header to data and replace empty cells with empty string", () => {
            const HEADERS = ["header1", "header2"];
            const DATA = ["value1", undefined];
            const expected = {
                header1: "value1",
                header2: "",
            };
            const actual = GenericParser.linkHeaderToData(HEADERS, DATA);
            expect(actual).toEqual(expected);
        });

        it.each`
            expected | allowNull
            ${null}  | ${true}
            ${""}    | ${false}
        `("keep empty cells as null with allowNull option", ({ expected, allowNull }) => {
            const HEADERS = ["header1", "header2"];
            const DATA = ["value1", undefined];

            const actual = GenericParser.linkHeaderToData(HEADERS, DATA, { allowNull: allowNull }).header2;
            expect(actual).toEqual(expected);
        });
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

    describe("xlsParseWithPageName", () => {
        beforeAll(() => {
            jest.mocked(xlsx.parse).mockReturnValue([
                { data: [], name: "empty to ignore" },
                {
                    data: [["h1", "h2"], [], ["r1", "r2"]],
                    name: "PAGE 2",
                },
            ]);
        });
        afterAll(() => {
            jest.mocked(xlsx.parse).mockRestore();
        });

        it("restores xls in proper format", () => {
            const expected = [
                { data: [], name: "empty to ignore" },
                {
                    data: [
                        ["h1", "h2"],
                        ["r1", "r2"],
                    ],
                    name: "PAGE 2",
                },
            ];
            const actual = GenericParser.xlsParseWithPageName(null as unknown as Buffer);
            expect(actual).toEqual(expected);
        });
    });

    describe("xlsParse", () => {
        let xlsParseWithPageNameSpy: jest.SpyInstance;
        beforeAll(() => {
            xlsParseWithPageNameSpy = jest.spyOn(GenericParser, "xlsParseWithPageName").mockReturnValue([
                { data: [], name: "PAGE 1" },
                {
                    data: [
                        ["h1", "h2"],
                        ["r1", "r2"],
                    ],
                    name: "PAGE 2",
                },
            ]);
        });
        afterAll(() => {
            jest.mocked(xlsParseWithPageNameSpy).mockRestore();
        });

        it("restores data in proper format", () => {
            const expected = [
                [],
                [
                    ["h1", "h2"],
                    ["r1", "r2"],
                ],
            ];
            const actual = GenericParser.xlsParse(null as unknown as Buffer);
            expect(actual).toEqual(expected);
        });
    });

    describe("xlsParseByPageName", () => {
        let xlsParseWithPageNameSpy: jest.SpyInstance;
        beforeAll(() => {
            xlsParseWithPageNameSpy = jest.spyOn(GenericParser, "xlsParseWithPageName").mockReturnValue([
                { data: [], name: "PAGE 1" },
                {
                    data: [
                        ["h1", "h2"],
                        ["r1", "r2"],
                    ],
                    name: "PAGE 2",
                },
            ]);
        });
        afterAll(() => {
            jest.mocked(xlsParseWithPageNameSpy).mockRestore();
        });

        it("restores data in proper format", () => {
            const expected = {
                "PAGE 1": [],
                "PAGE 2": [
                    ["h1", "h2"],
                    ["r1", "r2"],
                ],
            };
            const actual = GenericParser.xlsParseByPageName(null as unknown as Buffer);
            expect(actual).toEqual(expected);
        });
    });
});
