import type { AgentTypeEnum } from "dto";
import Store from "$lib/core/Store";
import Dispatch from "$lib/core/Dispatch";
import subscriptionFormService from "$lib/resources/auth/subscriptionForm/subscriptionFormService";

type Option = {
    value: AgentTypeEnum | "none";
    label: string;
};

export default class AgentTypeStepController {
    private static htmlErrorMessage =
        'Data.Subvention est réservé aux agents publics. Pour toute question, vous pouvez nous contacter à <a href="mailto:contact@datasubvention.beta.gouv.fr">contact@datasubvention.beta.gouv.fr</a>';

    private readonly dispatch: (_: string) => void;
    public readonly errorMessage: Store<string>;
    public readonly options: Option[] = [
        ...subscriptionFormService.agentTypeOptions,
        {
            label: "Aucune des propositions ci-dessus",
            value: "none",
        },
    ];

    constructor() {
        this.dispatch = Dispatch.getDispatcher();
        this.errorMessage = new Store("");
    }

    onUpdate(option: Option) {
        const error = option.value === "none";
        this.errorMessage.set(error ? AgentTypeStepController.htmlErrorMessage : "");
        this.dispatch(error ? "error" : "valid");
    }
}
