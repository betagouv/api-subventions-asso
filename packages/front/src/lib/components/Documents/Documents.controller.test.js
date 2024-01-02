import { DocumentsController } from "$lib/components/Documents/Documents.controller";
vi.mock("$lib/resources/documents/documents.service");

describe("Documents.controller", () => {
    let documentController;
    beforeAll(() => (documentController = new DocumentsController("association")));
});
