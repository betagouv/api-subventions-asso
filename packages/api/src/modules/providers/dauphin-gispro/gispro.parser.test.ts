import GisproParser from "./gispro.parser";
import { GenericParser } from "../../../shared/GenericParser";
import { DefaultObject } from "../../../@types";

jest.mock("../../../shared/GenericParser");

describe("gispro parser", () => {
    const FILE_CONTENT = "content" as unknown as Buffer;
    const EXERCISE = 1997;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const HEADER = "headers" as unknown as any[];
    const DATA = ["row1", "row2"] as unknown as any[][];
    const PAGES = [[], [HEADER, ...DATA]] as unknown as any[][];
    /* eslint-enable @typescript-eslint/no-explicit-any */
    const LINKED_DATA = [{ field: "data1" }, { field: "data2" }] as unknown as DefaultObject<string>;
    const ENTITIES = [{ t: "entity1" }, { t: "entity2" }];

    describe("parse", () => {
        beforeAll(() => {
            jest.mocked(GenericParser.xlsxParse).mockReturnValue(PAGES);
            jest.replaceProperty(GisproParser, "pageIndexByYear", { [EXERCISE]: 1 });
            jest.mocked(GenericParser.linkHeaderToData).mockImplementation(((_header: unknown, data: string) => ({
                field: "data" + data.charAt(3),
            })) as unknown as (
                h: string[],
                d: unknown[],
                o:
                    | {
                          allowNull: boolean;
                      }
                    | undefined,
            ) => DefaultObject<string | null>);
            jest.mocked(GenericParser.indexDataByPathObject).mockReturnValue(ENTITIES[0]);
        });

        afterAll(() => {
            jest.mocked(GenericParser.xlsxParse).mockRestore();
        });

        it("calls xls parser", () => {
            GisproParser.parse(FILE_CONTENT, EXERCISE);
            expect(GenericParser.xlsxParse).toHaveBeenCalledWith(FILE_CONTENT);
        });

        it("links header to rows from proper page by year", () => {
            GisproParser.parse(FILE_CONTENT, EXERCISE);
            expect(GenericParser.linkHeaderToData).toHaveBeenCalledWith(HEADER, DATA[0]);
            expect(GenericParser.linkHeaderToData).toHaveBeenCalledWith(HEADER, DATA[1]);
        });

        it("calls indexDataByPathObject with parsed data", () => {
            GisproParser.parse(FILE_CONTENT, EXERCISE);
            expect(GenericParser.indexDataByPathObject).toHaveBeenCalledWith(
                GisproParser.indexedInformationsPath,
                LINKED_DATA[0],
            );
            expect(GenericParser.indexDataByPathObject).toHaveBeenCalledWith(
                GisproParser.indexedInformationsPath,
                LINKED_DATA[1],
            );
        });

        it("adds exercise", () => {
            const expected = { exercise: EXERCISE };
            const actual = GisproParser.parse(FILE_CONTENT, EXERCISE)[0];
            expect(actual).toMatchObject(expected);
        });

        describe("with validator", () => {
            const VALIDATOR = jest.fn().mockReturnValue(true);
            beforeEach(() => {
                jest.mocked(GenericParser.indexDataByPathObject).mockReturnValueOnce(ENTITIES[0]);
                jest.mocked(GenericParser.indexDataByPathObject).mockReturnValueOnce(ENTITIES[1]);
            });
            it("validates entities", () => {
                GisproParser.parse(FILE_CONTENT, EXERCISE, VALIDATOR);
                expect(VALIDATOR).toHaveBeenCalledWith(ENTITIES[0]);
                expect(VALIDATOR).toHaveBeenCalledWith(ENTITIES[1]);
            });

            it("return validated entities", () => {
                VALIDATOR.mockReturnValueOnce(false);
                const expected = [ENTITIES[1]];
                const actual = GisproParser.parse(FILE_CONTENT, EXERCISE, VALIDATOR);
                expect(actual).toEqual(expected);
            });
        });
    });
});
