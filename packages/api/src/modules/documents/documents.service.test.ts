import documentsService from "./documents.service";
jest.mock("../providers");

import providers from "../providers";
import Provider from "../providers/@types/IProvider";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
import * as IdentifierHelper from "../../shared/helpers/IdentifierHelper";
import dauphinService from "../providers/dauphin/dauphin.service";

jest.mock("../../shared/helpers/IdentifierHelper", () => ({
    getIdentifierType: jest.fn(() => StructureIdentifiersEnum.siren) as jest.SpyInstance,
}));

describe("Documents Service", () => {
    const SIREN = "123456789";
    const SIRET = `${SIREN}12345`;

    describe("getDocumentBySiren", () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const mockAggregateDocuments = jest.spyOn(documentsService, "aggregateDocuments") as jest.SpyInstance<
            Promise<(string | null)[]>,
            []
        >;

        afterAll(() => {
            mockAggregateDocuments.mockClear();
        });

        it("should be return list of document", async () => {
            const expected = ["DocumentA", "DocumentB"];

            mockAggregateDocuments.mockImplementationOnce(() => Promise.resolve(expected));

            const actual = await documentsService.getDocumentBySiren("SIREN");

            expect(expected).toEqual(actual);
        });

        it("should be return filtred list of document", async () => {
            const expected = ["DocumentA", "DocumentB"];

            mockAggregateDocuments.mockImplementationOnce(() =>
                Promise.resolve(["DocumentA", null, null, "DocumentB", null]),
            );

            const actual = await documentsService.getDocumentBySiren("SIREN");

            expect(expected).toEqual(actual);
        });

        it("should be return an empty list", async () => {
            const expected = 0;

            mockAggregateDocuments.mockImplementationOnce(() => Promise.resolve([null, null, null]));

            const actual = await documentsService.getDocumentBySiren("SIREN");

            expect(actual).toHaveLength(expected);
        });

        it("should call aggregate with SIREN", async () => {
            const expected = "SIREN";
            mockAggregateDocuments.mockImplementationOnce(() => Promise.resolve([]));

            await documentsService.getDocumentBySiren(expected);

            const actual = mockAggregateDocuments;

            expect(actual).toHaveBeenCalledWith(expected);
        });
    });

    describe("getDocumentBySiret", () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const mockAggregateDocuments = jest.spyOn(documentsService, "aggregateDocuments") as jest.SpyInstance<
            Promise<(string | null)[]>,
            []
        >;

        afterAll(() => {
            mockAggregateDocuments.mockClear();
        });

        it("should return list of document", async () => {
            const expected = ["DocumentA", "DocumentB"];

            mockAggregateDocuments.mockImplementationOnce(() => Promise.resolve(expected));

            const actual = await documentsService.getDocumentBySiret("SIRET");

            expect(actual).toEqual(expected);
        });

        it("should be return filtred list of document", async () => {
            const expected = ["DocumentA", "DocumentB"];

            mockAggregateDocuments.mockImplementationOnce(() =>
                Promise.resolve(["DocumentA", null, null, "DocumentB", null]),
            );

            const actual = await documentsService.getDocumentBySiret("SIRET");

            expect(expected).toEqual(actual);
        });

        it("should be return an empty list", async () => {
            const expected = 0;

            mockAggregateDocuments.mockImplementationOnce(() => Promise.resolve([null, null, null]));

            const actual = await documentsService.getDocumentBySiret("SIRET");

            expect(actual).toHaveLength(expected);
        });

        it("should call aggregateDocuments with SIRET", async () => {
            mockAggregateDocuments.mockImplementationOnce(() => Promise.resolve([]));
            const expected = "SIRET";
            await documentsService.getDocumentBySiret(expected);
            expect(mockAggregateDocuments).toHaveBeenCalledWith(expected);
        });
    });

    describe("getDocumentByRna", () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const mockAggregateDocuments = jest.spyOn(documentsService, "aggregateDocuments") as jest.SpyInstance<
            Promise<(string | null)[]>,
            []
        >;

        afterAll(() => {
            mockAggregateDocuments.mockClear();
        });

        it("should be return list of document", async () => {
            const expected = ["DocumentA", "DocumentB"];

            mockAggregateDocuments.mockImplementationOnce(() => Promise.resolve(expected));

            const actual = await documentsService.getDocumentByRna("RNA");

            expect(expected).toEqual(actual);
        });

        it("should be return filtred list of document", async () => {
            const expected = ["DocumentA", "DocumentB"];

            mockAggregateDocuments.mockImplementationOnce(() =>
                Promise.resolve(["DocumentA", null, null, "DocumentB", null]),
            );

            const actual = await documentsService.getDocumentByRna("RNA");

            expect(expected).toEqual(actual);
        });

        it("should be return an empty list", async () => {
            const expected = 0;

            mockAggregateDocuments.mockImplementationOnce(() => Promise.resolve([null, null, null]));

            const actual = await documentsService.getDocumentByRna("RNA");

            expect(actual).toHaveLength(expected);
        });

        it("should call aggregate with RNA", async () => {
            const expected = "RNA";
            mockAggregateDocuments.mockImplementationOnce(() => Promise.resolve([]));

            await documentsService.getDocumentByRna(expected);

            const actual = mockAggregateDocuments;

            expect(actual).toHaveBeenCalledWith(expected);
        });
    });

    describe("isDocumentProvider", () => {
        it("should be return true", () => {
            const expected = true;

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const actual = documentsService.isDocumentProvider({
                isDocumentProvider: true,
            });

            expect(actual).toBe(expected);
        });

        it("should be return false", () => {
            const expected = false;

            // @ts-expect-error mock
            const actual = documentsService.isDocumentProvider({});

            expect(actual).toBe(expected);
        });
    });

    describe("getDocumentProviders", () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const isDocumentProviderMock = jest.spyOn(documentsService, "isDocumentProvider") as jest.SpyInstance<
            boolean,
            []
        >;

        afterAll(() => {
            isDocumentProviderMock.mockClear();
        });

        it("Should not retrun provider", () => {
            const expected = 0;

            isDocumentProviderMock.mockImplementation(() => false);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const actual = documentsService.getDocumentProviders();

            expect(actual).toHaveLength(expected);

            isDocumentProviderMock.mockClear();
        });

        it("Should retrun providers", () => {
            const expected = Object.values(providers).length;

            isDocumentProviderMock.mockImplementation(() => true);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const actual = documentsService.getDocumentProviders();

            expect(actual).toHaveLength(expected);

            isDocumentProviderMock.mockClear();
        });

        it("Should retrun part of providers", () => {
            const expected = Math.floor(Object.values(providers).length / 2);
            let i = 0;
            isDocumentProviderMock.mockImplementation(() => {
                i++;
                return i % 2 === 0;
            });

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const actual = documentsService.getDocumentProviders();
            expect(actual).toHaveLength(expected);

            isDocumentProviderMock.mockClear();
        });
    });

    describe("getRibProviders", () => {
        // @ts-expect-error: mock
        const mockAggregateRibs = jest.spyOn(documentsService, "aggregateRibs").mockImplementationOnce(jest.fn());
        // @ts-expect-error: mock
        const getDocumentProvidersMock = jest.spyOn(documentsService, "getDocumentProviders");
        it("should call getDocumentProviders()", () => {
            // @ts-expect-error: private method
            documentsService.getRibProviders(SIRET);
            expect(getDocumentProvidersMock).toHaveBeenCalled();
        });
    });

    describe("aggregateDocuments", () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const getDocumentProvidersMock = jest.spyOn(documentsService, "getDocumentProviders") as jest.SpyInstance<
            Provider[],
            []
        >;

        afterAll(() => {
            getDocumentProvidersMock.mockClear();
        });

        it("should throw error", async () => {
            const expected = "You must provide a valid SIREN or RNA or SIRET";

            // @ts-expect-error: mock
            IdentifierHelper.getIdentifierType.mockImplementationOnce(() => null);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const actual = documentsService.aggregateDocuments("WRONG");
            expect(actual).rejects.toThrowError(expected);
        });

        it("should call getDocumentsByRna", async () => {
            const mock = jest.fn(async () => true);
            const expected = "W00000000";

            // @ts-expect-error: mock
            IdentifierHelper.getIdentifierType.mockImplementationOnce(() => StructureIdentifiersEnum.rna);
            getDocumentProvidersMock.mockImplementationOnce(() => [
                {
                    getDocumentsByRna: mock,
                } as unknown as Provider,
            ]);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            await documentsService.aggregateDocuments(expected);

            expect(mock).toHaveBeenCalledWith(expected);
        });

        it("should call getDocumentsBySiren", async () => {
            const mock = jest.fn(async () => true);
            const expected = "123456789";

            // @ts-expect-error: mock
            IdentifierHelper.getIdentifierType.mockImplementationOnce(() => StructureIdentifiersEnum.siren);
            getDocumentProvidersMock.mockImplementationOnce(() => [
                {
                    getDocumentsBySiren: mock,
                } as unknown as Provider,
            ]);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            await documentsService.aggregateDocuments(expected);

            expect(mock).toHaveBeenCalledWith(expected);
        });

        it("should call getDocumentsBySiret", async () => {
            const mock = jest.fn(async () => true);
            const expected = "12345678912345";

            // @ts-expect-error: mock
            IdentifierHelper.getIdentifierType.mockImplementationOnce(() => StructureIdentifiersEnum.siret);
            getDocumentProvidersMock.mockImplementationOnce(() => [
                {
                    getDocumentsBySiret: mock,
                } as unknown as Provider,
            ]);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            await documentsService.aggregateDocuments(expected);

            expect(mock).toHaveBeenCalledWith(expected);
        });

        it("should call aggregate()", async () => {
            // @ts-expect-error: spy private method
            const spyAggregate = jest.spyOn(documentsService, "aggregate").mockImplementationOnce(jest.fn());
            // @ts-expect-error: private method
            await documentsService.aggregateDocuments(SIREN);
            expect(spyAggregate).toHaveBeenCalled();
        });
    });

    describe("aggregate", () => {
        const fn = jest.fn(async () => [{}, {}]);
        const providers = [
            {
                getDocuments: fn,
            },
        ];
        it("should call method", async () => {
            // @ts-expect-error: private method
            await documentsService.aggregate(providers, "getDocuments", SIREN);
            expect(fn).toHaveBeenCalledTimes(1);
        });

        it("return documents", async () => {
            const expected = [{}, {}];
            // @ts-expect-error: private method
            const actual = await documentsService.aggregate(providers, "getDocuments", SIREN);
            expect(actual).toEqual(expected);
        });
    });

    describe("getDauphinDocumentStream", () => {
        let dauphinServiceMock;
        const RES = "RES";
        const DOC_ID = "id";

        beforeEach(
            // @ts-expect-error mock
            () => (dauphinServiceMock = jest.spyOn(dauphinService, "getSpecificDocumentStream").mockResolvedValue(RES)),
        );

        it("calls dauphin service", async () => {
            await documentsService.getDauphinDocumentStream(DOC_ID);
            expect(dauphinServiceMock).toHaveBeenCalledWith(DOC_ID);
        });

        it("returns stream from dauphin service", async () => {
            const expected = RES;
            const actual = await documentsService.getDauphinDocumentStream(DOC_ID);
            expect(actual).toBe(expected);
        });
    });
});
