import { GeoDepartementDto, GeoRegionDto } from "dto";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import ProviderCore from "../ProviderCore";
import geoRepository from "../../../dataProviders/db/providers/geoApi/geo.port";
import { GeoEntity } from "./@types/geo.types";

export class GeoService extends ProviderCore {
    apiUrl = "https://geo.api.gouv.fr";

    constructor() {
        super({
            type: ProviderEnum.api,
            name: "geo.api",
            id: "geoApi",
            description:
                "Rechercher et localiser les communes, communes associées et déléguées, EPCI, départements et régions, et obtenez des informations les concernant",
        });
    }

    private async sendRequest<T>(path: string): Promise<T> {
        const result = await this.http.get<T>(`${this.apiUrl}${path}`);
        return result.data;
    }

    getAllDepartments() {
        return this.sendRequest<GeoDepartementDto[]>("/departements");
    }

    getAllRegions() {
        return this.sendRequest<GeoRegionDto[]>("/regions");
    }

    async generateAndSaveEntities() {
        const regionsMap = new Map<string, GeoRegionDto>();
        const [departments, _] = await Promise.all([
            this.getAllDepartments(),
            this.getAllRegions().then(regions =>
                regions.forEach((region: GeoRegionDto) => regionsMap.set(region.code, region)),
            ),
        ]);
        const entities: GeoEntity[] = departments
            .map(
                department =>
                    ({
                        departmentName: department.nom,
                        departmentCode: department.code,
                        regionCode: regionsMap.get(department.codeRegion)?.code,
                        regionName: regionsMap.get(department.codeRegion)?.nom,
                    } as GeoEntity),
            )
            .filter(almostEntity => almostEntity.regionCode && almostEntity.regionName);

        await geoRepository.deleteAll();
        await geoRepository.insertMany(entities);
    }

    async getRegionFromDepartment(departmentLabel: string | undefined) {
        if (!departmentLabel) return undefined;
        const departmentName = departmentLabel.match(/\d+ - (.+)/)?.[1];
        if (!departmentName) return undefined;
        const dbo = (await geoRepository.findByDepartmentName(departmentName)) || undefined;
        return dbo?.regionName;
    }
}

const geoService = new GeoService();
export default geoService;
