import SearchController from "./Search.controller";
import * as IdentifierHelper from "$lib/helpers/identifierHelper";
vi.mock("$lib/helpers/identifierHelper");
const mockedIdentifierHelper = vi.mocked(IdentifierHelper);
import associationService from "$lib/resources/associations/association.service";
vi.mock("$lib/resources/associations/association.service");
const mockedAssociationService = vi.mocked(associationService);
import { goto } from "$app/navigation";
vi.mock("$app/navigation");

describe("SearchController", () => {
    describe("fetchAssociationFromName()", () => {
        it("should set duplicate store", async () => {
            const RNA = "RNA";
            const RNA_SIREN_1 = { rna: RNA, siren: "SIREN_1" };
            const RNA_SIREN_2 = { rna: RNA, siren: "SIREN_2" };
            const expected = [RNA_SIREN_1.siren, RNA_SIREN_2.siren];
            mockedAssociationService.search.mockResolvedValue([RNA_SIREN_1, RNA_SIREN_2]);
            mockedIdentifierHelper.isRna.mockReturnValue(true);
            const controller = new SearchController(RNA);
            await new Promise(process.nextTick);
            const actual = controller.duplicatesFromIdentifier.value;
            expect(actual).toEqual(expected);
        });
    });
});
