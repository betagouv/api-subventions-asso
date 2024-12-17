import { MainInfoBannerDto } from "dto";
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
    LAST_USER_STATS_UPDATE = "LAST_USER_STATS_UPDATE",
    HOME_INFOS_BANNER_TITLE = "HOME-INFOS-BANNER-TITLE",
    HOME_INFOS_BANNER_DESC = "HOME-INFOS-BANNER-DESC",
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

    async getLastUserStatsUpdate(): Promise<Date> {
        return (
            ((await configurationsPort.getByName(CONFIGURATION_NAMES.LAST_USER_STATS_UPDATE))?.data as Date) ||
            new Date(1970)
        );
    }

    async setLastUserStatsUpdate(date: Date) {
        await configurationsPort.upsert(CONFIGURATION_NAMES.LAST_USER_STATS_UPDATE, {
            data: date,
        });
    }

    async updateMainInfoBanner(title: string, desc: string) {
        const bannerTitle = await configurationsPort.getByName<string>(CONFIGURATION_NAMES.HOME_INFOS_BANNER_TITLE);
        const bannerDesc = await configurationsPort.getByName<string>(CONFIGURATION_NAMES.HOME_INFOS_BANNER_DESC);
        if (!bannerTitle) {
            await configurationsPort.upsert(
                CONFIGURATION_NAMES.HOME_INFOS_BANNER_TITLE,
                this.createEmptyConfigEntity(CONFIGURATION_NAMES.HOME_INFOS_BANNER_TITLE, title),
            );
        } else {
            await configurationsPort.upsert(
                CONFIGURATION_NAMES.HOME_INFOS_BANNER_TITLE,
                this.generateConfiguationEntity(bannerTitle, title),
            );
        }
        if (!bannerDesc) {
            await configurationsPort.upsert(
                CONFIGURATION_NAMES.HOME_INFOS_BANNER_DESC,
                this.createEmptyConfigEntity(CONFIGURATION_NAMES.HOME_INFOS_BANNER_DESC, desc),
            );
        } else {
            await configurationsPort.upsert(
                CONFIGURATION_NAMES.HOME_INFOS_BANNER_DESC,
                this.generateConfiguationEntity(bannerDesc, desc),
            );
        }
        return { title, desc };
    }

    async getMainInfoBanner(): Promise<MainInfoBannerDto> {
        const bannertitle = await configurationsPort.getByName<string>(CONFIGURATION_NAMES.HOME_INFOS_BANNER_TITLE);
        const bannerdesc = await configurationsPort.getByName<string>(CONFIGURATION_NAMES.HOME_INFOS_BANNER_DESC);
        return { title: bannertitle?.data || "", desc: bannerdesc?.data || "" };
    }
}

const configurationsService = new ConfigurationsService();

export default configurationsService;
