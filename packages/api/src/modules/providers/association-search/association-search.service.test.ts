import associationSearchAdapter from "../../../adapters/outputs/db/association-search/association-search.adapter";
import rnaSirenService from "../../rna-siren/rna-siren.service";
import AssociationSearchEntity from "../../../entities/AssociationSearchEntity";
import AssociationSearchService from "./association-search.service";
import AssociationNameEntity from "../../association-name/entities/AssociationNameEntity";
import Siren from "../../../identifier-objects/Siren";
import Rna from "../../../identifier-objects/Rna";
import Siret from "../../../identifier-objects/Siret";

jest.mock("../../../adapters/outputs/db/association-search/association-search.adapter");
jest.mock("../../rna-siren/rna-siren.service");
jest.mock("../../../shared/Validators");

const mockedAssociationSearch = associationSearchAdapter as jest.Mocked<typeof associationSearchAdapter>;
const mockedRnaSirenService = rnaSirenService as jest.Mocked<typeof rnaSirenService>;

describe("AssociationSearchService", () => {
    const SIREN = new Siren("123456789");
    const RNA = new Rna("W123456789");
    const fakeAssociationSearchEntity = new AssociationSearchEntity({ siren: SIREN, rna: null, name: "Fake Name" });

    let fromPartialSiretStrMock: jest.SpyInstance;

    beforeAll(() => {
        fromPartialSiretStrMock = jest.spyOn(Siren, "fromPartialSiretStr");
    });

    describe("searchBySirenSiretName", () => {
        let isStartOfSiretMock: jest.SpyInstance;

        beforeAll(() => {
            isStartOfSiretMock = jest.spyOn(Siret, "isStartOfSiret");
        });

        it("should return empty array for unknown identifier", async () => {
            mockedAssociationSearch.search.mockResolvedValueOnce([]);
            const result = await AssociationSearchService.searchBySirenSiretName("unknownIdentifier");
            expect(result).toEqual([]);
        });

        it("should return matched associations", async () => {
            mockedAssociationSearch.search.mockResolvedValueOnce([fakeAssociationSearchEntity]);
            const expected = new AssociationNameEntity(fakeAssociationSearchEntity.name, SIREN);
            const result = await AssociationSearchService.searchBySirenSiretName("knownIdentifier");
            expect(result).toEqual([expected]);
        });

        it("should handle cases where there are multiple rnaSiren entities for the same siren", async () => {
            const expected = [
                new AssociationNameEntity(fakeAssociationSearchEntity.name, SIREN, RNA),
                new AssociationNameEntity(fakeAssociationSearchEntity.name, SIREN, new Rna("W987654321")),
            ];

            mockedAssociationSearch.search.mockResolvedValueOnce([fakeAssociationSearchEntity]);

            // Mocking multiple rnaSiren entities for the same siren
            mockedRnaSirenService.find.mockResolvedValueOnce([
                { siren: SIREN, rna: RNA },
                { siren: SIREN, rna: new Rna("W987654321") },
            ]);

            const result = await AssociationSearchService.searchBySirenSiretName("knownIdentifier");
            // Ensure that each rna entity is adapted separately
            expect(result).toEqual(expected);
        });

        it("should handle cases where the value is a start of siret", async () => {
            mockedAssociationSearch.search.mockResolvedValueOnce([fakeAssociationSearchEntity]);
            isStartOfSiretMock.mockReturnValue(true);
            const expected = new AssociationNameEntity(fakeAssociationSearchEntity.name, SIREN);

            const result = await AssociationSearchService.searchBySirenSiretName(SIREN.value);
            expect(result).toEqual([expected]);
            expect(isStartOfSiretMock).toHaveBeenCalledWith(SIREN.value);
            expect(fromPartialSiretStrMock).toHaveBeenCalledWith(SIREN.value);
        });
    });
});
