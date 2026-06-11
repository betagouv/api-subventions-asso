import FormaterHelper from "../../shared/helpers/FormaterHelper";
import documentsService from "../documents/documents.service";
import paymentService from "../payments/payments.service";
import { EstablishmentService } from "./establishment.service";
import { NotFoundError } from "core";
import grantService from "../grant/grant.service";
import Siren from "../../identifier-objects/Siren";
import Siret from "../../identifier-objects/Siret";
import EstablishmentIdentifier from "../../identifier-objects/EstablishmentIdentifier";
import AssociationIdentifier from "../../identifier-objects/AssociationIdentifier";
import { DemandeSubvention } from "dto";
import { GetSubventionsByIdentifier } from "../application-flat/use-cases/get-subventions-by-identifier";
jest.mock("../grant/grant.service");

type asyncPrivateMock<T> = jest.SpyInstance<Promise<T>>;

const SIREN = new Siren("000000000");
const SIRET = new Siret("00000000000001");
const ASSOCIATION_ID = AssociationIdentifier.fromSiren(SIREN);
const ESTABLISHMENT_ID = EstablishmentIdentifier.fromSiret(SIRET, ASSOCIATION_ID);

describe("EstablishmentService", () => {
    // @ts-expect-error because formatHelper does black magic
    jest.spyOn(FormaterHelper, "formatData").mockImplementation(data => data);

    const mockGetSubventions = { execute: jest.fn() } as unknown as GetSubventionsByIdentifier;
    const service = new EstablishmentService(mockGetSubventions);
    //@ts-expect-error: mock private method
    const aggregateMock = jest.spyOn(service, "aggregate") as asyncPrivateMock<Establishment>;

    //@ts-expect-error: mock private method
    jest.spyOn(service, "scoreEstablishment")
        // @ts-expect-error: mock return value
        .mockResolvedValue(1);

    describe("getEstablishment()", () => {
        it("should throw NotFoundError", async () => {
            let actual;
            const expected = new NotFoundError("Establishment not found");
            aggregateMock.mockImplementationOnce(async () => ({ data: [] }));
            try {
                actual = await service.getEstablishment(ESTABLISHMENT_ID);
            } catch (e) {
                actual = e;
            }
            expect(actual).toEqual(expected);
        });
    });

    describe("getOldGrants", () => {
        it("should call grantService.getOldGrants()", () => {
            service.getOldGrants(ESTABLISHMENT_ID);
            expect(grantService.getOldGrants).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });
    });

    describe("getPaiements", () => {
        const getPaymentsBySiretMock = jest.spyOn(paymentService, "getPaiements");

        it("should call payment service", async () => {
            getPaymentsBySiretMock.mockImplementation(async () => []);

            await service.getPaiements(ESTABLISHMENT_ID);

            expect(getPaymentsBySiretMock).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });
    });

    describe("getDemandes()", () => {
        it("should call DemandeSubventionService.getByAssociation()", async () => {
            // @ts-expect-error: mock resolved value
            mockGetSubventions.execute.mockResolvedValueOnce([{} as DemandeSubvention]);
            service.getDemandes(ESTABLISHMENT_ID);
            expect(mockGetSubventions.execute).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });
    });

    describe("getDocuments", () => {
        const getDocumentBySiretMock = jest.spyOn(documentsService, "getDocuments");

        it("should call subventions service", async () => {
            getDocumentBySiretMock.mockImplementation(async () => []);

            await service.getDocuments(ESTABLISHMENT_ID);

            expect(getDocumentBySiretMock).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });
    });

    describe("getRibs", () => {
        const getRibsBySiretMock = jest.spyOn(documentsService, "getRibs");

        it("should call subventions service", async () => {
            getRibsBySiretMock.mockImplementation(async () => []);

            await service.getRibs(ESTABLISHMENT_ID);

            expect(getRibsBySiretMock).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });
    });
});
