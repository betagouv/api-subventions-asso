import type { AmountsVsProgramRegionDto } from "dto";
import requestsService from "$lib/services/requests.service";

class DataVizPort {
    getResource(resource: string) {
        return requestsService.get(`/dataviz/${resource}`);
    }

    async getAmountsVsProgramRegion(): Promise<AmountsVsProgramRegionDto[]> {
        const result = (await this.getResource("montant-versus-programme-region"))?.data.amountsVersusProgramRegionData;
        if (!result || result.length === 0) {
            throw new Error("No data found");
        }
        return result;
    }
}

const dataVizPort = new DataVizPort();

export default dataVizPort;
