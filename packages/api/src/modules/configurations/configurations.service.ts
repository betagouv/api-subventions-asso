import { BadRequestError, ConflictError } from "../../shared/errors/httpErrors";
import { REGEX_MAIL_DOMAIN } from "../user/user.constant";
import { DauphinTokenAvailableTime } from "./entities/DauphinTokenAvailableTimeDataEntity";
import { DauphinTokenDataEntity } from "./entities/DauphinTokenDataEntity";
import configurationsRepository from "./repositories/configurations.repository";

export enum CONFIGURATION_NAMES {
    DAUPHIN_TOKEN = "DAUPHIN-TOKEN",
    DAUPHIN_TOKEN_AVAILABLE = "DAUPHIN-TOKEN-AVAILABLE",
    ACCEPTED_EMAIL_DOMAINS = "ACCEPTED-EMAIL-DOMAINS"
}

export class ConfigurationsService {
    createEmptyConfigEntity(name, defaultData) {
        return {
            name,
            data: defaultData,
            updatedAt: new Date()
        };
    }

    updateConfigEntity(entity, data) {
        return { ...entity, data, updatedAt: new Date() };
    }

    getDauphinToken() {
        return configurationsRepository.getByName<DauphinTokenDataEntity>(CONFIGURATION_NAMES.DAUPHIN_TOKEN);
    }

    async setDauphinToken(token: string) {
        await configurationsRepository.upsert(CONFIGURATION_NAMES.DAUPHIN_TOKEN, {
            data: token
        });
    }

    getDauphinTokenAvailableTime() {
        return configurationsRepository.getByName<DauphinTokenAvailableTime>(
            CONFIGURATION_NAMES.DAUPHIN_TOKEN_AVAILABLE
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

    async addEmailDomain(domain: string) {
        if (!this.isDomainValid(domain)) throw new BadRequestError();
        const document = await configurationsRepository.getByName<string[]>(CONFIGURATION_NAMES.ACCEPTED_EMAIL_DOMAINS);
        if (!document) {
            await configurationsRepository.upsert(
                CONFIGURATION_NAMES.ACCEPTED_EMAIL_DOMAINS,
                this.createEmptyConfigEntity(CONFIGURATION_NAMES.ACCEPTED_EMAIL_DOMAINS, [domain])
            );
            return domain;
        }
        if (document.data.includes(domain)) throw new ConflictError(ConfigurationsService.conflictErrorMessage);
        await configurationsRepository.upsert(
            CONFIGURATION_NAMES.ACCEPTED_EMAIL_DOMAINS,
            this.updateConfigEntity(document, [...document.data, domain])
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
        return persistedDomains.some(presistedDomain => domain.endsWith(presistedDomain));
    }
}

const configurationsService = new ConfigurationsService();

export default configurationsService;
