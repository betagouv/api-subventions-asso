import { DauphinTokenAvailableTime } from "./entities/DauphinTokenAvailableTimeDataEntity";
import { DauphinTokenDataEntity } from "./entities/DauphinTokenDataEntity";
import configurationsRepository from "./repositories/configurations.repository";

export class ConfigurationsService {

    getDauphinToken() {
        return configurationsRepository.getByName<DauphinTokenDataEntity>("DAUPHIN-TOKEN");
    }

    async setDauphinToken(token: string) {
        await configurationsRepository.upsert("DAUPHIN-TOKEN", { data: token });
    }

    getDauphinTokenAvailableTime() {
        return configurationsRepository.getByName<DauphinTokenAvailableTime>("DAUPHIN-TOKEN-AVAILABLE");
    }
}

const configurationsService = new ConfigurationsService();

export default configurationsService;