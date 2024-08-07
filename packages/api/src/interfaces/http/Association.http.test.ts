import { DemandeSubvention } from "dto";
import Flux from "../../shared/Flux";
import associationsService from "../../modules/associations/associations.service";
import { AssociationHttp } from "./Association.http";
import grantService from "../../modules/grant/grant.service";
import associationIdentifierService from "../../modules/association-identifier/association-identifier.service";
import AssociationIdentifier from "../../valueObjects/AssociationIdentifier";
import Siren from "../../valueObjects/Siren";
jest.mock("../../modules/grant/grant.service");

const controller = new AssociationHttp();

describe("AssociationHttp", () => {
    const IDENTIFIER = new Siren("000000001");
    const ASSOCIATION_ID = AssociationIdentifier.fromSiren(IDENTIFIER);

    beforeAll(() => {
        const getOneAssociationIdentifierSpy = jest
            .spyOn(associationIdentifierService, "getOneAssociationIdentifier")
            .mockResolvedValue(ASSOCIATION_ID);
    });

    describe("getDemandeSubventions", () => {
        const getSubventionsSpy = jest.spyOn(associationsService, "getSubventions");
        it("should call service with args", async () => {
            const subventions = [{}] as DemandeSubvention[];
            const flux = new Flux(subventions);
            flux.close();
            // @ts-expect-error: mock
            getSubventionsSpy.mockReturnValueOnce(flux);
            await controller.getDemandeSubventions(IDENTIFIER.value);
            expect(getSubventionsSpy).toHaveBeenCalledWith(ASSOCIATION_ID);
        });

        it("should return a grant requests", async () => {
            const subventions = [{}] as DemandeSubvention[];
            const flux = new Flux({ subventions });

            // @ts-expect-error: mock
            getSubventionsSpy.mockImplementationOnce(() => flux);
            const expected = { subventions };
            const promise = controller.getDemandeSubventions(IDENTIFIER.value);
            flux.close();

            expect(await promise).toEqual(expected);
        });
    });
    describe("getGrants", () => {
        it("should call grantService.getGrants()", async () => {
            await controller.getGrants(IDENTIFIER.value);
            expect(grantService.getGrants).toHaveBeenCalledWith(ASSOCIATION_ID);
        });
    });

    describe("getPayments", () => {
        const getSubventionsSpy = jest.spyOn(associationsService, "getPayments");
        it("should call service with args", async () => {
            getSubventionsSpy.mockImplementationOnce(jest.fn());
            await controller.getPayments(IDENTIFIER.value);
            expect(getSubventionsSpy).toHaveBeenCalledWith(ASSOCIATION_ID);
        });

        it("should return payments", async () => {
            // @ts-expect-error: mock
            getSubventionsSpy.mockImplementationOnce(() => payments);
            const payments = [{}];
            const expected = { versements: payments };
            const actual = await controller.getPayments(IDENTIFIER.value);
            expect(actual).toEqual(expected);
        });
    });

    describe("getDocuments", () => {
        const getDocumentsSpy = jest.spyOn(associationsService, "getDocuments");
        it("should call service with args", async () => {
            getDocumentsSpy.mockImplementationOnce(jest.fn());
            await controller.getDocuments(IDENTIFIER.value);
            expect(getDocumentsSpy).toHaveBeenCalledWith(ASSOCIATION_ID);
        });

        it("should return documents", async () => {
            // @ts-expect-error: mock
            getDocumentsSpy.mockImplementationOnce(() => documents);
            const documents = [{}];
            const expected = { documents };
            const actual = await controller.getDocuments(IDENTIFIER.value);
            expect(actual).toEqual(expected);
        });

        it("should throw error", async () => {
            const ERROR_MESSAGE = "Error";
            getDocumentsSpy.mockImplementationOnce(() => Promise.reject(new Error(ERROR_MESSAGE)));
            expect(() => controller.getDocuments(IDENTIFIER.value)).rejects.toThrowError(ERROR_MESSAGE);
        });
    });

    describe("getAssociation", () => {
        const getAssociationSpy = jest.spyOn(associationsService, "getAssociation");
        it("should call service with args", async () => {
            getAssociationSpy.mockImplementationOnce(jest.fn());
            await controller.getAssociation(IDENTIFIER.value);
            expect(getAssociationSpy).toHaveBeenCalledWith(ASSOCIATION_ID);
        });

        it("should return an association", async () => {
            // @ts-expect-error: mock
            getAssociationSpy.mockImplementationOnce(() => association);
            const association = {};
            const expected = { association: association };
            const actual = await controller.getAssociation(IDENTIFIER.value);
            expect(actual).toEqual(expected);
        });

        it("should return an error message", async () => {
            const ERROR_MESSAGE = "Error";
            getAssociationSpy.mockImplementationOnce(() => Promise.reject(new Error(ERROR_MESSAGE)));
            expect(() => controller.getAssociation(IDENTIFIER.value)).rejects.toThrowError(ERROR_MESSAGE);
        });
    });

    describe("getEstablishments", () => {
        const getEtablissementSpy = jest.spyOn(associationsService, "getEstablishments");
        it("should call service with args", async () => {
            getEtablissementSpy.mockImplementationOnce(jest.fn());
            await controller.getEstablishments(IDENTIFIER.value);
            expect(getEtablissementSpy).toHaveBeenCalledWith(ASSOCIATION_ID);
        });

        it("should return establishments", async () => {
            // @ts-expect-error: mock
            getEtablissementSpy.mockImplementationOnce(() => etablissements);
            const etablissements = [{}];
            const expected = { etablissements };
            const actual = await controller.getEstablishments(IDENTIFIER.value);
            expect(actual).toEqual(expected);
        });
    });

    describe("registerExtract", () => {
        it("should return true", async () => {
            const expected = true;
            const actual = await controller.registerExtract(IDENTIFIER.value);
            expect(actual).toEqual(expected);
        });
    });
});
