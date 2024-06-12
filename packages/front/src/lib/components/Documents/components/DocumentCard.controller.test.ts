import { nanoid } from "nanoid";
import trackerService from "$lib/services/tracker.service.js";
import { DocumentCardController } from "$lib/components/Documents/components/DocumentCard.controller";
vi.mock("$lib/resources/documents/documents.service");
vi.mock("$lib/services/tracker.service.js");
vi.mock("nanoid");

describe("Documents.controller", () => {
    let controller: DocumentCardController;

    beforeAll(() => {
        controller = new DocumentCardController();
    });

    it("defines checkboxId", () => {
        const expected = "NOM1609459200000";
        vi.mocked(nanoid).mockReturnValueOnce(expected);
        const ctrl = new DocumentCardController();
        const actual = ctrl.checkBoxId;
        expect(actual).toBe(expected);
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
