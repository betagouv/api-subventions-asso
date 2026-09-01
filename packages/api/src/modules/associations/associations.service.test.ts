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
    const getPaymentsByAssociationMock = jest.spyOn(paymentService, "getPaiements");
    const getDocumentMock = jest.spyOn(documentsService, "getDocuments");
    const getEstablishmentsMock = jest.spyOn(establishmentService, "getEstablishments");

    let formatDataMock: jest.SpyInstance;

    const mockGetSubventions = { execute: jest.fn() } as unknown as GetSubventionsByIdentifier;
    const service = new AssociationsService(mockGetSubventions);

    beforeAll(() => {
        // @ts-expect-error: mock
        formatDataMock = jest.spyOn(FormaterHelper, "formatData").mockImplementation(data => data as unknown);
    });

    afterAll(() => {
        formatDataMock.mockRestore();
    });

    // Could not find a way to restore manual mock (from __mocks__) after being changed in a single test (cf: getAssociationBySiren)

    afterEach(() => (providers.default = DEFAULT_PROVIDERS));

    describe("getDemandes()", () => {
        it("fetches demandes", async () => {
            await service.getDemandes(IDENTIFIER);
            expect(mockGetSubventions.execute).toHaveBeenCalledWith(IDENTIFIER);
        });
    });

    describe("getPaiements()", () => {
        it("should call DemandeSubventionService.getByAssociation()", async () => {
            getPaymentsByAssociationMock.mockImplementationOnce(() => Promise.resolve([{}] as Payment[]));
            await service.getPaiements(IDENTIFIER);
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
