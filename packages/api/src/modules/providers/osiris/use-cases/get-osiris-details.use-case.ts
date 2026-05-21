import { OsirisDetails } from "dto";
import osirisActionAdapter from "../../../../adapters/outputs/db/providers/osiris/osiris.action.adapter";
import { OsirisActionPort } from "../../../../adapters/outputs/db/providers/osiris/osiris-action.port";

// Return most recent action as sometime the first years aren't filled properly
export default class GetOsirisDetailsUseCase {
    constructor(private actionPort: OsirisActionPort) {}

    async execute(osirisId: string): Promise<OsirisDetails> {
        const actions = await this.actionPort.findByOsirisId(osirisId);

        if (!actions.length) return { details: { actions: [] } };

        const latestYear = Math.max(...actions.map(a => a.dossier.exerciceBudgetaire));
        const latestActions = actions
            .filter(a => a.dossier.exerciceBudgetaire === latestYear)
            .filter(a => a.caracteristiques?.intitule)
            .map(a => ({
                intitule: a.caracteristiques!.intitule as string,
                description: a.caracteristiques?.description ?? "",
            }));

        return { details: { actions: latestActions } };
    }
}

const getOsirisDetailsUseCase = new GetOsirisDetailsUseCase(osirisActionAdapter);

export { getOsirisDetailsUseCase };
