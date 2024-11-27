import { BadRequestError, ConflictError } from "../../shared/errors/httpErrors";
import { REGEX_MAIL_DOMAIN } from "../user/user.constant";
import { DauphinTokenDataEntity, DauphinTokenAvailableTime } from "./entities";
import ConfigurationEntity from "./entities/ConfigurationEntity";
import configurationsRepository from "./repositories/configurations.repository";

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
        return configurationsRepository.upsert(name, { data });
    }

    getDauphinToken() {
        return configurationsRepository.getByName<DauphinTokenDataEntity>(CONFIGURATION_NAMES.DAUPHIN_TOKEN);
    }

    async setDauphinToken(token: string) {
        await configurationsRepository.upsert(CONFIGURATION_NAMES.DAUPHIN_TOKEN, {
            data: token,
        });
    }

    getDauphinTokenAvailableTime() {
        return configurationsRepository.getByName<DauphinTokenAvailableTime>(
            CONFIGURATION_NAMES.DAUPHIN_TOKEN_AVAILABLE,
        );
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
        const document = await configurationsRepository.getByName<string[]>(CONFIGURATION_NAMES.ACCEPTED_EMAIL_DOMAINS);
        if (!document) {
            await configurationsRepository.upsert(
                CONFIGURATION_NAMES.ACCEPTED_EMAIL_DOMAINS,
                this.createEmptyConfigEntity(CONFIGURATION_NAMES.ACCEPTED_EMAIL_DOMAINS, [domain]),
            );
            return domain;
        }
        if (document.data.includes(domain)) {
            if (throwOnConflict) throw new ConflictError(ConfigurationsService.conflictErrorMessage);
            return domain;
        }

        await configurationsRepository.upsert(
            CONFIGURATION_NAMES.ACCEPTED_EMAIL_DOMAINS,
            this.generateConfiguationEntity(document, [...document.data, domain]),
        );
        return domain;
    }

    async getEmailDomains() {
        return (
            (await configurationsRepository.getByName<string[]>(CONFIGURATION_NAMES.ACCEPTED_EMAIL_DOMAINS))?.data || []
        );
    }

    async isDomainAccepted(domainOrEmail: string) {
        const domain = domainOrEmail.split("@")[1];
        const persistedDomains = (await configurationsRepository.getByName(CONFIGURATION_NAMES.ACCEPTED_EMAIL_DOMAINS))
            ?.data as string[];
        return persistedDomains.some(
            presistedDomain => domain == presistedDomain || domain.endsWith("." + presistedDomain),
        );
    }

    async getLastPublishDumpDate(): Promise<Date> {
        return (
            ((await configurationsRepository.getByName(CONFIGURATION_NAMES.DUMP_PUBLISH_DATE))?.data as Date) ||
            new Date(1970)
        );
    }

    async setLastPublishDumpDate(date: Date) {
        return configurationsRepository.upsert(CONFIGURATION_NAMES.DUMP_PUBLISH_DATE, {
            data: date,
        });
    }
}

const configurationsService = new ConfigurationsService();

export default configurationsService;
