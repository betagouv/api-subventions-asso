import FonjepSubventionEntity from "./entities/FonjepSubventionEntity.old";
import FonjepPaymentEntity from "./entities/FonjepPaymentEntity.old";
import FonjepParser from "./fonjep.parser.old";
import { DATA_WITH_HEADER } from "./__fixtures__old/fonjepFileModels";
import { GenericParser } from "../../../shared/GenericParser";

jest.mock("./entities/FonjepSubventionEntity.old");
jest.mock("./entities/FonjepPaymentEntity.old");

describe("FonjepParser", () => {
    const indexDataByPathObjectMock = jest.spyOn(GenericParser, "indexDataByPathObject");
    const PAGES = [
        [
            ["foo", "bar"],
            ["foo1", "bar1"],
            ["foo2", "bar2"],
        ],
        [
            ["foo", "baz"],
            ["foo1", "baz1"],
            ["foo2", "baz2"],
        ],
    ];

    // @ts-expect-error: mock
    (FonjepSubventionEntity as jest.Mock).mockImplementation(jest.fn());
    // @ts-expect-error: mock
    (FonjepPaymentEntity as jest.Mock).mockImplementation(jest.fn());

    describe("mapHeaderToData()", () => {
        it("should return a mapped object with header as property name", () => {
            const expected = [
                [
                    { foo: "foo1", bar: "bar1" },
                    { foo: "foo2", bar: "bar2" },
                ],
                [
                    { foo: "foo1", baz: "baz1" },
                    { foo: "foo2", baz: "baz2" },
                ],
            ];
            // @ts-expect-error: test private method
            const actual = FonjepParser.mapHeaderToData(PAGES);
            expect(actual).toEqual(expected);
        });
    });

    describe("findOnPropFactory()", () => {
        it("should return a function", () => {
            const expected = "function";
            // @ts-expect-error: test private method
            const actual = typeof FonjepParser.findOnPropFactory([], "propName");
            expect(actual).toEqual(expected);
        });
        it("should return a function that find given array on property", () => {
            const expected = { Code: "5678" };
            const ARRAY = [{ Code: "1234" }, expected];
            // @ts-expect-error: test private method
            const find = FonjepParser.findOnPropFactory(ARRAY, "Code");
            const actual = find(expected.Code);
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
            const CODE = "5678";
            const expected = [{ Code: CODE }, { Code: CODE }];
            const ARRAY = [{ Code: "1234" }].concat(expected);
            // @ts-expect-error: test private method
            const filter = FonjepParser.filterOnPropFactory(ARRAY, "Code");
            const actual = filter(CODE);
            expect(actual).toEqual(expected);
        });
    });

    describe("createFonjepSubventionEntity()", () => {
        beforeAll(() => {
            indexDataByPathObjectMock.mockReturnValue({ annee_demande: 2023, code_poste: "CODE" });
        });
        afterAll(() => {
            indexDataByPathObjectMock.mockReset();
        });
        it("should call GenericParser to build indexed and legal informations", () => {
            // @ts-expect-error: test private method
            FonjepParser.createFonjepSubventionEntity({});
            expect(indexDataByPathObjectMock).toHaveBeenCalledTimes(2);
            expect(indexDataByPathObjectMock).toHaveBeenCalledWith(
                FonjepSubventionEntity.indexedProviderInformationsPath,
                {},
            );
            expect(indexDataByPathObjectMock).toHaveBeenCalledWith(
                FonjepSubventionEntity.indexedLegalInformationsPath,
                {},
            );
        });
        it("should create a FonjepSubventionEntity", () => {
            // @ts-expect-error: test private method;
            FonjepParser.createFonjepSubventionEntity({});
            const expected = 3;
            // @ts-expect-error: mock
            const actual = FonjepSubventionEntity.mock.calls[0].length;
            expect(actual).toEqual(expected);
        });
    });

    describe("createFonjepPayment()", () => {
        beforeAll(() => {
            indexDataByPathObjectMock.mockReturnValue({
                periode_debut: new Date("2023-01-01"),
                code_poste: "CODE",
            });
        });
        afterAll(() => {
            indexDataByPathObjectMock.mockReset();
        });

        it("should call GenericParser to build indexed and legal informations", () => {
            // @ts-expect-error: test private method
            FonjepParser.createFonjepPaymentEntity({});
            expect(indexDataByPathObjectMock).toHaveBeenCalledTimes(2);
            expect(indexDataByPathObjectMock).toHaveBeenCalledWith(
                FonjepPaymentEntity.indexedProviderInformationsPath,
                {},
            );
            expect(indexDataByPathObjectMock).toHaveBeenCalledWith(
                FonjepPaymentEntity.indexedLegalInformationsPath,
                {},
            );
        });

        it("should create a FonjepSubventionEntity", () => {
            // @ts-expect-error: test private method;
            FonjepParser.createFonjepPaymentEntity({});
            const expected = 3;
            // @ts-expect-error: mock
            const actual = (FonjepPaymentEntity as jest.Mock).mock.calls[0].length;
            expect(actual).toEqual(expected);
        });
    });

    describe("parse()", () => {
        const xlsParseMock = jest.spyOn(GenericParser, "xlsParseByPageName");
        // @ts-expect-error: mock private method
        const mapHeaderToDataMock = jest.spyOn(FonjepParser, "mapHeaderToData");
        // @ts-expect-error: mock private method
        const createFonjepSubventionEntityMock = jest.spyOn(FonjepParser, "createFonjepSubventionEntity");
        // @ts-expect-error: mock private method
        const createFonjepPaymentEntityMock = jest.spyOn(FonjepParser, "createFonjepPaymentEntity");

        beforeAll(() => {
            createFonjepSubventionEntityMock.mockImplementation(jest.fn());
            createFonjepPaymentEntityMock.mockImplementation(jest.fn());
            xlsParseMock.mockReturnValue({
                Tiers: [],
                Poste: [],
                Versement: [],
                TypePoste: [],
                Dispositif: [],
            });
        });
        afterAll(() => {
            xlsParseMock.mockRestore();
        });

        it("should not save payments without MontantPaye", () => {
            const DATA = JSON.parse(JSON.stringify(DATA_WITH_HEADER));
            DATA[2][0]["MontantPaye"] = undefined;
            mapHeaderToDataMock.mockImplementationOnce(() => DATA);
            FonjepParser.parse({} as Buffer, new Date("2022-03-03"));
            expect(createFonjepPaymentEntityMock).toHaveBeenCalledTimes(1);
            expect(createFonjepPaymentEntityMock.mock.lastCall).toMatchSnapshot([{ id: expect.any(String) }]);
        });

        it("should not save payments without DateVersement", () => {
            const DATA = JSON.parse(JSON.stringify(DATA_WITH_HEADER));
            DATA[2][0]["DateVersement"] = undefined;
            mapHeaderToDataMock.mockImplementationOnce(() => DATA);
            FonjepParser.parse({} as Buffer, new Date("2022-03-03"));
            expect(createFonjepPaymentEntityMock).toHaveBeenCalledTimes(1);
            expect(createFonjepPaymentEntityMock.mock.lastCall).toMatchSnapshot([{ id: expect.any(String) }]);
        });

        it("should call createFonjepSubventionEntity with parsedData", () => {
            mapHeaderToDataMock.mockImplementationOnce(() => DATA_WITH_HEADER);
            FonjepParser.parse({} as Buffer, new Date("2022-03-03"));
            expect(createFonjepSubventionEntityMock.mock.calls[0][0]).toMatchSnapshot({ id: expect.any(String) });
        });
        it("should call createPaymentFonjep with payment data", () => {
            mapHeaderToDataMock.mockImplementationOnce(() => DATA_WITH_HEADER);
            FonjepParser.parse({} as Buffer, new Date("2022-03-03"));
            expect(createFonjepPaymentEntityMock).toHaveBeenCalledTimes(2);
            expect(createFonjepPaymentEntityMock.mock.lastCall).toMatchSnapshot([{ id: expect.any(String) }]);
        });
    });
});
