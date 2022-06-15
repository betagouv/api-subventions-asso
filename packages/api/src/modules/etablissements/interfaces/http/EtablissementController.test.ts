import { NotFoundError } from '../../../../shared/errors/httpErrors/NotFoundError';
import etablissementsService from '../../etablissements.service'
import { EtablissementController } from './EtablissementController';

const controller = new EtablissementController();

describe("EtablissementController", () => {
    const IDENTIFIER = "00000000100000";

    describe("getDemandeSubventions", () => {
        const getSubventionsSpy = jest.spyOn(etablissementsService, "getSubventions");
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

        it("should return an error object", async () => {
            const ERROR_MESSAGE = "Error";
            getSubventionsSpy.mockImplementationOnce(() => Promise.reject(new Error(ERROR_MESSAGE)))
            const expected = { success: false, message: ERROR_MESSAGE }
            const actual = await controller.getDemandeSubventions(IDENTIFIER);
            expect(actual).toEqual(expected);
        })
    })

    describe("getVersements", () => {
        const getSubventionsSpy = jest.spyOn(etablissementsService, "getVersements");
        it("should call service with args", async () => {
            getSubventionsSpy.mockImplementationOnce(jest.fn());
            await controller.getVersements(IDENTIFIER);
            expect(getSubventionsSpy).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("should return a success object", async () => {
            // @ts-expect-error: mock
            getSubventionsSpy.mockImplementationOnce(() => versements)
            const versements = [{}];
            const expected = { success: true, versements }
            const actual = await controller.getVersements(IDENTIFIER);
            expect(actual).toEqual(expected);
        })

        it("should return an error object", async () => {
            const ERROR_MESSAGE = "Error";
            getSubventionsSpy.mockImplementationOnce(() => Promise.reject(new Error(ERROR_MESSAGE)))
            const expected = { success: false, message: ERROR_MESSAGE }
            const actual = await controller.getVersements(IDENTIFIER);
            expect(actual).toEqual(expected);
        })
    })
})