import FormaterHelper from "../../shared/helpers/FormaterHelper";
import associationsService from "./associations.service";
import { Etablissement, Payment, DocumentDto } from "dto";
import subventionService from "../subventions/subventions.service";
import providers from "../providers";
import etablissementService from "../etablissements/etablissements.service";
import paymentService from "../payments/payments.service";
import documentsService from "../documents/documents.service";
import Flux from "../../shared/Flux";
import { SubventionsFlux } from "../subventions/@types/SubventionsFlux";
import { NotFoundError } from "core";
import apiAssoService from "../providers/apiAsso/apiAsso.service";
import rnaSirenService from "../rna-siren/rnaSiren.service";
import uniteLegalEntreprisesService from "../providers/uniteLegalEntreprises/uniteLegal.entreprises.service";
import AssociationIdentifier from "../../valueObjects/AssociationIdentifier";
import Siren from "../../valueObjects/Siren";
import Rna from "../../valueObjects/Rna";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../shared/LegalCategoriesAccepted";

jest.mock("../providers/index");

jest.mock("../providers/apiAsso/apiAsso.service");
jest.mock("../rna-siren/rnaSiren.service");
jest.mock("../providers/uniteLegalEntreprises/uniteLegal.entreprises.service");
jest.mock("../../shared/LegalCategoriesAccepted", () => ({ LEGAL_CATEGORIES_ACCEPTED: "asso" }));

const DEFAULT_PROVIDERS = providers.default;

