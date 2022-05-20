import { NotFoundError } from '../../../../shared/errors/httpErrors/NotFoundError';
import associationsService from '../../associations.service'
import { AssociationController } from '../../interfaces/http/AssociationController';

const controller = new AssociationController();

describe("AssociationController", () => {
    const IDENTIFIER = "000000001";

    describe("getDemandeSubventions", () => {
        const getSubventionsSpy = jest.spyOn(associationsService, "getSubventions");
        it("should call service with args", async () => {
            getSubventionsSpy.mockImplementationOnce(jest.fn());
            await controller.getDemandeSubventions(IDENTIFIER);
            expect(getSubventionsSpy).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("should return a success object", async () => {
            // @ts-expect-error: mock
            getSubventionsSpy.mockImplementationOnce(() => subventions)
            const subventions = [{}];
            const expected = { success: true, subventions }
            const actual = await controller.getDemandeSubventions(IDENTIFIER);
            expect(actual).toEqual(expected);
        })

        it("should return a success object", async () => {
            // @ts-expect-error: mock
            getSubventionsSpy.mockImplementationOnce(() => subventions)
            const subventions = [{}];
            const expected = { success: true, subventions }
            const actual = await controller.getDemandeSubventions(IDENTIFIER);
            expect(actual).toEqual(expected);
        })

        it("should return an error object", async () => {
            const ERROR_MESSAGE = "Error";
            getSubventionsSpy.mockImplementationOnce(() => Promise.reject(new Error(ERROR_MESSAGE)))
            const expected = { success: false, message: ERROR_MESSAGE }
            const actual = await controller.getDemandeSubventions(IDENTIFIER);
            expect(actual).toEqual(expected);
        })
    })

    describe("getAssociation", () => {
        const getAssociationSpy = jest.spyOn(associationsService, "getAssociation");
        it("should call service with args", async () => {
            getAssociationSpy.mockImplementationOnce(jest.fn());
            await controller.getAssociation(IDENTIFIER);
            expect(getAssociationSpy).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("should return a success object", async () => {
            // @ts-expect-error: mock
            getAssociationSpy.mockImplementationOnce(() => association)
            const association = {};
            const expected = { success: true, association: association }
            const actual = await controller.getAssociation(IDENTIFIER);
            expect(actual).toEqual(expected);
        })

        it("should return a success object with message if no association found", async () => {
            // @ts-expect-error: mock
            getAssociationSpy.mockImplementationOnce(() => null)
            const expected = { success: true, association: undefined, message: "Association not found" }
            const actual = await controller.getAssociation(IDENTIFIER);
            expect(actual).toEqual(expected);
        })

        it("should return an error object", async () => {
            const ERROR_MESSAGE = "Error";
            getAssociationSpy.mockImplementationOnce(() => Promise.reject(new Error(ERROR_MESSAGE)))
            const expected = { success: false, message: ERROR_MESSAGE }
            const actual = await controller.getAssociation(IDENTIFIER);
            expect(actual).toEqual(expected);
        })
    })

    describe("getEtablissements", () => {
        const getEtablissementSpy = jest.spyOn(associationsService, "getEtablissements");
        it("should call service with args", async () => {
            getEtablissementSpy.mockImplementationOnce(jest.fn());
            await controller.getEtablissements(IDENTIFIER);
            expect(getEtablissementSpy).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("should return a success object", async () => {
            // @ts-expect-error: mock
            getEtablissementSpy.mockImplementationOnce(() => etablissements)
            const etablissements = [{}];
            const expected = { success: true, etablissements }
            const actual = await controller.getEtablissements(IDENTIFIER);
            expect(actual).toEqual(expected);
        })

        it("should return a success object", async () => {
            // @ts-expect-error: mock
            getEtablissementSpy.mockImplementationOnce(() => etablissements)
            const etablissements = [{}];
            const expected = { success: true, etablissements }
            const actual = await controller.getEtablissements(IDENTIFIER);
            expect(actual).toEqual(expected);
        })

        it("should return an error object", async () => {
            const ERROR_MESSAGE = "Error";
            getEtablissementSpy.mockImplementationOnce(() => Promise.reject(new Error(ERROR_MESSAGE)))
            const expected = { success: false, message: ERROR_MESSAGE }
            const actual = await controller.getEtablissements(IDENTIFIER);
            expect(actual).toEqual(expected);
        })
    })

    describe("getEtablissement", () => {
        const NIC = "00035";
        const getEtablissementSpy = jest.spyOn(associationsService, "getEtablissement");
        it("should call service with args", async () => {
            getEtablissementSpy.mockImplementationOnce(jest.fn());
            await controller.getEtablissement(IDENTIFIER, NIC);
            expect(getEtablissementSpy).toHaveBeenCalledWith(IDENTIFIER, NIC);
        });

        it("should return a success object", async () => {
            // @ts-expect-error: mock
            getEtablissementSpy.mockImplementationOnce(() => etablissement)
            const etablissement = {};
            const expected = { success: true, etablissement }
            const actual = await controller.getEtablissement(IDENTIFIER, NIC);
            expect(actual).toEqual(expected);
        })

        it("should return an error object", async () => {
            const ERROR_MESSAGE = "Error";
            getEtablissementSpy.mockImplementationOnce(() => Promise.reject(new Error(ERROR_MESSAGE)))
            const expected = { success: false, message: ERROR_MESSAGE }
            const actual = await controller.getEtablissement(IDENTIFIER, NIC);
            expect(actual).toEqual(expected);
        })

        it("should return an error object", async () => {
            const ERROR_MESSAGE = "Error";
            getEtablissementSpy.mockImplementationOnce(() => Promise.reject(new NotFoundError(ERROR_MESSAGE)))
            const expected = { success: false, message: ERROR_MESSAGE }
            const actual = await controller.getEtablissement(IDENTIFIER, NIC);
            expect(actual).toEqual(expected);
            expect(controller.getStatus()).toBe(404);
        })
    })
})