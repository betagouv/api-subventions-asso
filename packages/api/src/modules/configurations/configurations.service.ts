import { DauphinTokenAvailableTime } from "./entities/DauphinTokenAvailableTimeDataEntity";
import { DauphinTokenDataEntity } from "./entities/DauphinTokenDataEntity";
import configurationsRepository from "./repositories/configurations.repository";

export enum CONFIGURATION_NAMES {
    DAUPHIN_TOKEN = "DAUPHIN-TOKEN",
    DAUPHIN_TOKEN_AVAILABLE = "DAUPHIN-TOKEN-AVAILABLE",
    ACCEPTED_EMAIL_DOMAINS = "ACCEPTED-EMAIL-DOMAINS"
}

export class ConfigurationsService {
    getDauphinToken() {
        return configurationsRepository.getByName<DauphinTokenDataEntity>(CONFIGURATION_NAMES.DAUPHIN_TOKEN);
    }

    async setDauphinToken(token: string) {
        await configurationsRepository.upsert(CONFIGURATION_NAMES.DAUPHIN_TOKEN, { data: token });
    }

    getDauphinTokenAvailableTime() {
        return configurationsRepository.getByName<DauphinTokenAvailableTime>(
            CONFIGURATION_NAMES.DAUPHIN_TOKEN_AVAILABLE
        );
    }
}

const configurationsService = new ConfigurationsService();

export default configurationsService;
