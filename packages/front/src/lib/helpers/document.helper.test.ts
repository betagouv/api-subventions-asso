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
});
