import { DemandeSubvention } from "dto";
import Flux from "../../shared/Flux";
import associationsService from "../../modules/associations/associations.service";
import { AssociationHttp } from "./Association.http";
import consumers from "stream/consumers";
import grantService from "../../modules/grant/grant.service";
import grantExtractService from "../../modules/grant/grantExtract.service";

jest.mock("../../modules/grant/grant.service");
jest.mock("../../modules/grant/grantExtract.service");

const controller = new AssociationHttp();

describe("AssociationHttp", () => {
    const IDENTIFIER = "000000001";

    describe("getDemandeSubventions", () => {
        const getSubventionsSpy = jest.spyOn(associationsService, "getSubventions");
        it("should call service with args", async () => {
            const subventions = [{}] as DemandeSubvention[];
            const flux = new Flux(subventions);
            flux.close();
            // @ts-expect-error: mock
            getSubventionsSpy.mockReturnValueOnce(flux);
            controller.getDemandeSubventions(IDENTIFIER);
            expect(getSubventionsSpy).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("should return a grant requests", async () => {
            const subventions = [{}] as DemandeSubvention[];
            const flux = new Flux({ subventions });

            // @ts-expect-error: mock
            getSubventionsSpy.mockImplementationOnce(() => flux);
            const expected = { subventions };
            const promise = controller.getDemandeSubventions(IDENTIFIER);
            flux.close();

            expect(await promise).toEqual(expected);
        });
    });
    describe("getGrants", () => {
        it("should call grantService.getGrants()", async () => {
            await controller.getGrants(IDENTIFIER);
            expect(grantService.getGrants).toHaveBeenCalledWith(IDENTIFIER);
        });
    });

    describe("getPayments", () => {
        const getSubventionsSpy = jest.spyOn(associationsService, "getPayments");
        it("should call service with args", async () => {
            getSubventionsSpy.mockImplementationOnce(jest.fn());
            await controller.getPayments(IDENTIFIER);
            expect(getSubventionsSpy).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("should return payments", async () => {
            // @ts-expect-error: mock
            getSubventionsSpy.mockImplementationOnce(() => payments);
            const payments = [{}];
            const expected = { versements: payments };
            const actual = await controller.getPayments(IDENTIFIER);
            expect(actual).toEqual(expected);
        });
    });

    describe("getDocuments", () => {
        const getDocumentsSpy = jest.spyOn(associationsService, "getDocuments");
        it("should call service with args", async () => {
            getDocumentsSpy.mockImplementationOnce(jest.fn());
            await controller.getDocuments(IDENTIFIER);
            expect(getDocumentsSpy).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("should return documents", async () => {
            // @ts-expect-error: mock
            getDocumentsSpy.mockImplementationOnce(() => documents);
            const documents = [{}];
            const expected = { documents };
            const actual = await controller.getDocuments(IDENTIFIER);
            expect(actual).toEqual(expected);
        });

        it("should throw error", async () => {
            const ERROR_MESSAGE = "Error";
            getDocumentsSpy.mockImplementationOnce(() => Promise.reject(new Error(ERROR_MESSAGE)));
            expect(() => controller.getDocuments(IDENTIFIER)).rejects.toThrowError(ERROR_MESSAGE);
        });
    });

    describe("getAssociation", () => {
        const getAssociationSpy = jest.spyOn(associationsService, "getAssociation");
        it("should call service with args", async () => {
            getAssociationSpy.mockImplementationOnce(jest.fn());
            await controller.getAssociation(IDENTIFIER);
            expect(getAssociationSpy).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("should return an association", async () => {
            // @ts-expect-error: mock
            getAssociationSpy.mockImplementationOnce(() => association);
            const association = {};
            const expected = { association: association };
            const actual = await controller.getAssociation(IDENTIFIER);
            expect(actual).toEqual(expected);
        });

        it("should return an error message", async () => {
            const ERROR_MESSAGE = "Error";
            getAssociationSpy.mockImplementationOnce(() => Promise.reject(new Error(ERROR_MESSAGE)));
            expect(() => controller.getAssociation(IDENTIFIER)).rejects.toThrowError(ERROR_MESSAGE);
        });
    });

    describe("getEstablishments", () => {
        const getEtablissementSpy = jest.spyOn(associationsService, "getEstablishments");
        it("should call service with args", async () => {
            getEtablissementSpy.mockImplementationOnce(jest.fn());
            await controller.getEstablishments(IDENTIFIER);
            expect(getEtablissementSpy).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("should return establishments", async () => {
            // @ts-expect-error: mock
            getEtablissementSpy.mockImplementationOnce(() => etablissements);
            const etablissements = [{}];
            const expected = { etablissements };
            const actual = await controller.getEstablishments(IDENTIFIER);
            expect(actual).toEqual(expected);
        });
    });

    describe("registerExtract", () => {
        it("should return true", async () => {
            const expected = true;
            const actual = await controller.registerExtract(IDENTIFIER);
            expect(actual).toEqual(expected);
        });
    });

    describe("getGrantExtract", () => {
        const CSV = "csv";
        const FILENAME = "filename";

        beforeAll(() => {
            jest.mocked(grantExtractService.buildCsv).mockResolvedValue({ csv: CSV, fileName: FILENAME });
        });

        afterAll(() => {
            jest.mocked(grantExtractService.buildCsv).mockRestore();
        });

        it("calls grantExtractService.buildCsv", async () => {
            await controller.getGrantsExtract(IDENTIFIER);
            expect(grantExtractService.buildCsv).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("stream contains csv from service", async () => {
            const expected = CSV;
            const streamRes = await controller.getGrantsExtract(IDENTIFIER);
            const actual = await consumers.text(streamRes);
            expect(actual).toBe(expected);
        });

        it("stream contains csv from service", async () => {
            const expected = "inline; filename=filename";
            await controller.getGrantsExtract(IDENTIFIER);
            // @ts-expect-error -- test private
            const actual = await controller?.headers["Content-Disposition"];
            expect(actual).toBe(expected);
        });
    });
});
