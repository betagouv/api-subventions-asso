import { DocumentsController } from "$lib/components/Documents/Documents.controller";
import trackerService from "$lib/services/tracker.service.js";
import { DocumentCardController } from "$lib/components/Documents/components/DocumentCard.controller";
vi.mock("$lib/resources/documents/documents.service");
vi.mock("$lib/services/tracker.service.js");

describe("Documents.controller", () => {
    let controller: DocumentCardController;
    beforeAll(() => {
        controller = new DocumentCardController();
    });

    describe("onClick", () => {
        const EVENT = { preventDefault: vi.fn() };

        it("tracks click", async () => {
            const URL = "https://google.fr";
            await controller.onClick(EVENT, { url: URL });
            expect(trackerService.buttonClickEvent).toHaveBeenCalledWith(
                "association-etablissement.documents.download",
                URL,
            );
        });
    });
});
