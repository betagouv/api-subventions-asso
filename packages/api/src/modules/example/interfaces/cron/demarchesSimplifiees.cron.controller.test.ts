import demarchesSimplifieesService from "../../../providers/demarchesSimplifiees/demarchesSimplifiees.service";
import { DemarchesSimplifieesCronController } from "./demarchesSimplifiees.cron.controller";

describe("DemarchesSimplifieesCronController", () => {
    let controller: DemarchesSimplifieesCronController;

    beforeAll(() => {
        controller = new DemarchesSimplifieesCronController();
    });

    describe("updateAll", () => {
        let serviceMock: jest.SpyInstance;
        const RESULT = "res";

        beforeAll(() => {
            // @ts-expect-error mock
            serviceMock = jest.spyOn(demarchesSimplifieesService, "updateAllForms").mockReturnValue(RESULT);
        });

        afterAll(() => {
            serviceMock.mockRestore();
        });

        it("calls service", () => {
            controller.updateAll();
            expect(serviceMock).toBeCalled();
        });

        it("returns result from service", () => {
            const expected = RESULT;
            const actual = controller.updateAll();
            expect(actual).toBe(expected);
        });
    });
});