describe("associationsService", () => {
    const RNA = new Rna("W000000001");
    const SIREN = new Siren("100000001");
    const IDENTIFIER = AssociationIdentifier.fromSirenAndRna(SIREN, RNA);
    const INVALID_IDENTIFIER = {} as unknown as AssociationIdentifier;
    const getDemandesByAssociationMock = jest.spyOn(subventionService, "getDemandes");
    const getPaymentsByAssociationMock = jest.spyOn(paymentService, "getPayments");
    const getDocumentMock = jest.spyOn(documentsService, "getDocuments");
    const getEtablissementsMock = jest.spyOn(etablissementService, "getEtablissements");
    const rnaSirenServiceFindOne = jest.spyOn(rnaSirenService, "find");
    // @ts-expect-error: mock private method
    const aggregateMock: jest.SpyInstance = jest.spyOn(associationsService, "aggregate");

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

    describe("getAssociation()", () => {
        it("should call aggregate", async () => {
            aggregateMock.mockImplementationOnce(async () => [{}]);
            await associationsService.getAssociation(IDENTIFIER);
            expect(aggregateMock).toBeCalledTimes(1);
        });

        it("should throw not found error if aggregates return an empty array", async () => {
            aggregateMock.mockImplementationOnce(() => []);
            const factoryTest = () => associationsService.getAssociation(IDENTIFIER);
            expect(factoryTest).rejects.toThrowError(new NotFoundError("Association not found"));
        });

        it("should call FormaterHelper.formatData()", async () => {
            aggregateMock.mockImplementationOnce(() => [{}]);
            const expected = 1;
            await associationsService.getAssociation(IDENTIFIER);
            expect(formatDataMock).toHaveBeenCalledTimes(expected);
        });
    });

    describe("isAssociationsProvider()", () => {
        it("should return true", () => {
            const actual = associationsService.isAssociationsProvider({
                isAssociationsProvider: true,
            });
            expect(actual).toBeTruthy();
        });
        it("should return false", () => {
            const actual = associationsService.isAssociationsProvider({
                isAssociationsProvider: false,
            });
            expect(actual).toBeFalsy();
        });
    });

    describe("aggregate", () => {
        let getAssociationProvidersMock: jest.SpyInstance;

        beforeAll(() => {
            getAssociationProvidersMock = jest
                // @ts-expect-error: getAssociationProviders is private
                .spyOn(associationsService, "getAssociationProviders")
                // @ts-expect-error: [] is considered as a valid return value
                .mockReturnValue([]);
        });

        it("should call getAssociationProviders", async () => {
            const expected = 1;
            // @ts-expect-error: aggregate is private
            await associationsService.aggregate(IDENTIFIER);
            expect(getAssociationProvidersMock).toHaveBeenCalledTimes(expected);
        });
    });

    describe("getAssociation()", () => {
        it("should call aggregate", async () => {
            aggregateMock.mockImplementationOnce(async () => [{}]);
            await associationsService.getAssociation(IDENTIFIER);
            const actual = aggregateMock.mock.calls.length;
            expect(actual).toEqual(1);
        });
        it("should throw not found error if aggregates return an empty array", async () => {
            aggregateMock.mockImplementationOnce(() => []);
            expect(() => associationsService.getAssociation(IDENTIFIER)).rejects.toThrowError(
                new NotFoundError("Association not found"),
            );
        });
        it("should call FormaterHelper.formatData()", async () => {
            aggregateMock.mockImplementationOnce(() => [{}]);
            const expected = 1;
            await associationsService.getAssociation(IDENTIFIER);
            const actual = formatDataMock.mock.calls.length;
            expect(actual).toEqual(expected);
        });
    });

    describe("getSubventions()", () => {
        it("should call DemandeSubventionService.getByAssociation()", async () => {
            getDemandesByAssociationMock.mockImplementationOnce(() => new Flux<SubventionsFlux>());
            await associationsService.getSubventions(IDENTIFIER);
            expect(getDemandesByAssociationMock).toHaveBeenCalledWith(IDENTIFIER);
        });
    });

    describe("getPayments()", () => {
        it("should call DemandeSubventionService.getByAssociation()", async () => {
            getPaymentsByAssociationMock.mockImplementationOnce(() => Promise.resolve([{}] as Payment[]));
            await associationsService.getPayments(IDENTIFIER);
            expect(getPaymentsByAssociationMock).toHaveBeenCalledWith(IDENTIFIER);
        });
    });

    describe("getDocuments()", () => {
        it("should call documentService.getDocumentMock()", async () => {
            getDocumentMock.mockImplementationOnce(() => Promise.resolve([{}] as DocumentDto[]));
            await associationsService.getDocuments(IDENTIFIER);
            expect(getDocumentMock).toHaveBeenCalledWith(IDENTIFIER);
        });
    });

    describe("getEstablishments()", () => {
        it("should call etablissementService.getEtablissementsMock()", async () => {
            getEtablissementsMock.mockImplementationOnce(() =>
                Promise.resolve([{ etablissement: true } as unknown as Etablissement]),
            );
            await associationsService.getEstablishments(IDENTIFIER);
            expect(getEtablissementsMock).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("should throw NotFoundError", async () => {
            getEtablissementsMock.mockImplementationOnce(() => {
                return Promise.reject(new NotFoundError());
            });
            expect(() => associationsService.getEstablishments(IDENTIFIER)).rejects.toThrowError(NotFoundError);
        });
    });

    describe("isIdentifierFromAsso", () => {
        const IDENTIFIER_WITHOUT_RNA = AssociationIdentifier.fromSiren(SIREN);
        it("should return false when identifier is invalid", async () => {
            const expected = false;
            const actual = await associationsService.isIdentifierFromAsso(INVALID_IDENTIFIER);
            expect(actual).toEqual(expected);
        });

        it("should return true when rna is already here", async () => {
            const actual = await associationsService.isIdentifierFromAsso(AssociationIdentifier.fromRna(RNA));
            expect(actual).toBeTruthy();
        });

        it("should return false when siren is in uniteLegalEntreprises", async () => {
            // @ts-expect-error: mock
            uniteLegalEntreprisesService.isEntreprise.mockResolvedValueOnce(true);
            const actual = await associationsService.isIdentifierFromAsso(IDENTIFIER_WITHOUT_RNA);
            expect(actual).toBeFalsy();
        });

        it("should return true when siren is in rnaSirenService", async () => {
            // @ts-expect-error: mock
            uniteLegalEntreprisesService.isEntreprise.mockResolvedValueOnce(false);
            // @ts-expect-error: mock
            rnaSirenServiceFindOne.mockImplementationOnce(() => ({ rna: RNA, siren: SIREN }));
            const actual = await associationsService.isIdentifierFromAsso(IDENTIFIER_WITHOUT_RNA);
            expect(actual).toBeTruthy();
        });

        it("should return false when api asso return an association without categorie_juridique", async () => {
            // @ts-expect-error: mock
            rnaSirenServiceFindOne.mockImplementationOnce(() => null);
            // @ts-expect-error: mock
            uniteLegalEntreprisesService.isEntreprise.mockResolvedValueOnce(false);
            // @ts-expect-error: mock
            apiAssoService.findAssociationBySiren.mockImplementationOnce(() => ({ categorie_juridique: [] }));
            const actual = await associationsService.isIdentifierFromAsso(IDENTIFIER_WITHOUT_RNA);
            expect(actual).toBeFalsy();
        });

        it("should retrun true when api asso return an association with categorie_juridique in LEGAL_CATEGORIES_ACCEPTED", async () => {
            // @ts-expect-error: mock
            apiAssoService.findAssociationBySiren.mockImplementationOnce(() => ({
                categorie_juridique: [{ value: LEGAL_CATEGORIES_ACCEPTED[0] }],
            }));
            const actual = await associationsService.isIdentifierFromAsso(IDENTIFIER_WITHOUT_RNA);
            expect(actual).toBeTruthy();
        });

        it("should return false when api asso return an association with categorie_juridique not in LEGAL_CATEGORIES_ACCEPTED", async () => {
            // @ts-expect-error: mock
            apiAssoService.findAssociationBySiren.mockImplementationOnce(() => ({
                categorie_juridique: [{ value: "not in LEGAL_CATEGORIES_ACCEPTED" }],
            }));
            const actual = await associationsService.isIdentifierFromAsso(IDENTIFIER_WITHOUT_RNA);
            expect(actual).toBeFalsy();
        });
    });
});
