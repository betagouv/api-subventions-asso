import type { AgentTypeEnum } from "dto";
import Store from "$lib/core/Store";
import subscriptionFormService from "$lib/resources/auth/subscriptionForm/subscriptionFormService";

export default class CentralSubStepController {
    public options: Store<{ value: string; label: string }[]>;

    constructor() {
        this.options = new Store([]);
    }

    async init(agentType: AgentTypeEnum): Promise<void> {
        const structures = await subscriptionFormService.getStructures(agentType);
        this.options.set(
            structures.map(structure => ({
                label: structure.structure,
                value: structure.structure,
            })),
        );
    }
}
