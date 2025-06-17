import { StructureIdentifier } from "../../../identifierObjects/@types/StructureIdentifier";
import grantService from "../../grant/grant.service";

class OpenDataGrantService {
    getByStructure(identifier: StructureIdentifier) {
        return grantService.getCommonGrants(identifier, true);
    }
}

const openDataGrantService = new OpenDataGrantService();

export default openDataGrantService;
