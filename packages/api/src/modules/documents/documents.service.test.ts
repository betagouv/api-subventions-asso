import documentsService from "./documents.service";

describe("Documents Service", () => {
    describe("getDocumentBySiren", () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const aggregateMock = jest.spyOn(documentsService, "aggregate") as jest.SpyInstance<Promise<(string | null)[]>, []>;

        afterAll(() => {
            aggregateMock.mockReset();
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
            aggregateMock.mockReset();
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
            aggregateMock.mockReset();
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
        const isDocumentProviderMock = jest.spyOn(documentsService, "isDocumentProvider");
        
    })
});

