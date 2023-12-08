import demarchesSimplifieesService from "../../modules/providers/demarchesSimplifiees/demarchesSimplifiees.service";
import { DemarchesSimplifieesInterfaceCron } from "./DemarchesSimplifieesInterfaceCron";

describe("DemarchesSimplifieesInterfaceCron", () => {
    let controller: DemarchesSimplifieesInterfaceCron;

    beforeAll(() => {
        controller = new DemarchesSimplifieesInterfaceCron();
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
