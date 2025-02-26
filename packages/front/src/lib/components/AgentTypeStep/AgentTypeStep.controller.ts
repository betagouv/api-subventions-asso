import type { AgentTypeEnum } from "dto";
import Store from "$lib/core/Store";
import Dispatch from "$lib/core/Dispatch";
import subscriptionFormService from "$lib/resources/auth/subscriptionForm/subscriptionFormService";
import type { Option } from "$lib/types/FieldOption";

export default class AgentTypeStepController {
    private static htmlErrorMessage =
        'Data.Subvention est réservé aux agents publics. Pour toute question, vous pouvez nous contacter à <a href="mailto:contact@datasubvention.beta.gouv.fr">contact@datasubvention.beta.gouv.fr</a>';

    private readonly dispatch: (_: string) => void;
    public readonly errorMessage: Store<string>;
    public readonly options: Option<AgentTypeEnum | "none">[] = subscriptionFormService.agentTypeOptions;

    constructor(context?: any) {
        this.dispatch = Dispatch.getDispatcher();
        this.errorMessage = new Store("");
        if (!context?.fromAC) {
            this.options = [
                ...this.options,
                {
                    label: "Aucune des propositions ci-dessus",
                    value: "none",
                },
            ];
        }
    }

    onUpdate(option: Option<AgentTypeEnum | "none">) {
        const error = option.value === "none";
        this.errorMessage.set(error ? AgentTypeStepController.htmlErrorMessage : "");
        this.dispatch(error ? "error" : "valid");
    }
}
