import geoPort from "./geo.port";

class GeoService {
    getRegions() {
        return geoPort.getRegions();
    }
    getDepartements() {
        return geoPort.getDepartments();
    }
}

const geoService = new GeoService();
export default geoService;
