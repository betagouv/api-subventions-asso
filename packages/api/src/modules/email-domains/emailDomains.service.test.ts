import emailDomainsService from "./emailDomains.service";
import emailDomainsRepository from "./repositories/emailDomains.repository";

describe("EmailDomainsService", () => {
    const DOMAIN = "@breizh.bzh";
    describe("add", () => {
        const repositoryAddSpy = jest.spyOn(emailDomainsRepository, "add").mockImplementation(jest.fn());
        it("should call repository", async () => {
            await emailDomainsService.add(DOMAIN);
            expect(repositoryAddSpy).toHaveBeenCalledWith(DOMAIN);
        });
    });
});
