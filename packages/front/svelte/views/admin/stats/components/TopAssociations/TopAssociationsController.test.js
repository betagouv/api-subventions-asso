import statsService from "@resources/stats/stats.service";
import TopAssociationsController from "./TopAssociationsController";

describe("TopAssociationsController", () => {
    describe("init", () => {
        let serviceGetTopAssociationsMock;
        let controller;

        beforeAll(() => {
            serviceGetTopAssociationsMock = jest.spyOn(statsService, "getTopAssociations");
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
