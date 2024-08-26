import { isObjectBindingPattern } from "typescript";
import { BadRequestError } from "../../shared/errors/httpErrors";
import { ConflictError } from "../../shared/errors/httpErrors/ConflictError";
import configurationsService, { ConfigurationsService, CONFIGURATION_NAMES } from "./configurations.service";
import configurationsRepository from "./repositories/configurations.repository";
import { ObjectId } from "mongodb";

describe("ConfigurationService", () => {
    jest.useFakeTimers().setSystemTime(new Date("2022-01-01"));
    const getByNameMock: jest.SpyInstance<unknown> = jest.spyOn(configurationsRepository, "getByName");
    const upsertMock: jest.SpyInstance<unknown> = jest.spyOn(configurationsRepository, "upsert");

    const CONFIG_NAME = "name";
    const DEFAULT_DATA = [];
    const EMPTY_ENTITY = {
        name: CONFIG_NAME,
        data: DEFAULT_DATA,
        updatedAt: new Date(),
    };
    describe("createEmptyConfigEntity()", () => {
        it("should return entity", () => {
            const expected = EMPTY_ENTITY;
            const actual = configurationsService.createEmptyConfigEntity(CONFIG_NAME, DEFAULT_DATA);
            expect(actual).toEqual(expected);
        });
    });

    describe("generateConfiguationEntity()", () => {
        it("should return entity", () => {
            const UPDATED_DATA = ["DATA"];
            const expected = { ...EMPTY_ENTITY, data: UPDATED_DATA };
            // @ts-expect-error -- test private
            const actual = configurationsService.generateConfiguationEntity(EMPTY_ENTITY, UPDATED_DATA);
            expect(actual).toEqual(expected);
        });
    });

    describe("updateConfigEntity()", () => {
        it("should call repository", async () => {
            // @ts-expect-error -- mock
            upsertMock.mockResolvedValueOnce({});
            const UPDATED_DATA = ["DATA"];
            const expected = [CONFIG_NAME, { data: UPDATED_DATA }];
            await configurationsService.updateConfigEntity(CONFIG_NAME, UPDATED_DATA);
            expect(upsertMock).toHaveBeenCalledWith(...expected);
        });
    });

    describe("Dauphin Configuration Part", () => {
        describe("getDauphinToken", () => {
            it("should return token", async () => {
                const expected = { data: "TOKEN" };
                getByNameMock.mockImplementationOnce(async () => expected);

                const actual = await configurationsService.getDauphinToken();

                expect(actual).toEqual(expected);
            });

            it("should call repository with good name", async () => {
                const expected = "DAUPHIN-TOKEN";
                getByNameMock.mockImplementationOnce(async () => ({}));

                await configurationsService.getDauphinToken();

                expect(getByNameMock).toHaveBeenCalledWith(expected);
            });

            it("should return null", async () => {
                const expected = { data: null };
                getByNameMock.mockImplementationOnce(async () => expected);

                const actual = await configurationsService.getDauphinToken();

                expect(actual).toEqual(expected);
            });
        });

        describe("setDauphinToken", () => {
            it("should set token", async () => {
                const expected = "TOKEN";
                upsertMock.mockImplementationOnce(async () => ({}));

                await configurationsService.setDauphinToken(expected);

                expect(upsertMock).toHaveBeenCalledWith("DAUPHIN-TOKEN", {
                    data: expected,
                });
            });
        });

        describe("getDauphinTokenAvailableTime", () => {
            it("should return token", async () => {
                const expected = { data: 1000 };
                getByNameMock.mockImplementationOnce(async () => expected);

                const actual = await configurationsService.getDauphinTokenAvailableTime();

                expect(actual).toEqual(expected);
            });

            it("should call repository with good name", async () => {
                const expected = "DAUPHIN-TOKEN-AVAILABLE";
                getByNameMock.mockImplementationOnce(async () => ({}));

                await configurationsService.getDauphinTokenAvailableTime();

                expect(getByNameMock).toHaveBeenCalledWith(expected);
            });

            it("should return null", async () => {
                const expected = { data: null };
                getByNameMock.mockImplementationOnce(async () => expected);

                const actual = await configurationsService.getDauphinTokenAvailableTime();

                expect(actual).toEqual(expected);
            });
        });
    });

    describe("Chorus LastObjectId Configuration Part", () => {
        describe("getChorusLastObjectId", () => {
            it("should return lastObjectId", async () => {
                const expected = { data: new ObjectId("000000000000000000000000") };
                getByNameMock.mockImplementationOnce(async () => expected);

                const actual = await configurationsService.getChorusLastObjectId();
                expect(actual).toEqual(expected);
            });

            it("should call repository with good name", async () => {
                const expected = "LAST-CHORUS-OBJECT-ID";
                getByNameMock.mockImplementationOnce(async () => {});

                await configurationsService.getChorusLastObjectId();

                expect(getByNameMock).toHaveBeenCalledWith(expected);
            });

            it("should return null", async () => {
                const expected = null;
                getByNameMock.mockImplementationOnce(async () => expected);

                const actual = await configurationsService.getChorusLastObjectId();

                expect(actual).toEqual(expected);
            });
        });

        describe("setChorusLastObjectId", () => {
            it("should set lastObjectId", async () => {
                const expected = new ObjectId("000000000000000000000000");
                upsertMock.mockImplementationOnce(async () => {});

                await configurationsService.setChorusLastObjectId(expected);

                expect(upsertMock).toHaveBeenCalledWith("LAST-CHORUS-OBJECT-ID", {
                    data: expected,
                });
            });
        });
    });

    describe("Email Domain Configuration Part", () => {
        const PERSISTED_DOMAINS = ["rhone.fr"];
        const NEW_DOMAIN = "ille-et-vilaine.fr";
        const INVALID_DOMAIN = "ille-e";

        beforeAll(() => {
            getByNameMock.mockImplementation(async name => ({
                data: [...PERSISTED_DOMAINS],
            }));
            upsertMock.mockImplementation(jest.fn());
        });

        afterAll(() => {
            getByNameMock.mockRestore();
            upsertMock.mockRestore();
        });

        describe("addEmailDomain()", () => {
            it("should get all persisted domains", async () => {
                await configurationsService.addEmailDomain(NEW_DOMAIN);
                expect(getByNameMock).toHaveBeenCalledTimes(1);
            });

            it("should upsert domains", async () => {
                await configurationsService.addEmailDomain(NEW_DOMAIN);
                expect(upsertMock).toHaveBeenCalledWith(CONFIGURATION_NAMES.ACCEPTED_EMAIL_DOMAINS, {
                    data: [...PERSISTED_DOMAINS, NEW_DOMAIN],
                    updatedAt: new Date(),
                });
            });

            it("should upsert new document", async () => {
                getByNameMock.mockImplementationOnce(async () => null);
                await configurationsService.addEmailDomain(NEW_DOMAIN);
                expect(upsertMock).toHaveBeenCalledWith(CONFIGURATION_NAMES.ACCEPTED_EMAIL_DOMAINS, {
                    name: CONFIGURATION_NAMES.ACCEPTED_EMAIL_DOMAINS,
                    data: [NEW_DOMAIN],
                    updatedAt: new Date(),
                });
            });

            it("should return added domain", async () => {
                const expected = NEW_DOMAIN;
                const actual = await configurationsService.addEmailDomain(NEW_DOMAIN);
                expect(actual).toEqual(expected);
            });

            it("should return BadRequestError", async () => {
                const expected = new BadRequestError();
                let actual;
                try {
                    actual = await configurationsService.addEmailDomain(INVALID_DOMAIN);
                } catch (e) {
                    actual = e;
                }
                expect(actual).toEqual(expected);
            });

            it("should return custom ConflictError", async () => {
                const expected = new ConflictError(ConfigurationsService.conflictErrorMessage);
                let actual;
                try {
                    actual = await configurationsService.addEmailDomain(PERSISTED_DOMAINS[0]);
                } catch (e) {
                    actual = e;
                }
                expect(actual).toEqual(expected);
            });

            it("should return domain already added without throwing according to arg", async () => {
                const expected = PERSISTED_DOMAINS[0];
                const actual = await configurationsService.addEmailDomain(PERSISTED_DOMAINS[0], false);
                expect(actual).toEqual(expected);
            });
        });

        describe("getEmailDomains()", () => {
            it("should call getByName", async () => {
                await configurationsService.getEmailDomains();
                expect(getByNameMock).toHaveBeenCalledWith(CONFIGURATION_NAMES.ACCEPTED_EMAIL_DOMAINS);
            });

            it("should return domains", async () => {
                const expected = PERSISTED_DOMAINS;
                const actual = await configurationsService.getEmailDomains();
                expect(actual).toEqual(expected);
            });

            it("should return empty array", async () => {
                getByNameMock.mockImplementationOnce(() => null);
                const expected = [];
                const actual = await configurationsService.getEmailDomains();
                expect(actual).toEqual(expected);
            });
        });
    });
});
