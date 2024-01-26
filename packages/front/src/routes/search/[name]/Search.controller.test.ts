import SearchController from "./Search.controller";
import * as IdentifierHelper from "$lib/helpers/identifierHelper";
vi.mock("$lib/helpers/identifierHelper");
const mockedIdentifierHelper = vi.mocked(IdentifierHelper);
import associationService from "$lib/resources/associations/association.service";
vi.mock("$lib/resources/associations/association.service");
const mockedAssociationService = vi.mocked(associationService);
vi.mock("$app/navigation");

describe("SearchController", () => {
    describe("fetchAssociationFromName()", () => {
        it("should set duplicate store", async () => {
            const RNA = "RNA";
            const RNA_SIREN_1 = { rna: RNA, siren: "SIREN_1" };
            const RNA_SIREN_2 = { rna: RNA, siren: "SIREN_2" };
            const expected = [RNA_SIREN_1.siren, RNA_SIREN_2.siren];
            mockedAssociationService.search.mockResolvedValueOnce([RNA_SIREN_1, RNA_SIREN_2]);
            mockedIdentifierHelper.isRna.mockReturnValue(true);
            const controller = new SearchController(RNA);
            await new Promise(process.nextTick);
            const actual = controller.duplicatesFromIdentifier.value;
            expect(actual).toEqual(expected);
            mockedIdentifierHelper.isRna.mockReset();
        });

        it("should unset duplicate store on second search, with name", async () => {
            const RNA = "RNA";
            const RNA_SIREN_1 = { rna: RNA, siren: "SIREN_1" };
            const RNA_SIREN_2 = { rna: RNA, siren: "SIREN_2" };
            const expected = null;
            mockedAssociationService.search.mockResolvedValueOnce([RNA_SIREN_1, RNA_SIREN_2]);
            mockedIdentifierHelper.isRna.mockReturnValueOnce(true);
            mockedAssociationService.search.mockResolvedValueOnce([RNA_SIREN_1, RNA_SIREN_2]);
            const controller = new SearchController(RNA);
            await new Promise(process.nextTick);
            controller.fetchAssociationFromName("name");
            const actual = controller.duplicatesFromIdentifier.value;
            expect(actual).toEqual(expected);
        });
    });
});
