import type { AmountsVsProgramRegionDto } from "dto";
import dataVizPort from "./dataViz.port";

class DataVizService {
    async getAmountsVsProgramRegion(): Promise<AmountsVsProgramRegionDto[]> {
        try {
            return await dataVizPort.getAmountsVsProgramRegion();
        } catch (e) {
            console.error(e);
            throw new Error("Aucune donnée trouvée");
        }
    }
}

const dataVizService = new DataVizService();

export default dataVizService;
