import statisticsService from "@resources/statistics/statistics.service";
import TopAssociationsController from "./TopAssociationsController";

describe("TopAssociationsController", () => {
    describe("load", () => {
        let serviceGetTopAssociationsMock;
        let controller;

        beforeAll(() => {
            serviceGetTopAssociationsMock = jest.spyOn(statisticsService, "getTopAssociations");
            controller = new TopAssociationsController();
        });

        afterAll(() => {
            serviceGetTopAssociationsMock.mockRestore();
        });

        it("should call getTopAssociations", async () => {
            serviceGetTopAssociationsMock.mockImplementationOnce(() => []);
            await controller.load();

            expect(serviceGetTopAssociationsMock).toHaveBeenCalledTimes(1);
        });
    });

    describe("_buildStartDate", () => {
        let controller;

        beforeAll(() => {
            controller = new TopAssociationsController();
        });

        it("should return start date", async () => {
            const expected = new Date(2021, 10, 12);

            const endDate = new Date(2022, 10, 12);

            const actual = controller._buildStartDate(endDate);

            expect(actual).toEqual(expected);
        });
    });
});
