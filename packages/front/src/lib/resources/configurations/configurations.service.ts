import { MainInfoBannerDto } from "dto";
import configurationsPort from "./configurations.port";

class ConfigurationsService {
    async getMainInfoBanner(): Promise<MainInfoBannerDto> {
        const result = await configurationsPort.getMainInfoBanner();
        if (!result) return {};

        return result;
    }
}

const configurationsService = new ConfigurationsService();

export default configurationsService;
