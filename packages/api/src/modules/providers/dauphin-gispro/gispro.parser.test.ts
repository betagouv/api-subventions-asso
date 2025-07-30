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

    describe("parse", () => {
        beforeAll(() => {
            jest.mocked(GenericParser.xlsParse).mockReturnValue(PAGES);
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
        });
        afterAll(() => {
            jest.mocked(GenericParser.xlsParse).mockRestore();
        });

        it("calls xls parser", () => {
            GisproParser.parse(FILE_CONTENT, EXERCISE);
            expect(GenericParser.xlsParse).toHaveBeenCalledWith(FILE_CONTENT);
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

        describe("with validator", () => {
            const VALIDATOR = jest.fn().mockReturnValue(true);
            const ENTITIES = ["entity1", "entity2"];

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
