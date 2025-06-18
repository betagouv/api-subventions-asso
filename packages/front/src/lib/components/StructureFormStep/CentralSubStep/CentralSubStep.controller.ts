import { AgentTypeEnum } from "dto";
import Store from "$lib/core/Store";
import subscriptionFormService from "$lib/resources/auth/subscriptionForm/subscriptionForm.service";

export default class CentralSubStepController {
    public options: Store<{ value: string; label: string }[]>;

    constructor() {
        this.options = new Store([]);
    }

    async init(): Promise<void> {
        const structures = await subscriptionFormService.getStructures(AgentTypeEnum.CENTRAL_ADMIN);
        this.options.set(
            structures.map(structure => ({
                label: structure.structure,
                value: structure.structure,
            })),
        );
    }
}
