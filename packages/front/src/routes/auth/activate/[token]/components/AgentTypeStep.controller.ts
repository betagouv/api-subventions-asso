import { AgentTypeEnum } from "@api-subventions-asso/dto";
import Store, { derived, ReadStore } from "$lib/core/Store";
import Dispatch from "$lib/core/Dispatch";

type Option = {
    value: AgentTypeEnum | "none";
    label: string;
    hint?: string;
};

export default class AgentTypeStepController {
    private static errorMessage =
        'Data.Subvention est réservé aux agents publics. Pour toute question, vous pouvez nous contacter à <a href="mailto:contact@datasubvention.beta.gouv.fr">contact@datasubvention.beta.gouv.fr</a>';

    private readonly dispatch: (_: string) => void;
    private readonly showNoneMessage: Store<boolean>;
    private readonly options: ReadStore<Option[]>;

    constructor() {
        this.dispatch = Dispatch.getDispatcher();
        this.showNoneMessage = new Store<boolean>(false);
        this.options = derived(this.showNoneMessage, show => [
            { value: AgentTypeEnum.CENTRAL_ADMIN, label: "Agent public d’une administration centrale (État)" },
            {
                value: AgentTypeEnum.DECONCENTRATED_ADMIN,
                label: "Agent public d’une administration déconcentrée (État)",
            },
            { value: AgentTypeEnum.TERRITORIAL_COLLECTIVITY, label: "Agent public d’une collectivité territoriale" },
            { value: AgentTypeEnum.OPERATOR, label: "Agent public d’un opérateur de l’État" },
            {
                value: "none",
                label: "Aucune des propositions ci-dessus",
                hint: show ? AgentTypeStepController.errorMessage : undefined,
            },
        ]);
    }

    onUpdate(option: Option) {
        const error = option.value === "none";
        this.showNoneMessage.set(error);
        this.dispatch(error ? "error" : "valid");
    }
}
