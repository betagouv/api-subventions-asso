import FonjepRequestEntity from './entities/FonjepRequestEntity';
import FonjepParser from './fonjep.parser';
import * as ParserHelper from "../../../shared/helpers/ParserHelper";
import { DATA_WITH_HEADER } from "./__fixtures__/fonjepFileModels";
jest.mock('./entities/FonjepRequestEntity');

describe("FonjepParser", () => {
    const indexDataByPathObjectMock = jest.spyOn(ParserHelper, "indexDataByPathObject");
    const PAGES = [
        [["foo", "bar"], ["foo1", "bar1"], ["foo2", "bar2"]],
        [["foo", "baz"], ["foo1", "baz1"], ["foo2", "baz2"]],        
    ];

    // @ts-expect-error: mock
    (FonjepRequestEntity as jest.Mock).mockImplementation((jest.fn()));

    describe("mapHeaderToData()", () => {
        it("should return a mapped object with header as property name", () => {
            const expected = [[{foo: "foo1", bar: "bar1"}, {foo: "foo2", bar: "bar2"}], [{foo: "foo1", baz: "baz1"}, {foo: "foo2", baz: "baz2"}]];
            // @ts-expect-error: test private method
            const actual = FonjepParser.mapHeaderToData(PAGES);
            expect(actual).toEqual(expected);
        });
    });
    describe("filterOnPropFactory()", () => {
        it("should return a function", () => {
            const expected = "function";
            // @ts-expect-error: test private method
            const actual = typeof FonjepParser.filterOnPropFactory([], "propName");
            expect(actual).toEqual(expected);
        });
        it("should return a function that filter given array on property", () => {
            const expected = {"Code": "5678"};
            const ARRAY = [{"Code": "1234"}, expected];
            // @ts-expect-error: test private method
            const filter = FonjepParser.filterOnPropFactory(ARRAY, "Code");
            const actual = filter(expected.Code);
            expect(actual).toEqual(expected);
        });
    });
    describe("createFonjepEntity()", () => {
        beforeAll(() => {
            indexDataByPathObjectMock.mockImplementation(jest.fn());
        });
        afterAll(() => {
            indexDataByPathObjectMock.mockRestore();
        });
        it("should call ParserHelper to build indexed and legal informations", () => {
            // @ts-expect-error: test private method
            FonjepParser.createFonjepEntity({});
            expect(indexDataByPathObjectMock).toHaveBeenCalledTimes(2);
            expect(indexDataByPathObjectMock).toHaveBeenCalledWith(FonjepRequestEntity.indexedProviderInformationsPath, {});
            expect(indexDataByPathObjectMock).toHaveBeenCalledWith(FonjepRequestEntity.indexedLegalInformationsPath, {});
        })
        it("should create a FonjepRequestEntity", () => {
            // @ts-expect-error: test private method;
            FonjepParser.createFonjepEntity({});
            const expected = 3;
            // @ts-expect-error: mock
            const actual = (FonjepRequestEntity as jest.Mock).mock.calls[0].length;
            expect(actual).toEqual(expected);
        })
    });
    describe("parse()", () => {
        const xlsParseMock = jest.spyOn(ParserHelper, "xlsParse");
        // @ts-expect-error: mock private method     
        const mapHeaderToDataMock = jest.spyOn(FonjepParser, "mapHeaderToData");
        // @ts-expect-error: mock private method     
        const createFonjepEntityMock = jest.spyOn(FonjepParser, "createFonjepEntity")
        beforeAll(() => {
            createFonjepEntityMock.mockImplementationOnce(jest.fn());
        });
        afterAll(() => {
            createFonjepEntityMock.mockRestore();
        })
        it("should call createFonjepEntity with parsedData", () => {
            xlsParseMock.mockImplementationOnce(jest.fn());
            mapHeaderToDataMock.mockImplementationOnce(() => DATA_WITH_HEADER);
            // @ts-expect-error: params are mocked inside the children methods
            FonjepParser.parse({} as Buffer, new Date("2022-03-03"));
            expect(createFonjepEntityMock.mock.calls[0]).toMatchSnapshot();
        })
    });
});