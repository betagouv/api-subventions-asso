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

        it("should return a success object", async () => {
            const subventions = [{}] as DemandeSubvention[];
            const flux = new Flux({ subventions });

            // @ts-expect-error: mock
            getSubventionsSpy.mockImplementationOnce(() => flux);
            const expected = { success: true, subventions };
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

        it("should return a success object", async () => {
            // @ts-expect-error: mock
            getSubventionsSpy.mockImplementationOnce(() => versements);
            const versements = [{}];
            const expected = { success: true, versements };
            const actual = await controller.getVersements(IDENTIFIER);
            expect(actual).toEqual(expected);
        });

        it("should return an error object", async () => {
            const ERROR_MESSAGE = "Error";
            getSubventionsSpy.mockImplementationOnce(() => Promise.reject(new Error(ERROR_MESSAGE)));
            const expected = { success: false, message: ERROR_MESSAGE };
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
            const expected = { success: true, documents };
            const actual = await controller.getDocuments(IDENTIFIER);
            expect(actual).toEqual(expected);
        });

        it("should return an error object", async () => {
            const ERROR_MESSAGE = "Error";
            getDocumentsSpy.mockImplementationOnce(() => Promise.reject(new Error(ERROR_MESSAGE)));
            const expected = { success: false, message: ERROR_MESSAGE };
            const actual = await controller.getDocuments(IDENTIFIER);
            expect(actual).toEqual(expected);
        });
    });

    describe("getEtablissement", () => {
        const getEtablissementSpy = jest.spyOn(etablissementsService, "getEtablissement");
        const registerMock = jest.spyOn(etablissementsService, "registerRequest");

        beforeAll(() => registerMock.mockImplementation(jest.fn()));
        afterAll(() => registerMock.mockClear());

        it("should call service with args", async () => {
            getEtablissementSpy.mockImplementationOnce(async () => ({ siret: IDENTIFIER } as unknown as Etablissement));
            // @ts-expect-error: no request given for testing
            await controller.getEtablissement(IDENTIFIER);
            expect(getEtablissementSpy).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("should return a success object", async () => {
            // @ts-expect-error: mock
            getEtablissementSpy.mockImplementationOnce(() => etablissement);
            const etablissement = {};
            const expected = { success: true, etablissement };
            // @ts-expect-error: no request given for testing
            const actual = await controller.getEtablissement(IDENTIFIER);
            expect(actual).toEqual(expected);
        });

        describe("registering visits", () => {
            function makeRequest(isUserAdmin = false) {
                const req = { user: { roles: ["user"] } };
                if (isUserAdmin) req.user.roles.push("admin");
                return req;
            }

            async function checkRegistering(isUserAdmin, isCalled) {
                getEtablissementSpy.mockImplementationOnce(
                    async () => ({ siret: IDENTIFIER } as unknown as Etablissement)
                );
                // @ts-expect-error: mock
                await controller.getEtablissement(IDENTIFIER, makeRequest(isUserAdmin));
                expect(registerMock).toHaveBeenCalledTimes(isCalled ? 1 : 0);
            }

            it("should register visit for regular user request", async () => {
                await checkRegistering(false, true);
            });

            it("should register visit for regular user request", async () => {
                await checkRegistering(true, false);
            });
        });
    });
});
