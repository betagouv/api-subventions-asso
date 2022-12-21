import emailDomainsService from "../../emailDomains.service";
import { EmailDomainsController } from "./EmailDomainsController";

describe("EmailDomainsController", () => {
    let controller;
    beforeEach(() => {
        controller = new EmailDomainsController();
    });
    describe("addDomain()", () => {
        const BODY = { domain: "rhones.fr" };
        const addDomainMock = jest.spyOn(emailDomainsService, "add");
        it("should return ErrorResponse", async () => {
            addDomainMock.mockImplementationOnce(async () => {
                throw new Error();
            });
            const expected = { success: false, message: "Internal Server Error" };
            const actual = await controller.addDomain(BODY);
            expect(actual).toEqual(expected);
        });
        it("should return SuccessResponse", async () => {
            addDomainMock.mockImplementationOnce(async domain => domain);
            const expected = { success: true, domain: BODY.domain };
            const actual = await controller.addDomain(BODY);
            expect(actual).toEqual(expected);
        });
    });
});
