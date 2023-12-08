import configurationsService from "../../modules/configurations/configurations.service";
import { ConfigurationsInterfaceHttp } from "./ConfigurationsInterfaceHttp";

describe("ConfigurationsInterfaceHttp", () => {
    let controller;
    beforeEach(() => {
        controller = new ConfigurationsInterfaceHttp();
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
