import { BadRequestError, ConflictError } from "../../shared/errors/httpErrors";
import { REGEX_MAIL_DOMAIN } from "../user/user.constant";
import configurationsPort from "../../dataProviders/db/configurations/configurations.port";
import { DauphinTokenDataEntity, DauphinTokenAvailableTime } from "./entities";
import ConfigurationEntity from "./entities/ConfigurationEntity";

export enum CONFIGURATION_NAMES {
    DAUPHIN_TOKEN = "DAUPHIN-TOKEN",
    DAUPHIN_TOKEN_AVAILABLE = "DAUPHIN-TOKEN-AVAILABLE",
    ACCEPTED_EMAIL_DOMAINS = "ACCEPTED-EMAIL-DOMAINS",
    DUMP_PUBLISH_DATE = "DUMP-PUBLISH-DATE",
    LAST_RGPD_WARNED_DATE = "LAST-RGPD-WARNED-DATE",
    LAST_CHORUS_UPDATE_IMPORTED = "LAST-CHORUS-UPDATE-IMPORTED",
}

export class ConfigurationsService {
    createEmptyConfigEntity<T>(name, defaultData: T): ConfigurationEntity<T> {
        return {
            name,
            data: defaultData,
            updatedAt: new Date(),
        };
    }

    private generateConfiguationEntity<T>(entity, data: T): ConfigurationEntity<T> {
        return { ...entity, data, updatedAt: new Date() };
    }

    updateConfigEntity<T>(name: string, data: T) {
        return configurationsPort.upsert(name, { data });
    }

    getDauphinToken() {
        return configurationsPort.getByName<DauphinTokenDataEntity>(CONFIGURATION_NAMES.DAUPHIN_TOKEN);
    }

    async setDauphinToken(token: string) {
        await configurationsPort.upsert(CONFIGURATION_NAMES.DAUPHIN_TOKEN, {
            data: token,
        });
    }

    getDauphinTokenAvailableTime() {
        return configurationsPort.getByName<DauphinTokenAvailableTime>(CONFIGURATION_NAMES.DAUPHIN_TOKEN_AVAILABLE);
    }

    /**
     * |---------------------|
     * |  Email Domain Part  |
     * |---------------------|
     */

    static conflictErrorMessage = "Domain already exist";

    isDomainValid(domain) {
        return REGEX_MAIL_DOMAIN.test(domain);
    }

    async addEmailDomain(domain: string, throwOnConflict = true) {
        if (!this.isDomainValid(domain)) throw new BadRequestError();
        const document = await configurationsPort.getByName<string[]>(CONFIGURATION_NAMES.ACCEPTED_EMAIL_DOMAINS);
        if (!document) {
            await configurationsPort.upsert(
                CONFIGURATION_NAMES.ACCEPTED_EMAIL_DOMAINS,
                this.createEmptyConfigEntity(CONFIGURATION_NAMES.ACCEPTED_EMAIL_DOMAINS, [domain]),
            );
            return domain;
        }
        if (document.data.includes(domain)) {
            if (throwOnConflict) throw new ConflictError(ConfigurationsService.conflictErrorMessage);
            return domain;
        }

        await configurationsPort.upsert(
            CONFIGURATION_NAMES.ACCEPTED_EMAIL_DOMAINS,
            this.generateConfiguationEntity(document, [...document.data, domain]),
        );
        return domain;
    }

    async getEmailDomains() {
        return (await configurationsPort.getByName<string[]>(CONFIGURATION_NAMES.ACCEPTED_EMAIL_DOMAINS))?.data || [];
    }

    async isDomainAccepted(domainOrEmail: string) {
        const domain = domainOrEmail.split("@")[1];
        const persistedDomains = (await configurationsPort.getByName(CONFIGURATION_NAMES.ACCEPTED_EMAIL_DOMAINS))
            ?.data as string[];
        return persistedDomains.some(
            presistedDomain => domain == presistedDomain || domain.endsWith("." + presistedDomain),
        );
    }

    async getLastPublishDumpDate(): Promise<Date> {
        return (
            ((await configurationsPort.getByName(CONFIGURATION_NAMES.DUMP_PUBLISH_DATE))?.data as Date) ||
            new Date(1970)
        );
    }

    async setLastPublishDumpDate(date: Date) {
        return configurationsPort.upsert(CONFIGURATION_NAMES.DUMP_PUBLISH_DATE, {
            data: date,
        });
    }
}

const configurationsService = new ConfigurationsService();

export default configurationsService;
