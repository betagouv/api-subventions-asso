import type { AdminStructureDto, AgentTypeEnum } from "dto";
import requestsService from "$lib/services/requests.service";

export class SubscriptionFormPort {
    async getStructures(agentType: AgentTypeEnum): Promise<AdminStructureDto[]> {
        const path = `admin-structures/${agentType}`;
        const result = await requestsService.get(path);
        return result?.data || [];
    }
}

const subscriptionFormPort = new SubscriptionFormPort();
export default subscriptionFormPort;
