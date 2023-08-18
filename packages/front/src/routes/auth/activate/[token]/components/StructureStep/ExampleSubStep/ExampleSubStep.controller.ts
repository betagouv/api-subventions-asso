import type { AgentTypeEnum } from "@api-subventions-asso/dto";
import Store from "$lib/core/Store";
import subscriptionFormService from "$lib/resources/auth/subscriptionForm/subscriptionFormService";

export default class ExampleSubStepController {
    private options: Store<{ value: string; label: string }[]>;

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
