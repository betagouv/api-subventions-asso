vi.mock("./documents.port");
import documentService from "./documents.service";
vi.mock("$env/static/public", () => ({ DATASUB_URL: "https://api.fr" }));

describe("DocumentService", () => {
    const DOC_URL = "/path";

    describe("formatAndSortDocuments", () => {
        documentService.formatAndSortDocuments([]);
    });
});
