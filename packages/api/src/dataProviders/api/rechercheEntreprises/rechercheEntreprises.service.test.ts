import rechercheEntreprisesPort from "./rechercheEntreprises.port";
import rechercheEntreprisesService from "./rechercheEntreprises.service";
import { RechercheEntreprisesResultDto } from "./RechercheEntreprisesDto";
import { RechercheEntreprisesAdapter } from "./RechercheEntreprisesAdapter";
import AssociationNameEntity from "../../../modules/association-name/entities/AssociationNameEntity";

// Mocking the external dependencies
jest.mock("./RechercheEntreprisesAdapter");
jest.mock("./rechercheEntreprises.port");

const mockedRechercheEntreprisesAdapter = RechercheEntreprisesAdapter as jest.Mocked<
    typeof RechercheEntreprisesAdapter
>;

describe("RechercheEntreprisesService", () => {
    const SIREN = "123456789";
    const NAME = "Example";

    describe("search", () => {
        it("should filter out results with missing nom_complet or siren fields", async () => {
            const expected = new AssociationNameEntity(NAME, SIREN);
            const responseData: RechercheEntreprisesResultDto[] = [
                { nom_complet: NAME, siren: SIREN },
                { nom_complet: undefined, siren: "987654321" },
                { nom_complet: "Example 2", siren: undefined },
                { nom_complet: undefined, siren: undefined },
            ];
            mockedRechercheEntreprisesAdapter.toAssociationNameEntity.mockReturnValueOnce(expected);
            jest.mocked(rechercheEntreprisesPort.search).mockResolvedValueOnce(responseData);

            const result = await rechercheEntreprisesService.search("example");

            expect(result).toEqual([expected]);
        });

        it("should use RechercheEntreprisesAdapter.toAssociationNameEntity to convert results", async () => {
            const responseData: RechercheEntreprisesResultDto[] = [{ nom_complet: NAME, siren: SIREN }];
            jest.mocked(rechercheEntreprisesPort.search).mockResolvedValueOnce(responseData);

            await rechercheEntreprisesService.search("example");

            expect(mockedRechercheEntreprisesAdapter.toAssociationNameEntity).toHaveBeenCalledWith(responseData[0]);
        });

        describe("forceAsso is true", () => {
            it("raises error if single result is a company", async () => {
                const responseData: RechercheEntreprisesResultDto[] = [
                    { nom_complet: NAME, siren: SIREN, nature_juridique: "1234567890" },
                ];
                jest.mocked(rechercheEntreprisesPort.search).mockResolvedValueOnce(responseData);

                const test = () => rechercheEntreprisesService.search("example", true);

                expect(test).rejects.toMatchInlineSnapshot(
                    `[Error: Votre recherche pointe vers une entité qui n'est pas une association]`,
                );
            });
        });
    });
});
