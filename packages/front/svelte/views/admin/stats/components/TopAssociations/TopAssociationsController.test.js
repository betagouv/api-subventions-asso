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
            await controller.init();

            expect(serviceGetTopAssociationsMock).toHaveBeenCalledTimes(1);
        });
    });
});
