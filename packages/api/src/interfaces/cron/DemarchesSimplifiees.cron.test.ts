import demarchesSimplifieesService from "../../modules/providers/demarchesSimplifiees/demarchesSimplifiees.service";
import { DemarchesSimplifieesCron } from "./DemarchesSimplifiees.cron";
import dataLogService from "../../modules/data-log/dataLog.service";

jest.mock("../../modules/providers/demarchesSimplifiees/demarchesSimplifiees.service", () => ({
    updateAllForms: jest.fn(),
    meta: { id: "mockedId", name: "mockedName" },
}));
jest.mock("../../modules/data-log/dataLog.service");

describe("DemarchesSimplifieesCron", () => {
    let controller: DemarchesSimplifieesCron;

    beforeAll(() => {
        controller = new DemarchesSimplifieesCron();
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

        it("calls service", async () => {
            await controller.updateAll();
            expect(serviceMock).toBeCalled();
        });

        it("logs import", async () => {
            const date = new Date("2022-01-01");
            jest.useFakeTimers().setSystemTime(date);
            await controller.updateAll();
            expect(dataLogService.addFromApi).toHaveBeenCalledWith({
                providerId: "mockedId",
                providerName: "mockedName",
                editionDate: date,
            });
            jest.useRealTimers();
        });
    });
});
