import configurationsService from "../../modules/configurations/configurations.service";
import { ConfigurationsHttp } from "./Configurations.http";

describe("ConfigurationsHttp", () => {
    let controller;
    beforeEach(() => {
        controller = new ConfigurationsHttp();
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
