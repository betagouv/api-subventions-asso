import { DemandeSubvention } from "dto";
import { demandesSubventionsProviders } from "../providers";
import { StructureIdentifier } from "../../identifierObjects/@types/StructureIdentifier";

export class SubventionsService {
    getDemandes(id: StructureIdentifier) {
        const providers = demandesSubventionsProviders;
        return Promise.all(
            providers.reduce(
                (promises, provider) => {
                    promises.push(provider.getDemandeSubvention(id));
                    return promises;
                },
                [] as Promise<DemandeSubvention[]>[],
            ),
        );
    }

    getSubventionExercise(application: DemandeSubvention) {
        return application?.annee_demande?.value;
    }
}

const subventionsService = new SubventionsService();

export default subventionsService;
