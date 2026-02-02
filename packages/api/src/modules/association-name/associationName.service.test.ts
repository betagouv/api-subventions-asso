import UniteLegalNameEntity from "../../entities/UniteLegalNameEntity";
import uniteLegalNameService from "../providers/uniteLegalName/uniteLegal.name.service";
import rnaSirenService from "../rna-siren/rna-siren.service";
import associationNameService from "./associationName.service";
import rechercheEntreprisesService from "../../dataProviders/api/rechercheEntreprises/rechercheEntreprises.service";
import AssociationNameEntity from "./entities/AssociationNameEntity";
import Siren from "../../identifierObjects/Siren";
import Rna from "../../identifierObjects/Rna";
import AssociationIdentifier from "../../identifierObjects/AssociationIdentifier";

jest.mock("../providers/uniteLegalName/uniteLegal.name.service");
jest.mock("../rna-siren/rna-siren.service");
jest.mock("../../dataProviders/api/rechercheEntreprises/rechercheEntreprises.service");

const mockedUniteLegalNameService = uniteLegalNameService as jest.Mocked<typeof uniteLegalNameService>;
const mockedRnaSirenService = rnaSirenService as jest.Mocked<typeof rnaSirenService>;
const mockedRechercheEntreprises = rechercheEntreprisesService as jest.Mocked<typeof rechercheEntreprisesService>;

describe("associationName.service", () => {
    describe("getNameFromIdentifier()", () => {
        const uniteLegalNameMock = jest.spyOn(uniteLegalNameService, "getNameFromIdentifier");
        const SIREN = new Siren("433955101");
        const IDENTIFIER = AssociationIdentifier.fromSiren(SIREN);
        const PORT_OUTPUT = new UniteLegalNameEntity(
            SIREN,
            "ALPCM NANTES BASKET",
            "",
            new Date("2022-07-13T00:00:00.000Z"),
        );

        beforeAll(() => {
            uniteLegalNameMock.mockResolvedValue(PORT_OUTPUT);
        });
        afterAll(() => {
            uniteLegalNameMock.mockRestore();
        });

        it("should call port", async () => {
            await associationNameService.getNameFromIdentifier(IDENTIFIER);
            expect(uniteLegalNameMock).toBeCalledWith(IDENTIFIER);
        });
    });
    describe("find", () => {
        const SIREN = new Siren("123456789");
        const SIREN_2 = new Siren("987654321");
        const RNA = new Rna("W123456789");
        const RNA_2 = new Rna("W987654321");

        it("should return an empty array for unknown identifier", async () => {
            mockedUniteLegalNameService.searchBySirenSiretName.mockResolvedValueOnce([]);
            mockedRechercheEntreprises.getSearchResult.mockResolvedValueOnce([]);

            const result = await associationNameService.find("unknownIdentifier");
            expect(result).toEqual([]);
        });

        it("should return merged association names for a known SIREN identifier", async () => {
            const fakeAssociation = new AssociationNameEntity("Fake Name", SIREN, RNA, {}, 3);
            mockedUniteLegalNameService.searchBySirenSiretName.mockResolvedValueOnce([fakeAssociation]);
            mockedRnaSirenService.find.mockResolvedValueOnce([{ siren: SIREN, rna: RNA }]);
            mockedRechercheEntreprises.getSearchResult.mockResolvedValueOnce([]);

            const result = await associationNameService.find(SIREN.value);
            expect(result).toEqual([fakeAssociation]);
        });

        it("should return merged association names for a known RNA identifier", async () => {
            const fakeAssociation = new AssociationNameEntity("Fake Name", SIREN_2, RNA_2, {}, 2);
            mockedUniteLegalNameService.searchBySirenSiretName.mockResolvedValueOnce([fakeAssociation]);
            mockedRnaSirenService.find.mockResolvedValueOnce([{ siren: SIREN_2, rna: RNA_2 }]);
            mockedRechercheEntreprises.getSearchResult.mockResolvedValueOnce([]);

            const result = await associationNameService.find(RNA_2.value);
            expect(result).toEqual([fakeAssociation]);
        });

        it("should handle cases where there are multiple rnaSiren entities for the same identifier", async () => {
            const fakeAssociation1 = new AssociationNameEntity("Fake Name 1", SIREN, RNA, {}, 3);
            const fakeAssociation2 = new AssociationNameEntity("Fake Name 2", SIREN, RNA_2, {}, 2);
            mockedUniteLegalNameService.searchBySirenSiretName.mockResolvedValue([fakeAssociation1, fakeAssociation2]);
            mockedRnaSirenService.find.mockResolvedValueOnce([
                { siren: SIREN, rna: RNA },
                { siren: SIREN, rna: RNA_2 },
            ]);
            mockedRechercheEntreprises.getSearchResult.mockResolvedValue([]);

            const result = await associationNameService.find(SIREN.value);
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
            mockedRechercheEntreprises.getSearchResult.mockResolvedValueOnce([fakeAssociation]);

            const result = await associationNameService.find("unknownIdentifier");
            expect(result).toEqual([fakeAssociation]);
        });
    });
});
