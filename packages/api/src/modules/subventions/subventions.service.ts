import { StructureIdentifier } from "../../@types";
import Flux from "../../shared/Flux";
import { demandesSubventionsProviders } from "../providers";
import { SubventionsFlux } from "./@types/SubventionsFlux";

export class SubventionsService {
    getDemandes(id: StructureIdentifier): Flux<SubventionsFlux> {
        const subventionsFlux = new Flux<SubventionsFlux>();
        const providers = demandesSubventionsProviders;

        const defaultMeta = {
            totalProviders: providers.length,
        };

        subventionsFlux.push({
            __meta__: defaultMeta,
        });

        let countAnswers = 0;

        providers.forEach(p =>
            p.getDemandeSubvention(id).then(subventions => {
                countAnswers++;

                subventionsFlux.push({
                    __meta__: { ...defaultMeta, provider: p.provider.name },
                    subventions: subventions || [],
                });

                if (countAnswers === providers.length) subventionsFlux.close();
            }),
        );

        return subventionsFlux;
    }
}

const subventionsService = new SubventionsService();

export default subventionsService;
