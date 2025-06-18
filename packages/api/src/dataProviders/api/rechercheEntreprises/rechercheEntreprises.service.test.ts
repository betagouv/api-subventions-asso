import rechercheEntreprisesPort from "./rechercheEntreprises.port";
import rechercheEntreprisesService from "./rechercheEntreprises.service";
import { RechercheEntreprisesResultDto } from "./RechercheEntreprisesDto";
import { RechercheEntreprisesAdapter } from "./RechercheEntreprisesAdapter";
import AssociationNameEntity from "../../../modules/association-name/entities/AssociationNameEntity";
import Siren from "../../../identifierObjects/Siren";
import associationHelper from "../../../modules/associations/associations.helper";

// Mocking the external dependencies
jest.mock("./RechercheEntreprisesAdapter");
jest.mock("./rechercheEntreprises.port");
jest.mock("../../../modules/associations/associations.helper");

const mockedRechercheEntreprisesAdapter = RechercheEntreprisesAdapter as jest.Mocked<
    typeof RechercheEntreprisesAdapter
>;

describe("RechercheEntreprisesService", () => {
    const SIREN = new Siren("123456789");
    const NAME = "Example";

    beforeAll(() => {
        jest.mocked(associationHelper.isCategoryFromAsso).mockReturnValue(true);
    });

    afterAll(() => {
        jest.mocked(associationHelper.isCategoryFromAsso).mockRestore();
    });

    describe("search", () => {
        it("should filter out results with missing nom_complet or siren fields", async () => {
            const expected = new AssociationNameEntity(NAME, SIREN);
            const responseData: RechercheEntreprisesResultDto[] = [
                { nom_complet: NAME, siren: SIREN.value },
                { nom_complet: undefined, siren: "987654321" },
                { nom_complet: "Example 2", siren: undefined },
                { nom_complet: undefined, siren: undefined },
            ];
            mockedRechercheEntreprisesAdapter.toAssociationNameEntity.mockReturnValueOnce(expected);
            jest.mocked(rechercheEntreprisesPort.search).mockResolvedValueOnce(responseData);

            const result = await rechercheEntreprisesService.searchForceAsso("example");

            expect(result).toEqual([expected]);
        });

        it("should use RechercheEntreprisesAdapter.toAssociationNameEntity to convert results", async () => {
            const responseData: RechercheEntreprisesResultDto[] = [{ nom_complet: NAME, siren: SIREN.value }];
            jest.mocked(rechercheEntreprisesPort.search).mockResolvedValueOnce(responseData);

            await rechercheEntreprisesService.searchForceAsso("example");

            expect(mockedRechercheEntreprisesAdapter.toAssociationNameEntity).toHaveBeenCalledWith(responseData[0]);
        });

        it("raises error if single result is a company", async () => {
            const responseData: RechercheEntreprisesResultDto[] = [
                { nom_complet: NAME, siren: SIREN.value, nature_juridique: "1234567890" },
            ];
            jest.mocked(rechercheEntreprisesPort.search).mockResolvedValueOnce(responseData);
            jest.mocked(associationHelper.isCategoryFromAsso).mockReturnValueOnce(false);

            const test = () => rechercheEntreprisesService.searchForceAsso("example");

            expect(test).rejects.toMatchInlineSnapshot(
                `[Error: Votre recherche pointe vers une entité qui n'est pas une association]`,
            );
        });
    });
});
