import subventionService from '../../subventions.service'
import { SubventionController } from '../../interfaces/http/SubventionController';

const controller = new SubventionController();

describe("AssociationController", () => {
    const MONGO_ID = "ID";
    describe("getDemandeSubventionById()", () => {
        const getSubventionsSpy = jest.spyOn(subventionService, "getDemandeById");
        it("should call service with args", async () => {
            getSubventionsSpy.mockImplementationOnce(jest.fn());
            await controller.getDemandeSubventionById(MONGO_ID);
            expect(getSubventionsSpy).toHaveBeenCalledWith(MONGO_ID);
        });

        it("should return a success object when not found", async () => {
            getSubventionsSpy.mockImplementationOnce(async () => null)
            const subvention = undefined;
            const expected = { success: true, subvention, message: "Subvention not found" };
            const actual = await controller.getDemandeSubventionById(MONGO_ID);
            expect(actual).toEqual(expected);
        })

        it("should return a success object", async () => {
            const subvention = {};
            // @ts-expect-error: mock
            getSubventionsSpy.mockImplementationOnce(async () => subvention)
            const expected = { success: true, subvention }
            const actual = await controller.getDemandeSubventionById(MONGO_ID);
            expect(actual).toEqual(expected);
        })

        it("should return an error object", async () => {
            const ERROR_MESSAGE = "Error";
            getSubventionsSpy.mockImplementationOnce(async () => Promise.reject(new Error(ERROR_MESSAGE)))
            const expected = { success: false, message: ERROR_MESSAGE }
            const actual = await controller.getDemandeSubventionById(MONGO_ID);
            expect(actual).toEqual(expected);
        })
    })
})