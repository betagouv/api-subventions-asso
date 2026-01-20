import rechercheEntreprisesPort, { RechercheEntreprisesPort } from "./rechercheEntreprises.port";
import { ProviderRequestService } from "../../../modules/provider-request/providerRequest.service";
import { RechercheEntreprisesDto } from "./RechercheEntreprisesDto";
import { RequestResponse } from "../../../modules/provider-request/@types/RequestResponse";
import Siren from "../../../identifierObjects/Siren";

describe("RechercheEntreprisesPort", () => {
    // @ts-expect-error http is private attribute
    const mockedHttpGet = jest.spyOn(rechercheEntreprisesPort.http, "get");
    const SIREN = new Siren("123456789");
    const NAME = "Example";

    describe("Initialization", () => {
        it("should initialize the URL correctly", () => {
            expect(RechercheEntreprisesPort["URL"]).toBe("https://recherche-entreprises.api.gouv.fr/search");
        });

        it("should initialize the http service correctly", () => {
            expect(rechercheEntreprisesPort["http"]).toBeInstanceOf(ProviderRequestService);
        });
    });

    describe("search", () => {
        it("should make a GET request to the correct URL with the provided query", async () => {
            const query = "example";
            const expectedUrl = `https://recherche-entreprises.api.gouv.fr/search?q=${query}&nature_juridique=${RechercheEntreprisesPort["natureJuridique"]}&per_page=25&page=1`;
            mockedHttpGet.mockResolvedValueOnce({ data: {} } as unknown as RequestResponse<unknown>);
            await rechercheEntreprisesPort.search(query);

            expect(mockedHttpGet).toHaveBeenCalledWith(expectedUrl);
        });

        it("should return an empty array if the API response does not contain results", async () => {
            mockedHttpGet.mockResolvedValueOnce({ data: {} } as unknown as RequestResponse<unknown>);

            const result = await rechercheEntreprisesPort.search("example");

            expect(result).toEqual([]);
        });

        it("should call next pages", async () => {
            const responseDataFirst: RechercheEntreprisesDto = {
                page: 1,
                per_page: 4,
                total_pages: 2,
                total_results: 6,
                results: [
                    { nom_complet: NAME, siren: SIREN.value },
                    { nom_complet: undefined, siren: "987654321" },
                    { nom_complet: "Example 2", siren: undefined },
                    { nom_complet: undefined, siren: undefined },
                ],
            };
            const responseDataSecond: RechercheEntreprisesDto = {
                page: 2,
                per_page: 4,
                total_pages: 2,
                total_results: 6,
                results: [{ nom_complet: NAME + "2", siren: SIREN + "2" }],
            };
            mockedHttpGet.mockResolvedValueOnce({ data: responseDataFirst } as unknown as RequestResponse<unknown>);
            mockedHttpGet.mockResolvedValueOnce({ data: responseDataSecond } as unknown as RequestResponse<unknown>);
            // @ts-expect-error -- spy private
            const searchSpy = jest.spyOn(rechercheEntreprisesPort, "getSearchResult");

            await rechercheEntreprisesPort.search("example");

            expect(searchSpy).toHaveBeenCalledTimes(2);
        });

        it("calls at most 3 pages", async () => {
            const responseDataFirst: RechercheEntreprisesDto = {
                page: 1,
                per_page: 4,
                total_pages: 5,
                total_results: 20,
                results: [
                    { nom_complet: NAME, siren: SIREN.value },
                    { nom_complet: undefined, siren: "987654321" },
                    { nom_complet: "Example 2", siren: undefined },
                    { nom_complet: undefined, siren: undefined },
                ],
            };
            mockedHttpGet.mockResolvedValue({ data: responseDataFirst } as unknown as RequestResponse<unknown>);
            await rechercheEntreprisesPort.search("example");

            expect(mockedHttpGet).toHaveBeenCalledTimes(3);
            mockedHttpGet.mockReset();
        });
    });
});
