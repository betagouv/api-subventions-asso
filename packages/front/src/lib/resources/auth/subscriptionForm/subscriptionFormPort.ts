import type { AgentTypeEnum } from "@api-subventions-asso/dto";
import requestsService from "$lib/services/requests.service";

export class SubscriptionFormPort {
    async getStructures(agentType: AgentTypeEnum) {
        const path = `admin-structures/${agentType}`;
        const result = await requestsService.get(path);
        return result?.data || [];
    }
}

const subscriptionFormPort = new SubscriptionFormPort();
export default subscriptionFormPort;
