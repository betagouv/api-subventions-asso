import emailDomainsService from "../../emailDomains.service";
import { EmailDomainsController } from "./EmailDomainsController";

describe("EmailDomainsController", () => {
    let controller;
    beforeEach(() => {
        controller = new EmailDomainsController();
    });
    describe("addDomain()", () => {
        const addDomainSpy = jest.spyOn(emailDomainsService, "add");
        it("should return ErrorResponse", async () => {
            addDomainSpy.mockImplementationOnce(() => {
                throw new Error();
            });
            const expected = { success: false, message: "Internal Server Error" };
            const actual = await controller.addDomain();
            expect(actual).toEqual(expected);
        });
        it("should return SuccessResponse", async () => {
            addDomainSpy.mockImplementationOnce(domain => domain);
            const DOMAIN = "DOMAIN";
            const expected = { success: true, domain: DOMAIN };
            const actual = await controller.addDomain(DOMAIN);
            expect(actual).toEqual(expected);
        });
    });
});
