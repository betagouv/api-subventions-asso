import { DocumentsController } from "$lib/components/Documents/Documents.controller";
import trackerService from "$lib/services/tracker.service.js";
vi.mock("$lib/resources/documents/documents.service");
vi.mock("$lib/services/tracker.service.js");

describe("Documents.controller", () => {
    let documentController;
    beforeAll(() => (documentController = new DocumentsController("association")));

    describe("onClick", () => {
        const EVENT = { preventDefault: vi.fn() };

        it("tracks click", async () => {
            const URL = "https://google.fr";
            await documentController.onClick(EVENT, { url: URL });
            expect(trackerService.buttonClickEvent).toHaveBeenCalledWith(
                "association-etablissement.documents.download",
                URL,
            );
        });
    });
});
