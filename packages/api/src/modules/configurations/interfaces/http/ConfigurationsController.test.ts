import configurationsService from "../../configurations.service";
import { ConfigurationsController } from "./ConfigurationsController";

describe("ConfigurationsController", () => {
    let controller;
    beforeEach(() => {
        controller = new ConfigurationsController();
    });
    describe("addDomain()", () => {
        const BODY = { domain: "rhone.fr" };
        const addEmailDomainMock = jest.spyOn(configurationsService, "addEmailDomain");
        it("should return response", async () => {
            addEmailDomainMock.mockImplementationOnce(async domain => domain);
            const expected = { domain: BODY.domain };
            const actual = await controller.addDomain(BODY);
            expect(actual).toEqual(expected);
        });
    });
});
