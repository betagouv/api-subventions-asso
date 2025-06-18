import { AgentTypeEnum } from "dto";
import subscriptionFormPort from "$lib/resources/auth/subscriptionForm/subscriptionForm.port";

export class SubscriptionFormService {
    public agentTypeOptions = [
        { value: AgentTypeEnum.CENTRAL_ADMIN, label: "Agent public d’une administration centrale (État)" },
        {
            value: AgentTypeEnum.DECONCENTRATED_ADMIN,
            label: "Agent public d’une administration déconcentrée (État)",
        },
        { value: AgentTypeEnum.TERRITORIAL_COLLECTIVITY, label: "Agent public d’une collectivité territoriale" },
        { value: AgentTypeEnum.OPERATOR, label: "Agent public d’un opérateur de l’État" },
    ];

    getStructures(agentType: AgentTypeEnum) {
        return subscriptionFormPort.getStructures(agentType);
    }
}

const subscriptionFormService = new SubscriptionFormService();
export default subscriptionFormService;
