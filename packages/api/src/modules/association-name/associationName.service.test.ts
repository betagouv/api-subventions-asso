import UniteLegalNameEntity from "../../entities/UniteLegalNameEntity";
import uniteLegalNameService from "../providers/uniteLegalName/uniteLegal.name.service";
import rnaSirenService from "../rna-siren/rnaSiren.service";
import associationNameService from "./associationName.service";
import rechercheEntreprisesPort from "../../dataProviders/api/rechercheEntreprises/rechercheEntreprises.port";
import AssociationNameEntity from "./entities/AssociationNameEntity";

jest.mock("../providers/uniteLegalName/uniteLegal.name.service");
jest.mock("../rna-siren/rnaSiren.service");
jest.mock("../../dataProviders/api/rechercheEntreprises/rechercheEntreprises.port");

const mockedUniteLegalNameService = uniteLegalNameService as jest.Mocked<typeof uniteLegalNameService>;
const mockedRnaSirenService = rnaSirenService as jest.Mocked<typeof rnaSirenService>;
const mockedRechercheEntreprises = rechercheEntreprisesPort as jest.Mocked<typeof rechercheEntreprisesPort>;

describe("associationName.service", () => {
    describe("getNameFromIdentifier()", () => {
        const uniteLegalNameMock = jest.spyOn(uniteLegalNameService, "getNameFromIdentifier");
        const IDENTIFIER = "toto";
        const REPO_OUTPUT = new UniteLegalNameEntity(
            "433955101",
            "ALPCM NANTES BASKET",
            "",
            new Date("2022-07-13T00:00:00.000Z"),
        );

        beforeAll(() => {
            uniteLegalNameMock.mockResolvedValue(REPO_OUTPUT);
        });
        afterAll(() => {
            uniteLegalNameMock.mockRestore();
        });

        it("should call repo", async () => {
            await associationNameService.getNameFromIdentifier(IDENTIFIER);
            expect(uniteLegalNameMock).toBeCalledWith(IDENTIFIER);
        });
    });
    describe("find", () => {
        const SIREN = "123456789";
        const SIREN_2 = "987654321";
        const RNA = "W1234567";
        const RNA_2 = "W9876543";

        it("should return an empty array for unknown identifier", async () => {
            mockedUniteLegalNameService.searchBySirenSiretName.mockResolvedValueOnce([]);
            mockedRechercheEntreprises.search.mockResolvedValueOnce([]);

            const result = await associationNameService.find("unknownIdentifier");
            expect(result).toEqual([]);
        });

        it("should return merged association names for a known SIREN identifier", async () => {
            const fakeAssociation = new AssociationNameEntity("Fake Name", SIREN, RNA, {}, 3);
            mockedUniteLegalNameService.searchBySirenSiretName.mockResolvedValueOnce([fakeAssociation]);
            mockedRnaSirenService.find.mockResolvedValueOnce([{ siren: SIREN, rna: RNA }]);
            mockedRechercheEntreprises.search.mockResolvedValueOnce([]);

            const result = await associationNameService.find(SIREN);
            expect(result).toEqual([fakeAssociation]);
        });

        it("should return merged association names for a known RNA identifier", async () => {
            const fakeAssociation = new AssociationNameEntity("Fake Name", SIREN_2, RNA_2, {}, 2);
            mockedUniteLegalNameService.searchBySirenSiretName.mockResolvedValueOnce([fakeAssociation]);
            mockedRnaSirenService.find.mockResolvedValueOnce([{ siren: SIREN_2, rna: RNA_2 }]);
            mockedRechercheEntreprises.search.mockResolvedValueOnce([]);

            const result = await associationNameService.find(RNA_2);
            expect(result).toEqual([fakeAssociation]);
        });

        it("should handle cases where there are multiple rnaSiren entities for the same identifier", async () => {
            const fakeAssociation1 = new AssociationNameEntity("Fake Name 1", SIREN, RNA, {}, 3);
            const fakeAssociation2 = new AssociationNameEntity("Fake Name 2", SIREN, RNA_2, {}, 2);
            mockedUniteLegalNameService.searchBySirenSiretName.mockResolvedValueOnce([
                fakeAssociation1,
                fakeAssociation2,
            ]);
            mockedRnaSirenService.find.mockResolvedValueOnce([
                { siren: SIREN, rna: RNA },
                { siren: SIREN, rna: RNA_2 },
            ]);
            mockedRechercheEntreprises.search.mockResolvedValueOnce([]);

            const result = await associationNameService.find(SIREN);
            const expected = [
                new AssociationNameEntity("Fake Name 1", SIREN, RNA, {}, 3),
                new AssociationNameEntity("Fake Name 2", SIREN, RNA_2, {}, 2),
            ];
            expect(result).toEqual(expected);
        });

        it("should handle cases where the identifier type is neither SIREN nor RNA", async () => {
            const fakeAssociation = new AssociationNameEntity("Fake Name", SIREN_2, RNA_2, {}, 2);
            mockedUniteLegalNameService.searchBySirenSiretName.mockResolvedValueOnce([fakeAssociation]);
            mockedRnaSirenService.find.mockResolvedValueOnce([]);
            mockedRechercheEntreprises.search.mockResolvedValueOnce([fakeAssociation]);

            const result = await associationNameService.find("unknownIdentifier");
            expect(result).toEqual([fakeAssociation]);
        });
    });
});
