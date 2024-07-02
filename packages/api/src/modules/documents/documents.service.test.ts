import fs from "fs";
import childProcess from "child_process";
import documentsService from "./documents.service";

jest.mock("../providers");

import { DocumentRequestDto } from "dto";
import providers from "../providers";
import Provider from "../providers/@types/IProvider";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
import * as IdentifierHelper from "../../shared/helpers/IdentifierHelper";
import { ProviderRequestService } from "../provider-request/providerRequest.service";
import { documentToDocumentRequest } from "./document.adapter";
import { ReadStream } from "node:fs";

jest.mock("../../shared/helpers/IdentifierHelper", () => ({
    getIdentifierType: jest.fn(() => StructureIdentifiersEnum.siren) as jest.SpyInstance,
}));
jest.mock("./document.adapter");
jest.mock("fs");
jest.mock("child_process");

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

        it("should return list of document", async () => {
            const expected = ["DocumentA", "DocumentB"];

            mockAggregateDocuments.mockImplementationOnce(() => Promise.resolve(expected));

            const actual = await documentsService.getDocumentBySiren("SIREN");

            expect(expected).toEqual(actual);
        });

        it("should return filtred list of document", async () => {
            const expected = ["DocumentA", "DocumentB"];

            mockAggregateDocuments.mockImplementationOnce(() =>
                Promise.resolve(["DocumentA", null, null, "DocumentB", null]),
            );

            const actual = await documentsService.getDocumentBySiren("SIREN");

            expect(expected).toEqual(actual);
        });

        it("should return an empty list", async () => {
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

        it("should return filtred list of document", async () => {
            const expected = ["DocumentA", "DocumentB"];

            mockAggregateDocuments.mockImplementationOnce(() =>
                Promise.resolve(["DocumentA", null, null, "DocumentB", null]),
            );

            const actual = await documentsService.getDocumentBySiret("SIRET");

            expect(expected).toEqual(actual);
        });

        it("should return an empty list", async () => {
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

        it("should return list of document", async () => {
            const expected = ["DocumentA", "DocumentB"];

            mockAggregateDocuments.mockImplementationOnce(() => Promise.resolve(expected));

            const actual = await documentsService.getDocumentByRna("RNA");

            expect(expected).toEqual(actual);
        });

        it("should return filtred list of document", async () => {
            const expected = ["DocumentA", "DocumentB"];

            mockAggregateDocuments.mockImplementationOnce(() =>
                Promise.resolve(["DocumentA", null, null, "DocumentB", null]),
            );

            const actual = await documentsService.getDocumentByRna("RNA");

            expect(expected).toEqual(actual);
        });

        it("should return an empty list", async () => {
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
        it("should return true", () => {
            const expected = true;

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const actual = documentsService.isDocumentProvider({
                isDocumentProvider: true,
            });

            expect(actual).toBe(expected);
        });

        it("should return false", () => {
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

        it("Should not return provider", () => {
            const expected = 0;

            isDocumentProviderMock.mockImplementation(() => false);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const actual = documentsService.getDocumentProviders();

            expect(actual).toHaveLength(expected);

            isDocumentProviderMock.mockClear();
        });

        it("Should return providers", () => {
            const expected = Object.values(providers).length;

            isDocumentProviderMock.mockImplementation(() => true);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const actual = documentsService.getDocumentProviders();

            expect(actual).toHaveLength(expected);

            isDocumentProviderMock.mockClear();
        });

        it("Should return part of providers", () => {
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
        const documents = [{ type: "TEST" }, { type: "TEST" }];
        const fn = jest.fn(async () => documents);
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
            const expected = documents;
            // @ts-expect-error: private method
            const actual = await documentsService.aggregate(providers, "getDocuments", SIREN);
            expect(actual).toEqual(expected);
        });
    });

    describe("getDocumentStream", () => {
        let getDocumentStreamSpy: jest.SpyInstance;
        const RES = "RES";
        const DOC_ID = "id";

        describe.each`
            providerLetter | documentStreamObject  | documentStreamMethodName       | args
            ${"A"}         | ${documentsService}   | ${"getGenericDocumentStream"}  | ${[providers.serviceA["http"], DOC_ID]}
            ${"E"}         | ${providers.serviceE} | ${"getSpecificDocumentStream"} | ${[DOC_ID]}
        `(
            "if service has getSpecificDocumentStream method",
            ({ providerLetter, documentStreamObject, documentStreamMethodName, args }) => {
                const PROVIDER_ID = `prov-${providerLetter}`;

                beforeEach(() => {
                    getDocumentStreamSpy = jest
                        .spyOn(documentStreamObject, documentStreamMethodName)
                        .mockResolvedValue(RES);
                });

                it("calls getDocumentStream", async () => {
                    await documentsService.getDocumentStream(PROVIDER_ID, DOC_ID);
                    expect(getDocumentStreamSpy).toHaveBeenCalledWith(...args);
                });

                it("returns stream from dauphin service", async () => {
                    const expected = RES;
                    const actual = await documentsService.getDocumentStream(PROVIDER_ID, DOC_ID);
                    expect(actual).toBe(expected);
                });
            },
        );

        afterAll(() => {
            jest.mocked(documentsService.getGenericDocumentStream).mockRestore();
        });
    });

    describe("getGenericDocumentStream", () => {
        let httpGetSpy: jest.SpyInstance;
        const HTTP = new ProviderRequestService("PROVIDER_ID");
        const URL = "path";
        const RES = "STREAM";

        beforeEach(() => {
            // @ts-ignore
            httpGetSpy = jest.spyOn(HTTP, "get").mockResolvedValue({ data: RES });
            httpGetSpy.mockClear();
        });

        it("calls request's GET with proper args ", async () => {
            await documentsService.getGenericDocumentStream(HTTP, URL);
            const actual = httpGetSpy.mock.calls[0];
            expect(actual).toMatchInlineSnapshot(`
                Array [
                  "path",
                  Object {
                    "headers": Object {
                      "Referrer-Policy": "strict-origin-when-cross-origin",
                      "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
                      "mg-authentication": "true",
                    },
                    "responseType": "stream",
                  },
                ]
            `);
        });

        it("returns data from GET response", async () => {
            const expected = RES;
            const actual = await documentsService.getGenericDocumentStream(HTTP, URL);
            expect(actual).toBe(expected);
        });
    });

    describe("getDocumentsFilesByIdentifier", () => {
        let aggregateDocumentsSpy: jest.SpyInstance;
        let getRequestedDocumentsFilesSpy: jest.SpyInstance;
        const FAKE_DOCUMENT = "FAKE_DOCUMENT";

        beforeAll(() => {
            // @ts-expect-error aggregateDocument is private
            aggregateDocumentsSpy = jest.spyOn(documentsService, "aggregateDocuments");
            getRequestedDocumentsFilesSpy = jest
                .spyOn(documentsService, "getRequestedDocumentsFiles")
                .mockImplementation(jest.fn());
        });

        afterAll(() => {
            getRequestedDocumentsFilesSpy.mockRestore();
        });

        it("should call aggregateDocuments", async () => {
            const RNA = "W00000000";
            // @ts-expect-error: mock
            IdentifierHelper.getIdentifierType.mockReturnValueOnce(StructureIdentifiersEnum.rna);
            aggregateDocumentsSpy.mockResolvedValueOnce([FAKE_DOCUMENT]);
            await documentsService.getDocumentsFilesByIdentifier(RNA);

            expect(aggregateDocumentsSpy).toHaveBeenCalledWith(RNA);
        });

        it("should throw an error when identifier type is unknown", async () => {
            // @ts-expect-error: mock
            IdentifierHelper.getIdentifierType.mockReturnValueOnce(undefined);
            await expect(documentsService.getDocumentsFilesByIdentifier("SIRET")).rejects.toThrow();
        });

        it("should throw an error no documents found", async () => {
            const SIRET = "12345678912345";
            // @ts-expect-error: mock
            IdentifierHelper.getIdentifierType.mockReturnValueOnce(StructureIdentifiersEnum.siret);
            aggregateDocumentsSpy.mockResolvedValueOnce([]);
            await expect(documentsService.getDocumentsFilesByIdentifier(SIRET)).rejects.toThrow();
        });

        it("should adapt document", async () => {
            // @ts-expect-error: mock
            IdentifierHelper.getIdentifierType.mockReturnValueOnce(StructureIdentifiersEnum.siret);
            aggregateDocumentsSpy.mockResolvedValueOnce([FAKE_DOCUMENT, FAKE_DOCUMENT]);
            await documentsService.getDocumentsFilesByIdentifier(SIRET);
            expect(documentToDocumentRequest).toHaveBeenCalledTimes(2);
        });

        it("should call downloadDocument with adapted ", async () => {
            const ADAPTED = "ADAPTED";
            // @ts-expect-error: mock
            IdentifierHelper.getIdentifierType.mockReturnValueOnce(StructureIdentifiersEnum.siret);
            aggregateDocumentsSpy.mockResolvedValueOnce([FAKE_DOCUMENT, FAKE_DOCUMENT]);
            jest.mocked(documentToDocumentRequest).mockReturnValue(ADAPTED as unknown as DocumentRequestDto);
            await documentsService.getDocumentsFilesByIdentifier(SIRET);
            jest.mocked(documentToDocumentRequest).mockRestore();
            expect(getRequestedDocumentsFilesSpy).toBeCalledWith([ADAPTED, ADAPTED], SIRET);
        });
    });

    describe("getRequestedDocumentsFiles", () => {
        let downloadDocumentSpy: jest.SpyInstance;

        const FAKE_DOCUMENT = "FAKE_DOCUMENT" as unknown as DocumentRequestDto;
        const FAKE_STREAM = {
            on: jest.fn(),
        };
        const REQUESTED_DOCS = [FAKE_DOCUMENT] as DocumentRequestDto[];
        const IDENTIFIER = "12345678912345";

        beforeAll(() => {
            // @ts-expect-error downloadDocument
            downloadDocumentSpy = jest.spyOn(documentsService, "downloadDocument").mockImplementation(jest.fn());

            // FS
            jest.mocked(fs.mkdirSync).mockImplementation(jest.fn());
            jest.mocked(fs.rmSync).mockImplementation(jest.fn());
            jest.mocked(fs.createReadStream).mockReturnValue(FAKE_STREAM as unknown as ReadStream);

            // childProcess (zip)
            jest.mocked(childProcess.execSync).mockImplementation(jest.fn());
        });

        afterAll(() => {
            downloadDocumentSpy.mockRestore();
        });

        it("should call mkdir", async () => {
            // @ts-expect-error: mock
            IdentifierHelper.getIdentifierType.mockReturnValueOnce(StructureIdentifiersEnum.siret);
            await documentsService.getRequestedDocumentsFiles(REQUESTED_DOCS, IDENTIFIER);
            expect(fs.mkdirSync).toBeCalled();
        });

        it("should call downloadDocument", async () => {
            await documentsService.getRequestedDocumentsFiles(REQUESTED_DOCS, IDENTIFIER);
            expect(downloadDocumentSpy).toBeCalledWith(expect.any(String), FAKE_DOCUMENT);
        });

        it("should call execSync", async () => {
            // @ts-expect-error: mock
            IdentifierHelper.getIdentifierType.mockReturnValueOnce(StructureIdentifiersEnum.siret);
            downloadDocumentSpy.mockResolvedValueOnce("/fake/path");
            await documentsService.getRequestedDocumentsFiles(REQUESTED_DOCS, IDENTIFIER);
            expect(childProcess.execSync).toBeCalledWith(
                expect.stringMatching('zip -j /tmp/12345678912345-([0-9]+).zip "/fake/path"'),
            );
        });

        it("should call rmSync", async () => {
            // @ts-expect-error: mock
            IdentifierHelper.getIdentifierType.mockReturnValueOnce(StructureIdentifiersEnum.siret);
            downloadDocumentSpy.mockResolvedValueOnce("/fake/path");
            await documentsService.getRequestedDocumentsFiles(REQUESTED_DOCS, IDENTIFIER);
            expect(fs.rmSync).toBeCalledWith(expect.stringMatching("/tmp/12345678912345-([0-9]+)"), {
                recursive: true,
                force: true,
            });
        });

        it("should call createReadStream and return stream", async () => {
            // @ts-expect-error: mock
            IdentifierHelper.getIdentifierType.mockReturnValueOnce(StructureIdentifiersEnum.siret);
            downloadDocumentSpy.mockResolvedValueOnce("/fake/path");
            const actual = await documentsService.getRequestedDocumentsFiles(REQUESTED_DOCS, IDENTIFIER);
            expect(fs.createReadStream).toBeCalledWith(expect.stringMatching("/tmp/12345678912345-([0-9]+).zip"));
            expect(actual).toBe(FAKE_STREAM);
        });

        it("should call remove file after end of stream", async () => {
            // @ts-expect-error: mock
            IdentifierHelper.getIdentifierType.mockReturnValueOnce(StructureIdentifiersEnum.siret);
            downloadDocumentSpy.mockResolvedValueOnce("/fake/path");
            await documentsService.getRequestedDocumentsFiles(REQUESTED_DOCS, IDENTIFIER);

            const lastStreamOnCall = FAKE_STREAM.on.mock.lastCall;

            const callbackOnLastStream = lastStreamOnCall[1];

            callbackOnLastStream();

            expect(fs.rmSync).toBeCalledWith(expect.stringMatching("/tmp/12345678912345-([0-9]+).zip"));
        });
    });

    describe("downloadDocument", () => {
        let getDocStream: jest.SpyInstance;

        beforeAll(() => {
            const pipeMock = { headers: {}, pipe: () => ({ on: jest.fn() }) };
            // @ts-expect-error downloadDocument
            getDocStream = jest.spyOn(documentsService, "getDocumentStreamByLocalApiUrl").mockResolvedValue(pipeMock);
        });

        afterAll(() => {
            getDocStream.mockRestore();
        });

        it("calls getDocumentStreamByLocalApiUrl", () => {
            const DOC = { url: "url", nom: "nom", type: "type" };
            // @ts-expect-error test private
            documentsService.downloadDocument("folder/name", DOC);
            expect(getDocStream).toHaveBeenCalledWith("url");
        });
    });
});
