import documentsService from "./documents.service";
import * as IdentifierHelper from "../../shared/helpers/IdentifierHelper";
jest.mock('../providers');

import providers from "../providers";
import Provider from "../providers/@types/IProvider";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
import ProviderValueAdapter from "../../shared/adapters/ProviderValueAdapter";

describe("Documents Service", () => {
    describe("getDocumentBySiren", () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const aggregateMock = jest.spyOn(documentsService, "aggregate") as jest.SpyInstance<Promise<(string | null)[]>, []>;

        afterAll(() => {
            aggregateMock.mockClear();
        })

        it("should be return list of document", async () => {
            const expected = ["DocumentA", "DocumentB"];

            aggregateMock.mockImplementationOnce(() => Promise.resolve(expected));

            const actual = await documentsService.getDocumentBySiren("SIREN");

            expect(expected).toEqual(actual);
        })

        it("should be return filtred list of document", async () => {
            const expected = ["DocumentA", "DocumentB"];

            aggregateMock.mockImplementationOnce(() => Promise.resolve(["DocumentA", null, null, "DocumentB", null]));

            const actual = await documentsService.getDocumentBySiren("SIREN");

            expect(expected).toEqual(actual);
        })

        it("should be return an empty list", async () => {
            const expected = 0;

            aggregateMock.mockImplementationOnce(() => Promise.resolve([null, null, null]));

            const actual = await documentsService.getDocumentBySiren("SIREN");

            expect(actual).toHaveLength(expected);
        })

        it("should be call aggregate with SIREN", async () => {
            const expected = "SIREN";
            aggregateMock.mockImplementationOnce(() => Promise.resolve([]));
            
            await documentsService.getDocumentBySiren(expected);
            
            const actual = aggregateMock;

            expect(actual).toHaveBeenCalledWith(expected);
        })
    })

    describe("getDocumentBySiret", () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const aggregateMock = jest.spyOn(documentsService, "aggregate") as jest.SpyInstance<Promise<(string | null)[]>, []>;

        afterAll(() => {
            aggregateMock.mockClear();
        })

        it("should be return list of document", async () => {
            const expected = ["DocumentA", "DocumentB"];

            aggregateMock.mockImplementationOnce(() => Promise.resolve(expected));

            const actual = await documentsService.getDocumentBySiret("SIRET");

            expect(expected).toEqual(actual);
        })

        it("should be return filtred list of document", async () => {
            const expected = ["DocumentA", "DocumentB"];

            aggregateMock.mockImplementationOnce(() => Promise.resolve(["DocumentA", null, null, "DocumentB", null]));

            const actual = await documentsService.getDocumentBySiret("SIRET");

            expect(expected).toEqual(actual);
        })

        it("should be return an empty list", async () => {
            const expected = 0;

            aggregateMock.mockImplementationOnce(() => Promise.resolve([null, null, null]));

            const actual = await documentsService.getDocumentBySiret("SIRET");

            expect(actual).toHaveLength(expected);
        })

        it("should be call aggregate with SIRET", async () => {
            const expected = "SIRET";
            aggregateMock.mockImplementationOnce(() => Promise.resolve([]));
            
            await documentsService.getDocumentBySiret(expected);
            
            const actual = aggregateMock;

            expect(actual).toHaveBeenCalledWith(expected);
        })
    })

    describe("getDocumentByRna", () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const aggregateMock = jest.spyOn(documentsService, "aggregate") as jest.SpyInstance<Promise<(string | null)[]>, []>;

        afterAll(() => {
            aggregateMock.mockClear();
        })

        it("should be return list of document", async () => {
            const expected = ["DocumentA", "DocumentB"];

            aggregateMock.mockImplementationOnce(() => Promise.resolve(expected));

            const actual = await documentsService.getDocumentByRna("RNA");

            expect(expected).toEqual(actual);
        })

        it("should be return filtred list of document", async () => {
            const expected = ["DocumentA", "DocumentB"];

            aggregateMock.mockImplementationOnce(() => Promise.resolve(["DocumentA", null, null, "DocumentB", null]));

            const actual = await documentsService.getDocumentByRna("RNA");

            expect(expected).toEqual(actual);
        })

        it("should be return an empty list", async () => {
            const expected = 0;

            aggregateMock.mockImplementationOnce(() => Promise.resolve([null, null, null]));

            const actual = await documentsService.getDocumentByRna("RNA");

            expect(actual).toHaveLength(expected);
        })

        it("should be call aggregate with RNA", async () => {
            const expected = "RNA";
            aggregateMock.mockImplementationOnce(() => Promise.resolve([]));
            
            await documentsService.getDocumentByRna(expected);
            
            const actual = aggregateMock;

            expect(actual).toHaveBeenCalledWith(expected);
        })
    });

    describe("isDocumentProvider", () => {
        it("should be return true", () => {
            const expected = true;

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const actual = documentsService.isDocumentProvider({ isDocumentProvider: true });

            expect(actual).toBe(expected);
        })

        it("should be return false", () => {
            const expected = false;

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const actual = documentsService.isDocumentProvider({});

            expect(actual).toBe(expected);
        })
    })

    describe('getDocumentProviders', () => {

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const isDocumentProviderMock = jest.spyOn(documentsService, "isDocumentProvider") as jest.SpyInstance<boolean, []>;

        afterAll(() => {
            isDocumentProviderMock.mockClear();
        })
        
        it("Should not retrun provider", () => {
            const expected = 0;

            isDocumentProviderMock.mockImplementation(() => false)

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const actual = documentsService.getDocumentProviders();

            expect(actual).toHaveLength(expected);

            isDocumentProviderMock.mockClear();
        })

        it("Should retrun providers", () => {
            const expected = Object.values(providers).length;

            isDocumentProviderMock.mockImplementation(() => true)

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const actual = documentsService.getDocumentProviders();

            expect(actual).toHaveLength(expected);

            isDocumentProviderMock.mockClear();
        })

        it("Should retrun part of providers", () => {
            const expected = Math.floor(Object.values(providers).length / 2);
            let i = 0;
            isDocumentProviderMock.mockImplementation(() => {
                i++;
                return i % 2 === 0;
            })

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const actual = documentsService.getDocumentProviders();
            expect(actual).toHaveLength(expected);

            isDocumentProviderMock.mockClear();
        })
    })

    describe("aggregate", () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const getDocumentProvidersMock = jest.spyOn(documentsService, "getDocumentProviders") as jest.SpyInstance<Provider[], []>;
        const getIdentifierTypeMock = jest.spyOn(IdentifierHelper, "getIdentifierType");
    
        afterAll(() => {
            getDocumentProvidersMock.mockClear();
            getIdentifierTypeMock.mockClear();
        })

        it("should be throw error", async () => {
            const expected = "You must provide a valid SIREN or RNA or SIRET";

            getIdentifierTypeMock.mockImplementationOnce(() => null);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const actual = documentsService.aggregate("WRONG");
            expect(actual).rejects.toThrowError(expected);
        })

        it("should be call getDocumentsByRna", async () => {
            const mock = jest.fn(() => true);
            const expected = "W00000000";

            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.rna);
            getDocumentProvidersMock.mockImplementationOnce(() => [
                {
                    getDocumentsByRna: mock
                } as unknown as Provider
            ]);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            await documentsService.aggregate(expected);

            expect(mock).toHaveBeenCalledWith(expected);
        })

        it("should be call getDocumentsBySiren", async () => {
            const mock = jest.fn(() => true);
            const expected = "123456789";

            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siren);
            getDocumentProvidersMock.mockImplementationOnce(() => [
                {
                    getDocumentsBySiren: mock
                } as unknown as Provider
            ]);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            await documentsService.aggregate(expected);

            expect(mock).toHaveBeenCalledWith(expected);
        })

        it("should be call getDocumentsBySiret", async () => {
            const mock = jest.fn(() => true);
            const expected = "12345678912345";

            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siret);
            getDocumentProvidersMock.mockImplementationOnce(() => [
                {
                    getDocumentsBySiret: mock
                } as unknown as Provider
            ]);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            await documentsService.aggregate(expected);

            expect(mock).toHaveBeenCalledWith(expected);
        })

        it("should return documents", async () => {
            const toPV = (value: unknown) => ProviderValueAdapter.toProviderValue(value, "TEST", new Date());

            const expected = [
                {
                    type: toPV("rib"),
                    url: toPV("/url/to/file"),
                    nom: toPV("name of file")
                },
                {
                    type: toPV("document"),
                    url: toPV("/url/to/file2"),
                    nom: toPV("name of file2")
                }
            ];

            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siret);
            getDocumentProvidersMock.mockImplementationOnce(() => [
                {
                    getDocumentsBySiret: () => expected
                } as unknown as Provider
            ]);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const actual = await documentsService.aggregate(expected);

            expect(actual).toEqual(expected);
        })
    })

});

