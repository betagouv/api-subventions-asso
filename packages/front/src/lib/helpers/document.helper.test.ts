vi.mock("./documents.port");
import documentHelper from "./document.helper";

vi.mock("$env/static/public", () => ({ DATASUB_URL: "https://api.fr" }));

describe("DocumentHelper", () => {
    const DOCUMENTS = [
        { type: "RIB", url: "/rib" },
        { type: "RAR", url: "/rar" },
    ];

    describe("formatAndSortDocuments", () => {
        it("should return formated and sorted documents", () => {
            const expected = [
                {
                    label: "Rapport d'activité",
                    type: "RAR",
                    url: "https://api.fr/rar",
                },
                {
                    label: "RIB",
                    type: "RIB",
                    url: "https://api.fr/rib",
                },
            ];
            const actual = documentHelper.formatAndSortDocuments(DOCUMENTS);
            expect(actual).toEqual(expected);
        });
    });

    describe("download", () => {
        let oldURL, oldCreateElement, oldAppendChild;

        const BLOB = "blob" as unknown as Blob; // mock
        const BLOB_PROMISE = Promise.resolve(BLOB);
        const NAME = "filename";
        const BLOB_URL = "/blob/url";
        const ELEMENT = { href: "", setAttribute: vi.fn(), click: vi.fn() };

        beforeAll(() => {
            oldURL = window.URL;
            oldCreateElement = document.createElement;
            oldAppendChild = document.body.appendChild;
            // @ts-expect-error -- mock window
            delete window.URL;
            // @ts-expect-error -- mock window
            delete document.createElement;
            // @ts-expect-error -- mock window
            delete document.body;
            // @ts-expect-error -- mock window
            window.URL = {
                createObjectURL: vi.fn((..._args) => BLOB_URL),
                revokeObjectURL: vi.fn(),
            };

            document.body.appendChild = vi.fn();

            // @ts-expect-error -- mock window
            document.createElement = vi.fn((..._args) => ELEMENT);
        });

        afterAll(() => {
            // @ts-expect-error -- mock window
            delete window.URL;
            window.URL = oldURL;
            document.body.appendChild = oldAppendChild;
            document.createElement = oldCreateElement;
        });

        it("creates object url with blob", async () => {
            await documentHelper.download(BLOB_PROMISE, NAME);
            expect(window.URL.createObjectURL).toHaveBeenCalledWith(BLOB);
        });

        it("create link element", async () => {
            await documentHelper.download(BLOB_PROMISE, NAME);
            expect(document.createElement).toHaveBeenCalledWith("a");
        });

        it("link attributes properly tested", async () => {
            await documentHelper.download(BLOB_PROMISE, NAME);
            expect(ELEMENT.href).toBe(BLOB_URL);
            expect(ELEMENT.setAttribute).toHaveBeenCalledWith("download", NAME);
            expect(ELEMENT.setAttribute).toHaveBeenCalledWith("target", "_blank");
        });

        it("clicks link", async () => {
            await documentHelper.download(BLOB_PROMISE, NAME);
            expect(ELEMENT.click).toHaveBeenCalled();
        });
    });
});
