import rechercheEntreprises, { RechercheEntreprises } from "./rechercheEntreprises.port";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../../shared/LegalCategoriesAccepted";
import { ProviderRequestService } from "../../../modules/provider-request/providerRequest.service";
import { RechercheEntreprisesDto } from "./RechercheEntreprisesDto";
import { RechercheEntreprisesAdapter } from "./RechercheEntreprisesAdapter";
import AssociationNameEntity from "../../../modules/association-name/entities/AssociationNameEntity";
import { RequestResponse } from "../../../modules/provider-request/@types/RequestResponse";

// Mocking the external dependencies
jest.mock("./RechercheEntreprisesAdapter");

const mockedRechercheEntreprisesAdapter = RechercheEntreprisesAdapter as jest.Mocked<
    typeof RechercheEntreprisesAdapter
>;

describe("RechercheEntreprises", () => {
    // @ts-expect-error http is private attribute
    const mockedHttpGet = jest.spyOn(rechercheEntreprises.http, "get");
    const SIREN = "123456789";
    const NAME = "Example";

    describe("Initialization", () => {
        it("should initialize the URL correctly", () => {
            expect(RechercheEntreprises["URL"]).toBe("https://recherche-entreprises.api.gouv.fr/search");
        });

        it("should initialize the natureJuridique correctly", () => {
            const expectedNatureJuridique = LEGAL_CATEGORIES_ACCEPTED.filter(id => id !== "92").join(",");
            expect(RechercheEntreprises["natureJuridique"]).toBe(expectedNatureJuridique);
        });

        it("should initialize the http service correctly", () => {
            expect(rechercheEntreprises["http"]).toBeInstanceOf(ProviderRequestService);
        });
    });

    describe("search", () => {
        it("should make a GET request to the correct URL with the provided query", async () => {
            const query = "example";
            const expectedUrl = `https://recherche-entreprises.api.gouv.fr/search?q=${query}&nature_juridique=${RechercheEntreprises["natureJuridique"]}`;
            mockedHttpGet.mockResolvedValueOnce({ data: {} } as unknown as RequestResponse<unknown>);
            await rechercheEntreprises.search(query);

            expect(mockedHttpGet).toHaveBeenCalledWith(expectedUrl);
        });

        it("should return an empty array if the API response does not contain results", async () => {
            mockedHttpGet.mockResolvedValueOnce({ data: {} } as unknown as RequestResponse<unknown>);

            const result = await rechercheEntreprises.search("example");

            expect(result).toEqual([]);
        });

        it("should filter out results with missing nom_complet or siren fields", async () => {
            const expected = new AssociationNameEntity(NAME, SIREN);
            const responseData: RechercheEntreprisesDto = {
                results: [
                    { nom_complet: NAME, siren: SIREN },
                    { nom_complet: undefined, siren: "987654321" },
                    { nom_complet: "Example 2", siren: undefined },
                    { nom_complet: undefined, siren: undefined },
                ],
            };
            mockedRechercheEntreprisesAdapter.toAssociationNameEntity.mockReturnValueOnce(expected);
            mockedHttpGet.mockResolvedValueOnce({ data: responseData } as unknown as RequestResponse<unknown>);

            const result = await rechercheEntreprises.search("example");

            expect(result).toEqual([expected]);
        });

        it("should use RechercheEntreprisesAdapter.toAssociationNameEntity to convert results", async () => {
            const responseData = {
                results: [{ nom_complet: NAME, siren: SIREN }],
            };
            mockedHttpGet.mockResolvedValueOnce({ data: responseData } as unknown as RequestResponse<unknown>);

            await rechercheEntreprises.search("example");

            expect(mockedRechercheEntreprisesAdapter.toAssociationNameEntity).toHaveBeenCalledWith(
                responseData.results[0],
            );
        });
    });
});
