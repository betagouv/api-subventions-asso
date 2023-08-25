import requestsService from "$lib/services/requests.service";

export class GeoPort {
    BASE_PATH = "https://geo.api.gouv.fr/";

    getRegions() {
        return requestsService.get(this.BASE_PATH + "/regions");
    }

    getDepartments() {
        return requestsService.get(this.BASE_PATH + "/departements");
    }
}

const geoPort = new GeoPort();
export default geoPort;
