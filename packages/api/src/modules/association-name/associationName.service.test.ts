import AssociationSearchService from "../providers/association-search/association-search.service";
import rnaSirenService from "../rna-siren/rna-siren.service";
import associationNameService from "./associationName.service";
import rechercheEntreprisesService from "../../adapters/outputs/api/recherche-entreprises/recherche-entreprises.service";
import AssociationSearchEntity from "../../entities/AssociationSearchEntity";
import Siren from "../../identifier-objects/Siren";
import Rna from "../../identifier-objects/Rna";

jest.mock("../providers/association-search/association-search.service");
jest.mock("../rna-siren/rna-siren.service");
jest.mock("../../adapters/outputs/api/recherche-entreprises/recherche-entreprises.service");

const mockedUniteLegaleNameService = AssociationSearchService as jest.Mocked<typeof AssociationSearchService>;
const mockedRnaSirenService = rnaSirenService as jest.Mocked<typeof rnaSirenService>;
const mockedRechercheEntreprises = rechercheEntreprisesService as jest.Mocked<typeof rechercheEntreprisesService>;

describe("associationName.service", () => {
    describe("find", () => {
        const SIREN = new Siren("123456789");
        const SIREN_2 = new Siren("987654321");
        const RNA = new Rna("W123456789");
        const RNA_2 = new Rna("W987654321");

        it("should return an empty array for unknown identifier", async () => {
            mockedUniteLegaleNameService.searchBySirenSiretName.mockResolvedValueOnce([]);
            mockedRechercheEntreprises.getSearchResult.mockResolvedValueOnce([]);

            const result = await associationNameService.find("unknownIdentifier");
            expect(result).toEqual([]);
        });

        it("should return merged association names for a known SIREN identifier", async () => {
            const fakeAssociation = new AssociationSearchEntity({
                name: "Fake Name",
                siren: SIREN.value,
                mainEstablishmentSiret: SIREN.value + "00018",
                rna: RNA.value,
                nbEstabs: 3,
            });
            mockedUniteLegaleNameService.searchBySirenSiretName.mockResolvedValueOnce([fakeAssociation]);
            mockedRnaSirenService.find.mockResolvedValueOnce([{ siren: SIREN, rna: RNA }]);
            mockedRechercheEntreprises.getSearchResult.mockResolvedValueOnce([]);

            const result = await associationNameService.find(SIREN.value);
            expect(result).toEqual([fakeAssociation]);
        });

        it("should return merged association names for a known RNA identifier", async () => {
            const fakeAssociation = new AssociationSearchEntity({
                name: "Fake Name",
                siren: SIREN_2.value,
                mainEstablishmentSiret: SIREN_2.value + "00018",
                rna: RNA_2.value,
                nbEstabs: 2,
            });
            mockedUniteLegaleNameService.searchBySirenSiretName.mockResolvedValueOnce([fakeAssociation]);
            mockedRnaSirenService.find.mockResolvedValueOnce([{ siren: SIREN_2, rna: RNA_2 }]);
            mockedRechercheEntreprises.getSearchResult.mockResolvedValueOnce([]);

            const result = await associationNameService.find(RNA_2.value);
            expect(result).toEqual([fakeAssociation]);
        });

        it("should handle cases where there are multiple rnaSiren entities for the same identifier", async () => {
            const fakeAssociation1 = new AssociationSearchEntity({
                name: "Fake Name 1",
                siren: SIREN.value,
                mainEstablishmentSiret: SIREN.value + "00018",
                rna: RNA.value,
                nbEstabs: 3,
            });
            const fakeAssociation2 = new AssociationSearchEntity({
                name: "Fake Name 2",
                siren: SIREN.value,
                mainEstablishmentSiret: SIREN.value + "00018",
                rna: RNA_2.value,
                nbEstabs: 2,
            });
            mockedUniteLegaleNameService.searchBySirenSiretName.mockResolvedValue([fakeAssociation1, fakeAssociation2]);
            mockedRnaSirenService.find.mockResolvedValueOnce([
                { siren: SIREN, rna: RNA },
                { siren: SIREN, rna: RNA_2 },
            ]);
            mockedRechercheEntreprises.getSearchResult.mockResolvedValue([]);

            const result = await associationNameService.find(SIREN.value);
            const expected = [
                new AssociationSearchEntity({
                    name: "Fake Name 1",
                    siren: SIREN.value,
                    mainEstablishmentSiret: SIREN.value + "00018",
                    rna: RNA.value,
                    nbEstabs: 3,
                }),
                new AssociationSearchEntity({
                    name: "Fake Name 2",
                    siren: SIREN.value,
                    mainEstablishmentSiret: SIREN.value + "00018",
                    rna: RNA_2.value,
                    nbEstabs: 2,
                }),
            ];
            expect(result).toEqual(expected);
        });

        it("should handle cases where the identifier type is neither SIREN nor RNA", async () => {
            const fakeAssociation = new AssociationSearchEntity({
                name: "Fake Name",
                siren: SIREN_2.value,
                mainEstablishmentSiret: SIREN_2.value + "00018",
                rna: RNA_2.value,
                nbEstabs: 2,
            });
            mockedUniteLegaleNameService.searchBySirenSiretName.mockResolvedValueOnce([fakeAssociation]);
            mockedRnaSirenService.find.mockResolvedValueOnce([]);
            mockedRechercheEntreprises.getSearchResult.mockResolvedValueOnce([fakeAssociation]);

            const result = await associationNameService.find("unknownIdentifier");
            expect(result).toEqual([fakeAssociation]);
        });
    });
});
