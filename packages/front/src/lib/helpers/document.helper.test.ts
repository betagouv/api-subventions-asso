vi.mock("./documents.port");
import documentHelper from "./document.helper";

vi.mock("$env/static/public", () => ({ DATASUB_URL: "https://api.fr" }));

describe("DocumentHelper", () => {
    const DOCUMENTS = [
        { type: "RIB", url: "/rib" },
        { type: "RAR", url: "/rar" },
    ];

    describe("formatAndSortDocuments", () => {
        it("should return formatted and sorted documents", () => {
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
            document.body.removeChild = vi.fn();

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

        it("creates object url with blob", () => {
            documentHelper.download(BLOB, NAME);
            expect(window.URL.createObjectURL).toHaveBeenCalledWith(BLOB);
        });

        it("create link element", () => {
            documentHelper.download(BLOB, NAME);
            expect(document.createElement).toHaveBeenCalledWith("a");
        });

        it("link attributes properly tested", () => {
            documentHelper.download(BLOB, NAME);
            expect(ELEMENT.setAttribute).toHaveBeenCalledWith("href", BLOB_URL);
            expect(ELEMENT.setAttribute).toHaveBeenCalledWith("download", NAME);
            expect(ELEMENT.setAttribute).toHaveBeenCalledWith("target", "_blank");
        });

        it("clicks link", () => {
            documentHelper.download(BLOB, NAME);
            expect(ELEMENT.click).toHaveBeenCalled();
        });

        it("clears download setup", () => {
            documentHelper.download(BLOB, NAME);
            expect(document.body.removeChild).toHaveBeenCalledWith(ELEMENT);
            expect(window.URL.revokeObjectURL).toHaveBeenCalledWith(BLOB_URL);
        });
    });
});
