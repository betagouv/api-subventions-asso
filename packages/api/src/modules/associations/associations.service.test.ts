import FormaterHelper from "../../shared/helpers/FormaterHelper";
import associationsService from "./associations.service";
import { Etablissement, Payment, DocumentDto, DemandeSubvention } from "dto";
import subventionService from "../subventions/subventions.service";
import providers from "../providers";
import etablissementService from "../etablissements/etablissements.service";
import paymentService from "../payments/payments.service";
import documentsService from "../documents/documents.service";
import { NotFoundError } from "core";
import AssociationIdentifier from "../../identifierObjects/AssociationIdentifier";
import Siren from "../../identifierObjects/Siren";
import Rna from "../../identifierObjects/Rna";

jest.mock("../providers/index");

const DEFAULT_PROVIDERS = providers.default;

describe("associationsService", () => {
    const RNA = new Rna("W000000001");
    const SIREN = new Siren("100000001");
    const IDENTIFIER = AssociationIdentifier.fromSirenAndRna(SIREN, RNA);
    const getDemandesByAssociationMock = jest.spyOn(subventionService, "getDemandes");
    const getPaymentsByAssociationMock = jest.spyOn(paymentService, "getPayments");
    const getDocumentMock = jest.spyOn(documentsService, "getDocuments");
    const getEtablissementsMock = jest.spyOn(etablissementService, "getEtablissements");
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
            // @ts-expect-error: mock resolved value
            getDemandesByAssociationMock.mockResolvedValueOnce([{} as DemandeSubvention]);
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
});
