import { StructureIdentifiers } from "dto";
import grantService from "../../grant/grant.service";

class OpenDataGrantService {
    getByStructure(identifier: StructureIdentifiers) {
        return grantService.getCommonGrants(identifier, true);
    }
}

const openDataGrantService = new OpenDataGrantService();

export default openDataGrantService;
