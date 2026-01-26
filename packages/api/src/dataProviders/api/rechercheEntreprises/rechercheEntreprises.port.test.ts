import rechercheEntreprisesPort, { RechercheEntreprisesPort } from "./rechercheEntreprises.port";
import { ProviderRequestService } from "../../../modules/provider-request/providerRequest.service";
import Siren from "../../../identifierObjects/Siren";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../../shared/LegalCategoriesAccepted";
import { AxiosResponse } from "axios";

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
        beforeAll(() => {
            mockedHttpGet.mockResolvedValue({ data: API_RESPONSE } as AxiosResponse);
        });
        const API_RESPONSE = { results: [{ nom_complet: NAME, siren: SIREN.value }] };
        it("should make a GET request to the correct URL with the provided query", async () => {
            const query = "example";
            const expectedUrl = `https://recherche-entreprises.api.gouv.fr/search?q=${query}&nature_juridique=${LEGAL_CATEGORIES_ACCEPTED.join(",")}&per_page=25&page=1`;
            await rechercheEntreprisesPort.search(query);

            expect(mockedHttpGet).toHaveBeenCalledWith(expectedUrl);
        });

        it("should return API response", async () => {
            const expected = API_RESPONSE;
            const actual = await rechercheEntreprisesPort.search("example");
            expect(actual).toEqual(expected);
        });
    });
});
