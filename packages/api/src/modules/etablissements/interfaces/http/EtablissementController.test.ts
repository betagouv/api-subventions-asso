import { DemandeSubvention, Etablissement } from "@api-subventions-asso/dto";
import Flux from "../../../../shared/Flux";
import etablissementsService from "../../etablissements.service";
import { EtablissementController } from "./EtablissementController";

const controller = new EtablissementController();

describe("EtablissementController", () => {
    const IDENTIFIER = "00000000100000";

    describe("getDemandeSubventions", () => {
        const getSubventionsSpy = jest.spyOn(etablissementsService, "getSubventions");
        it("should call service with args", () => {
            const subventions = [{}] as DemandeSubvention[];
            const flux = new Flux({ subventions });

            // @ts-expect-error: mock
            getSubventionsSpy.mockImplementationOnce(() => flux);
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

    describe("getVersements", () => {
        const getSubventionsSpy = jest.spyOn(etablissementsService, "getVersements");
        it("should call service with args", async () => {
            getSubventionsSpy.mockImplementationOnce(jest.fn());
            await controller.getVersements(IDENTIFIER);
            expect(getSubventionsSpy).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("should return payments", async () => {
            // @ts-expect-error: mock
            getSubventionsSpy.mockImplementationOnce(() => versements);
            const versements = [{}];
            const expected = { versements };
            const actual = await controller.getVersements(IDENTIFIER);
            expect(actual).toEqual(expected);
        });

        it("should return an error message", async () => {
            const ERROR_MESSAGE = "Error";
            getSubventionsSpy.mockImplementationOnce(() => Promise.reject(new Error(ERROR_MESSAGE)));
            const expected = { message: ERROR_MESSAGE };
            const actual = await controller.getVersements(IDENTIFIER);
            expect(actual).toEqual(expected);
        });
    });

    describe("getDocuments", () => {
        const getDocumentsSpy = jest.spyOn(etablissementsService, "getDocuments");
        it("should call service with args", async () => {
            getDocumentsSpy.mockImplementationOnce(jest.fn());
            await controller.getDocuments(IDENTIFIER);
            expect(getDocumentsSpy).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("should return a success object", async () => {
            // @ts-expect-error: mock
            getDocumentsSpy.mockImplementationOnce(() => documents);
            const documents = [{}];
            const expected = { documents };
            const actual = await controller.getDocuments(IDENTIFIER);
            expect(actual).toEqual(expected);
        });

        it("should return an error object", async () => {
            const ERROR_MESSAGE = "Error";
            getDocumentsSpy.mockImplementationOnce(() => Promise.reject(new Error(ERROR_MESSAGE)));
            const expected = { message: ERROR_MESSAGE };
            const actual = await controller.getDocuments(IDENTIFIER);
            expect(actual).toEqual(expected);
        });
    });

    describe("getEtablissement", () => {
        const getEtablissementSpy = jest.spyOn(etablissementsService, "getEtablissement");
        it("should call service with args", async () => {
            getEtablissementSpy.mockImplementationOnce(async () => ({ siret: IDENTIFIER } as unknown as Etablissement));
            await controller.getEtablissement(IDENTIFIER);
            expect(getEtablissementSpy).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("should return a success object", async () => {
            // @ts-expect-error: mock
            getEtablissementSpy.mockImplementationOnce(() => etablissement);
            const etablissement = {};
            const expected = { etablissement };
            const actual = await controller.getEtablissement(IDENTIFIER);
            expect(actual).toEqual(expected);
        });
    });
});
