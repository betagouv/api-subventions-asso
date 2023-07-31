import TopAssociationsController from "./TopAssociationsController";
import statsService from "$lib/resources/stats/stats.service";

describe("TopAssociationsController", () => {
    describe("init", () => {
        let serviceGetTopAssociationsMock;
        let controller;

        beforeAll(() => {
            serviceGetTopAssociationsMock = vi.spyOn(statsService, "getTopAssociations");
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
