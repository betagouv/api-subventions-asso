import emailDomainsService from "./emailDomains.service";
import emailDomainsRepository from "./repositories/emailDomains.repository";

describe("EmailDomainsService", () => {
    const DOMAIN = "@breizh.bzh";
    describe("add()", () => {
        const repositoryAddSpy = jest.spyOn(emailDomainsRepository, "add").mockImplementation(jest.fn());
        it("should call repository", async () => {
            await emailDomainsService.add(DOMAIN);
            expect(repositoryAddSpy).toHaveBeenCalledWith(DOMAIN);
        });
    });
    describe("getAll()", () => {
        const repositoryFindAllSpy = jest.spyOn(emailDomainsRepository, "findAll").mockImplementation(jest.fn());
        it("should call repository", async () => {
            await emailDomainsService.getAll();
            expect(repositoryFindAllSpy).toHaveBeenCalledTimes(1);
        });
    });
    describe("isDomainAccepted()", () => {
        const repositoryFindOneSpy = jest
            .spyOn(emailDomainsRepository, "findOne")
            // @ts-expect-error: mock
            .mockImplementation(async () => ({ domain: DOMAIN }));

        const testTrueCases = async ({ domain }) => {
            const expected = true;
            const actual = await emailDomainsService.isDomainAccepted(domain);
            expect(actual).toEqual(expected);
        };

        it.each`
            domain
            ${DOMAIN}
            ${`anne-de-bretagne${DOMAIN}`}
        `("should return true", testTrueCases);

        it("should return false", async () => {
            repositoryFindOneSpy.mockImplementationOnce(async () => null);
            const expected = false;
            const actual = await emailDomainsService.isDomainAccepted(DOMAIN);
            expect(actual).toEqual(expected);
        });
    });
});
