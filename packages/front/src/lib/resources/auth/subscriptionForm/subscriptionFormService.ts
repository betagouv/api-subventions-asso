import type { AgentTypeEnum } from "dto";
import subscriptionFormPort from "$lib/resources/auth/subscriptionForm/subscriptionFormPort";

export class SubscriptionFormService {
    getStructures(agentType: AgentTypeEnum) {
        return subscriptionFormPort.getStructures(agentType);
    }
}

const subscriptionFormService = new SubscriptionFormService();
export default subscriptionFormService;
