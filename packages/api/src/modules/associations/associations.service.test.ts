import FormaterHelper from "../../shared/helpers/FormaterHelper";
import { AssociationsService } from "./associations.service";
import { Payment, DocumentWithProviderValueDto, EstablishmentSimplifiedWithProviderValues } from "dto";
import providers from "../providers";
import establishmentService from "../establishments/establishment.service";
import paymentService from "../payments/payments.service";
import documentsService from "../documents/documents.service";
import { NotFoundError } from "core";
import AssociationIdentifier from "../../identifier-objects/AssociationIdentifier";
import Siren from "../../identifier-objects/Siren";
import Rna from "../../identifier-objects/Rna";
import { GetSubventionsByIdentifier } from "../application-flat/use-cases/get-subventions-by-identifier";

jest.mock("../providers/index");

const DEFAULT_PROVIDERS = providers.default;

describe("associationsService", () => {
    const RNA = new Rna("W000000001");
    const SIREN = new Siren("100000001");
    const IDENTIFIER = AssociationIdentifier.fromSirenAndRna(SIREN, RNA);
    const getPaymentsByAssociationMock = jest.spyOn(paymentService, "getPayments");
    const getDocumentMock = jest.spyOn(documentsService, "getDocuments");
    const getEstablishmentsMock = jest.spyOn(establishmentService, "getEstablishments");

    let formatDataMock: jest.SpyInstance;

    const mockGetSubventions = { execute: jest.fn() } as unknown as GetSubventionsByIdentifier;
    const service = new AssociationsService(mockGetSubventions);
    // @ts-expect-error: mock private method
    const aggregateMock: jest.SpyInstance = jest.spyOn(service, "aggregate");

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
            await service.getAssociation(IDENTIFIER);
            expect(aggregateMock).toHaveBeenCalledTimes(1);
        });

        it("should throw not found error if aggregates return an empty array", async () => {
            aggregateMock.mockImplementationOnce(() => []);
            const factoryTest = () => service.getAssociation(IDENTIFIER);
            expect(factoryTest).rejects.toThrow(new NotFoundError("Association not found"));
        });

        it("should call FormaterHelper.formatData()", async () => {
            aggregateMock.mockImplementationOnce(() => [{}]);
            const expected = 1;
            await service.getAssociation(IDENTIFIER);
            expect(formatDataMock).toHaveBeenCalledTimes(expected);
        });
    });

    describe("isAssociationsProvider()", () => {
        it("should return true", () => {
            const actual = service.isAssociationsProvider({
                isAssociationsProvider: true,
            });
            expect(actual).toBeTruthy();
        });
        it("should return false", () => {
            const actual = service.isAssociationsProvider({
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
                .spyOn(service, "getAssociationProviders")
                // @ts-expect-error: [] is considered as a valid return value
                .mockReturnValue([]);
        });

        it("should call getAssociationProviders", async () => {
            const expected = 1;
            // @ts-expect-error: aggregate is private
            await service.aggregate(IDENTIFIER);
            expect(getAssociationProvidersMock).toHaveBeenCalledTimes(expected);
        });
    });

    describe("getDemandes()", () => {
        it("fetches demandes", async () => {
            await service.getDemandes(IDENTIFIER);
            expect(mockGetSubventions.execute).toHaveBeenCalledWith(IDENTIFIER);
        });
    });

    describe("getPayments()", () => {
        it("should call DemandeSubventionService.getByAssociation()", async () => {
            getPaymentsByAssociationMock.mockImplementationOnce(() => Promise.resolve([{}] as Payment[]));
            await service.getPayments(IDENTIFIER);
            expect(getPaymentsByAssociationMock).toHaveBeenCalledWith(IDENTIFIER);
        });
    });

    describe("getDocuments()", () => {
        it("should call documentService.getDocumentMock()", async () => {
            getDocumentMock.mockImplementationOnce(() => Promise.resolve([{}] as DocumentWithProviderValueDto[]));
            await service.getDocuments(IDENTIFIER);
            expect(getDocumentMock).toHaveBeenCalledWith(IDENTIFIER);
        });
    });

    describe("getEstablishments()", () => {
        it("should call establishmentService.getEstablishmentsMock()", async () => {
            getEstablishmentsMock.mockImplementationOnce(() =>
                Promise.resolve([{ establishment: true } as unknown as EstablishmentSimplifiedWithProviderValues]),
            );
            await service.getEstablishments(IDENTIFIER);
            expect(getEstablishmentsMock).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("should throw NotFoundError", async () => {
            getEstablishmentsMock.mockImplementationOnce(() => {
                return Promise.reject(new NotFoundError());
            });
            expect(() => service.getEstablishments(IDENTIFIER)).rejects.toThrow(NotFoundError);
        });
    });
});
