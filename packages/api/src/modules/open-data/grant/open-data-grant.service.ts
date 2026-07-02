import { StructureIdentifier } from "../../../identifier-objects/@types/StructureIdentifier";
import rawGrantService from "../../grant/raw-grant.service";

class OpenDataGrantService {
    getByStructure(identifier: StructureIdentifier) {
        return rawGrantService.getCommonGrants(identifier, true);
    }
}

const openDataGrantService = new OpenDataGrantService();

export default openDataGrantService;
