import { nanoid } from "nanoid";
import trackerService from "$lib/services/tracker.service.js";
import { DocumentCardController } from "$lib/components/Documents/components/DocumentCard.controller";
import type { DocumentEntity } from "$lib/entities/DocumentEntity";
vi.mock("$lib/resources/documents/documents.service");
vi.mock("$lib/services/tracker.service.js");
vi.mock("nanoid");

describe("Documents.controller", () => {
    let controller: DocumentCardController;
    const DOC: DocumentEntity = {
        __meta__: { siret: "123456789" },
        date: new Date("2024-06-01"),
        label: "Libellé",
        nom: "",
        provider: "",
        type: "",
        url: "",
    };

    beforeAll(() => {
        controller = new DocumentCardController(DOC);
    });

    it("defines checkboxId", () => {
        const expected = "NOM1609459200000";
        vi.mocked(nanoid).mockReturnValueOnce(expected);
        const ctrl = new DocumentCardController(DOC);
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

    describe("documentLabel", () => {
        it("returns label and siret combined if siret is known", () => {
            const expected = "Libellé";
            const actual = controller.documentLabel;
            expect(actual).toBe(expected);
        });
    });
});
