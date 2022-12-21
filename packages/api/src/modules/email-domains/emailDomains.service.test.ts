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
    describe("getAll", () => {
        const repositoryFindAllSpy = jest.spyOn(emailDomainsRepository, "findAll").mockImplementation(jest.fn());
        it("should call repository", async () => {
            await emailDomainsService.getAll();
            expect(repositoryFindAllSpy).toHaveBeenCalledTimes(1);
        });
    });
});
