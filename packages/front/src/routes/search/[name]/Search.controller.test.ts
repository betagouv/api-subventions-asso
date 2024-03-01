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
        const RNA = "RNA";
        const RNA_SIREN_1 = { rna: RNA, siren: "SIREN_1", name: "NOM" };
        const RNA_SIREN_2 = { rna: RNA, siren: "SIREN_2", name: "NOM" };
        const DUPLICATED_RESULTS = {
            nbPages: 1,
            page: 1,
            results: [RNA_SIREN_1, RNA_SIREN_2],
            totalResults: 2,
        };

        it("should set duplicate store", async () => {
            const expected = [RNA_SIREN_1.siren, RNA_SIREN_2.siren];
            mockedAssociationService.search.mockResolvedValueOnce(DUPLICATED_RESULTS);
            mockedIdentifierHelper.isRna.mockReturnValue(true);
            const controller = new SearchController(RNA);
            await new Promise(process.nextTick);
            const actual = controller.duplicatesFromIdentifier.value;
            expect(actual).toEqual(expected);
            mockedIdentifierHelper.isRna.mockReset();
        });

        it("should unset duplicate store on second search, with name", async () => {
            const expected = null;
            mockedAssociationService.search.mockResolvedValueOnce(DUPLICATED_RESULTS);
            mockedIdentifierHelper.isRna.mockReturnValueOnce(true);
            mockedAssociationService.search.mockResolvedValueOnce(DUPLICATED_RESULTS);
            const controller = new SearchController(RNA);
            await new Promise(process.nextTick);
            await controller.fetchAssociationFromName("name");
            const actual = controller.duplicatesFromIdentifier.value;
            expect(actual).toEqual(expected);
        });
    });
});
