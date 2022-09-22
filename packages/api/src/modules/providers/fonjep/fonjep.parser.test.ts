import FonjepSubventionEntity from './entities/FonjepSubventionEntity';
import FonjepVersementEntity from "./entities/FonjepVersementEntity";
import FonjepParser from './fonjep.parser';
import * as ParserHelper from "../../../shared/helpers/ParserHelper";
import { DATA_WITH_HEADER, DEFAULT_POSTE, DEFAULT_VERSEMENT } from "./__fixtures__/fonjepFileModels";
jest.mock('./entities/FonjepSubventionEntity');
jest.mock('./entities/FonjepVersementEntity');

describe("FonjepParser", () => {
    const indexDataByPathObjectMock = jest.spyOn(ParserHelper, "indexDataByPathObject");
    const PAGES = [
        [["foo", "bar"], ["foo1", "bar1"], ["foo2", "bar2"]],
        [["foo", "baz"], ["foo1", "baz1"], ["foo2", "baz2"]],
    ];

    // @ts-expect-error: mock
    (FonjepSubventionEntity as jest.Mock).mockImplementation((jest.fn()));
    // @ts-expect-error: mock
    (FonjepVersementEntity as jest.Mock).mockImplementation((jest.fn()));

    describe("mapHeaderToData()", () => {
        it("should return a mapped object with header as property name", () => {
            const expected = [[{ foo: "foo1", bar: "bar1" }, { foo: "foo2", bar: "bar2" }], [{ foo: "foo1", baz: "baz1" }, { foo: "foo2", baz: "baz2" }]];
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
            const expected = { "Code": "5678" };
            const ARRAY = [{ "Code": "1234" }, expected];
            // @ts-expect-error: test private method
            const filter = FonjepParser.filterOnPropFactory(ARRAY, "Code");
            const actual = filter(expected.Code);
            expect(actual).toEqual(expected);
        });
    });
    describe("createFonjepSubventionEntity()", () => {
        beforeAll(() => {
            indexDataByPathObjectMock.mockImplementation(jest.fn());
        });
        afterAll(() => {
            indexDataByPathObjectMock.mockReset();
        });
        it("should call ParserHelper to build indexed and legal informations", () => {
            // @ts-expect-error: test private method
            FonjepParser.createFonjepSubventionEntity({});
            expect(indexDataByPathObjectMock).toHaveBeenCalledTimes(2);
            expect(indexDataByPathObjectMock).toHaveBeenCalledWith(FonjepSubventionEntity.indexedProviderInformationsPath, {});
            expect(indexDataByPathObjectMock).toHaveBeenCalledWith(FonjepSubventionEntity.indexedLegalInformationsPath, {});
        })
        it("should create a FonjepSubventionEntity", () => {
            // @ts-expect-error: test private method;
            FonjepParser.createFonjepSubventionEntity({});
            const expected = 3;
            // @ts-expect-error: mock
            const actual = FonjepSubventionEntity.mock.calls[0].length;
            expect(actual).toEqual(expected);
        })
    });

    describe("createFonjepVersement()", () => {
        beforeAll(() => {
            indexDataByPathObjectMock.mockImplementation(jest.fn());
        });
        afterAll(() => {
            indexDataByPathObjectMock.mockReset();
        });

        it("should call ParserHelper to build indexed and legal informations", () => {
            // @ts-expect-error: test private method
            FonjepParser.createFonjepVersementEntity({});
            expect(indexDataByPathObjectMock).toHaveBeenCalledTimes(2);
            expect(indexDataByPathObjectMock).toHaveBeenCalledWith(FonjepVersementEntity.indexedProviderInformationsPath, {});
            expect(indexDataByPathObjectMock).toHaveBeenCalledWith(FonjepVersementEntity.indexedLegalInformationsPath, {});
        });

        it("should create a FonjepSubventionEntity", () => {
            // @ts-expect-error: test private method;
            FonjepParser.createFonjepVersementEntity({});
            const expected = 3;
            // @ts-expect-error: mock
            const actual = (FonjepVersementEntity as jest.Mock).mock.calls[0].length;
            expect(actual).toEqual(expected);
        });
    })

    describe("getSubventionVersements()", () => {
        const poste = DEFAULT_POSTE;
        it("should not return versement with empty MontantPaye", () => {
            const expected = [DEFAULT_VERSEMENT];
            // @ts-expect-error: test private method
            const actual = FonjepParser.getSubventionVersements(poste, [DEFAULT_VERSEMENT, {
                PosteCode: DEFAULT_VERSEMENT.PosteCode,
                PeriodeDebut: DEFAULT_VERSEMENT.PeriodeDebut + 50,
                PeriodeFin: DEFAULT_VERSEMENT.PeriodeFin + 50,
                // @ts-expect-error: don't know
                DateVersement: undefined,
                MontantAPayer: DEFAULT_VERSEMENT.MontantAPayer,
                // @ts-expect-error: don't know
                MontantPaye: undefined
            }]);
            expect(actual).toEqual(expected);
        });

        it("shouuld return versements", () => {
            const SECOND_VERSEMENT = {
                PosteCode: DEFAULT_VERSEMENT.PosteCode,
                PeriodeDebut: DEFAULT_VERSEMENT.PeriodeDebut + 50,
                PeriodeFin: DEFAULT_VERSEMENT.PeriodeFin + 50,
                DateVersement: DEFAULT_VERSEMENT.DateVersement,
                MontantAPayer: DEFAULT_VERSEMENT.MontantAPayer,
                MontantPaye: DEFAULT_VERSEMENT.MontantPaye
            }
            const expected = [DEFAULT_VERSEMENT, SECOND_VERSEMENT];
            // @ts-expect-error: test private method
            const actual = FonjepParser.getSubventionVersements(poste, [DEFAULT_VERSEMENT, SECOND_VERSEMENT]);
            expect(actual).toEqual(expected);
        })
    })

    describe("parse()", () => {
        const xlsParseMock = jest.spyOn(ParserHelper, "xlsParse");
        // @ts-expect-error: mock private method     
        const mapHeaderToDataMock = jest.spyOn(FonjepParser, "mapHeaderToData");
        // @ts-expect-error: mock private method     
        const createFonjepSubventionEntityMock = jest.spyOn(FonjepParser, "createFonjepSubventionEntity")
        // @ts-expect-error: mock private method     
        const createFonjepVersementEntityMock = jest.spyOn(FonjepParser, "createFonjepVersementEntity")

        beforeAll(() => {
            createFonjepSubventionEntityMock.mockImplementation(jest.fn());
            createFonjepVersementEntityMock.mockImplementation(jest.fn());
        })

        afterEach(() => {
            createFonjepSubventionEntityMock.mockClear();
            createFonjepVersementEntityMock.mockClear();
        })

        it("should call createFonjepSubventionEntity with parsedData", () => {
            xlsParseMock.mockImplementationOnce(jest.fn());
            mapHeaderToDataMock.mockImplementationOnce(() => DATA_WITH_HEADER);
            FonjepParser.parse({} as Buffer, new Date("2022-03-03"));
            // @ts-expect-error: test
            expect(createFonjepSubventionEntityMock.mock.calls[0][0]).toMatchSnapshot({ id: expect.any(String) });
        })
        it("should call createVersementFonjep with versement data", () => {
            xlsParseMock.mockImplementationOnce(jest.fn());
            mapHeaderToDataMock.mockImplementationOnce(() => DATA_WITH_HEADER);
            FonjepParser.parse({} as Buffer, new Date("2022-03-03"));
            expect(createFonjepVersementEntityMock).toHaveBeenCalledTimes(2);
            // @ts-expect-error: test
            expect(createFonjepVersementEntityMock.mock.lastCall).toMatchSnapshot([{ id: expect.any(String) }]);
        })
    });
});