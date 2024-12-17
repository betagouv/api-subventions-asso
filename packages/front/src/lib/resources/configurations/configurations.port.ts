import { MainInfoBannerDto } from "dto";
import requestsService from "$lib/services/requests.service";

class ConfigurationsPort {
    async getMainInfoBanner(): Promise<MainInfoBannerDto> {
        return (await requestsService.get(`config/main-info-banner`)).data;
    }
}

const configurationsPort = new ConfigurationsPort();

export default configurationsPort;
