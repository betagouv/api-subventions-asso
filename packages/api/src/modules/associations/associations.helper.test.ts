import FormaterHelper from "../../shared/helpers/FormaterHelper";
import associationHelper from "./associations.helper";
import providers from "../providers";
import apiAssoService from "../providers/apiAsso/apiAsso.service";
import uniteLegalEntreprisesService from "../providers/uniteLegalEntreprises/uniteLegal.entreprises.service";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../shared/LegalCategoriesAccepted";
import sireneStockUniteLegaleService from "../providers/sirene/stockUniteLegale/sireneStockUniteLegale.service";
import rnaSirenService from "../rna-siren/rna-siren.service";
import Rna from "../../identifierObjects/Rna";
import Siren from "../../identifierObjects/Siren";
import AssociationIdentifier from "../../identifierObjects/AssociationIdentifier";

jest.mock("../providers/index");

jest.mock("../providers/apiAsso/apiAsso.service");
jest.mock("../providers/uniteLegalEntreprises/uniteLegal.entreprises.service");
jest.mock("../../shared/LegalCategoriesAccepted", () => ({ LEGAL_CATEGORIES_ACCEPTED: "asso" }));
jest.mock("../providers/sirene/stockUniteLegale/sireneStockUniteLegale.service");

const DEFAULT_PROVIDERS = providers.default;

describe("associationHelper", () => {
    const RNA = new Rna("W000000001");
    const SIREN = new Siren("100000001");
    const INVALID_IDENTIFIER = {} as unknown as AssociationIdentifier;
    const rnaSirenServiceFindOne = jest.spyOn(rnaSirenService, "find");

    let formatDataMock: jest.SpyInstance;
    beforeAll(() => {
        // @ts-expect-error: mock
        formatDataMock = jest.spyOn(FormaterHelper, "formatData").mockImplementation(data => data as unknown);
    });

    afterAll(() => {
        formatDataMock.mockRestore();
    });

    // Could not find a way to restore manual mock (from __mocks__) after being changed in a single test (cf: getAssociationBySiren)

    afterEach(() => (providers.default = DEFAULT_PROVIDERS));

    describe("isIdentifierFromAsso", () => {
        const IDENTIFIER_WITHOUT_RNA = AssociationIdentifier.fromSiren(SIREN);
        it("should return false when identifier is invalid", async () => {
            const expected = false;
            const actual = await associationHelper.isIdentifierFromAsso(INVALID_IDENTIFIER);
            expect(actual).toEqual(expected);
        });

        it("should return true when rna is already here", async () => {
            const actual = await associationHelper.isIdentifierFromAsso(AssociationIdentifier.fromRna(RNA));
            expect(actual).toBeTruthy();
        });

        it("should return true when siren is in sireneStockUniteLegale", async () => {
            // @ts-expect-error: mock
            jest.mocked(sireneStockUniteLegaleService.findOneBySiren).mockResolvedValueOnce(true);
            const actual = await associationHelper.isIdentifierFromAsso(IDENTIFIER_WITHOUT_RNA);
            expect(actual).toBeTruthy();
        });

        it("should return false when siren is in uniteLegalEntreprises", async () => {
            // @ts-expect-error: mock
            jest.mocked(sireneStockUniteLegaleService.findOneBySiren).mockResolvedValueOnce(false);
            // @ts-expect-error: mock
            uniteLegalEntreprisesService.isEntreprise.mockResolvedValueOnce(true);
            const actual = await associationHelper.isIdentifierFromAsso(IDENTIFIER_WITHOUT_RNA);
            expect(actual).toBeFalsy();
        });

        it("should return false when api asso return an association without categorie_juridique", async () => {
            // @ts-expect-error: mock
            rnaSirenServiceFindOne.mockImplementationOnce(() => null);
            // @ts-expect-error: mock
            uniteLegalEntreprisesService.isEntreprise.mockResolvedValueOnce(false);
            // @ts-expect-error: mock
            apiAssoService.findAssociationBySiren.mockImplementationOnce(() => ({ categorie_juridique: [] }));
            const actual = await associationHelper.isIdentifierFromAsso(IDENTIFIER_WITHOUT_RNA);
            expect(actual).toBeFalsy();
        });

        it("should retrun true when api asso return an association with categorie_juridique in LEGAL_CATEGORIES_ACCEPTED", async () => {
            // @ts-expect-error: mock
            apiAssoService.findAssociationBySiren.mockImplementationOnce(() => ({
                categorie_juridique: [{ value: LEGAL_CATEGORIES_ACCEPTED[0] }],
            }));
            const actual = await associationHelper.isIdentifierFromAsso(IDENTIFIER_WITHOUT_RNA);
            expect(actual).toBeTruthy();
        });

        it("should return false when api asso return an association with categorie_juridique not in LEGAL_CATEGORIES_ACCEPTED", async () => {
            // @ts-expect-error: mock
            apiAssoService.findAssociationBySiren.mockImplementationOnce(() => ({
                categorie_juridique: [{ value: "not in LEGAL_CATEGORIES_ACCEPTED" }],
            }));
            const actual = await associationHelper.isIdentifierFromAsso(IDENTIFIER_WITHOUT_RNA);
            expect(actual).toBeFalsy();
        });
    });
});
