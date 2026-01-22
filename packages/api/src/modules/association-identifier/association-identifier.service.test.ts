import { RNA_STR, SIREN_STR } from "../../../tests/__fixtures__/association.fixture";
import Rna from "../../identifierObjects/Rna";
import associationIdentifierService from "./association-identifier.service";
import rnaSirenService from "../rna-siren/rna-siren.service";
import AssociationIdentifier from "../../identifierObjects/AssociationIdentifier";
import Siren from "../../identifierObjects/Siren";
import rechercheEntreprisesService from "../../dataProviders/api/rechercheEntreprises/rechercheEntreprises.service";
import { ASSOCIATION_NAME } from "../association-name/__fixtures__/AssociationName";

jest.mock("../rna-siren/rna-siren.service");
jest.mock("../../dataProviders/api/rechercheEntreprises/rechercheEntreprises.service");

describe("AssociationIdentifierService", () => {
    const SIREN = new Siren(SIREN_STR);
    const RNA = new Rna(RNA_STR);
    const ASSOCIATIONS_IDENTIFIERS = [AssociationIdentifier.fromSirenAndRna(SIREN, RNA)];

    describe("findFromRechercheEntreprises", () => {
        beforeEach(() => {
            jest.mocked(rechercheEntreprisesService.getSearchResult).mockResolvedValue([ASSOCIATION_NAME]);
        });

        it("search for identifiers from Recherche Entreprise API", async () => {
            await associationIdentifierService.findFromRechercheEntreprises(RNA);
            expect(rechercheEntreprisesService.getSearchResult).toHaveBeenCalledWith(RNA.value);
        });

        it("returns an array containing a partial AssociationIdentifier when nothing is returned from the API", async () => {
            jest.mocked(rechercheEntreprisesService.getSearchResult).mockResolvedValueOnce([]);
            const expected = [AssociationIdentifier.fromRna(RNA)];
            const actual = await associationIdentifierService.findFromRechercheEntreprises(RNA);
            expect(actual).toEqual(expected);
        });

        it.each`
            identifier | identifierName
            ${RNA}     | ${"RNA"}
            ${SIREN}   | ${"SIREN"}
        `(
            `returns an array of complete AssociationIdentifier when searching from a $identifierName`,
            async ({ identifier }) => {
                const expected = [AssociationIdentifier.fromSirenAndRna(SIREN, RNA)];
                const actual = await associationIdentifierService.findFromRechercheEntreprises(identifier);
                expect(actual).toEqual(expected);
            },
        );
    });

    describe("getAssociationIdentifiers", () => {
        let mockIdentifierStringToEntity: jest.SpyInstance;
        let mockFindFromRechercheEntreprise: jest.SpyInstance;

        beforeEach(() => {
            mockIdentifierStringToEntity = jest
                .spyOn(associationIdentifierService, "identifierStringToEntity")
                .mockReturnValue(RNA);
            mockFindFromRechercheEntreprise = jest
                .spyOn(associationIdentifierService, "findFromRechercheEntreprises")
                .mockResolvedValue(ASSOCIATIONS_IDENTIFIERS);
            jest.mocked(rnaSirenService.find).mockResolvedValue(null);
        });

        afterAll(() => {
            [mockFindFromRechercheEntreprise, mockIdentifierStringToEntity].forEach(mock => mock.mockRestore());
        });

        it("try to find matches from API RechercheEntreprise", async () => {
            await associationIdentifierService.getAssociationIdentifiers(RNA_STR);
            expect(mockFindFromRechercheEntreprise).toHaveBeenLastCalledWith(RNA);
        });

        it("persists match in rna-siren collection", async () => {
            await associationIdentifierService.getAssociationIdentifiers(RNA_STR);
            expect(rnaSirenService.insertManyAssociationIdentifer).toHaveBeenLastCalledWith(ASSOCIATIONS_IDENTIFIERS);
        });

        it("returns API RechercheEntreprise matches", async () => {
            const expected = ASSOCIATIONS_IDENTIFIERS;
            const actual = await associationIdentifierService.getAssociationIdentifiers(RNA_STR);
            expect(actual).toEqual(expected);
        });
    });
});
