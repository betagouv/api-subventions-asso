import type { GeoRegionDto, GeoDepartementDto } from "./dto/GeoDepartementDto";
import requestsService from "$lib/services/requests.service";

export class GeoPort {
    BASE_PATH = "https://geo.api.gouv.fr";

    async getRegions(): Promise<GeoRegionDto[]> {
        return (await requestsService.get(this.BASE_PATH + "/regions")).data;
    }

    async getDepartments(): Promise<GeoDepartementDto[]> {
        return (await requestsService.get(this.BASE_PATH + "/departements")).data;
    }
}

const geoPort = new GeoPort();
export default geoPort;
