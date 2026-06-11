import { DemandeSubvention } from "dto";
import { StructureIdentifier } from "../../identifier-objects/@types/StructureIdentifier";
import applicationFlatService from "../application-flat/application-flat.service";

export class SubventionsService {
    getDemandes(id: StructureIdentifier) {
        return applicationFlatService.getApplication(id);
    }

    getSubventionExercise(application: DemandeSubvention) {
        return application?.annee_demande?.value;
    }
}

const subventionsService = new SubventionsService();

export default subventionsService;
