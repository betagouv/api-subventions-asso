import { Controller, Get, Route, Security, Tags, Response } from "tsoa";
import { AdminStructureDto, AgentTypeEnum } from "dto";
import { HttpErrorInterface } from "../../../../shared/errors/httpErrors/HttpError";
import adminStructureService from "../../adminStructure.service";

@Route("/admin-structures")
@Tags("Admin Structures Controller")
export class AdminStructureController extends Controller {
    /**
     * @summary Renvoie les structures administratives associées à un type d'agent
     * @returns {AdminStructureDto[]}
     */
    @Get("/{agentType}")
    @Response<HttpErrorInterface>(500, "Internal Server Error", {
        message: "Internal Server Error",
    })
    public async getAdminStructureByAgentType(agentType: string): Promise<AdminStructureDto[]> {
        return adminStructureService.getAdminStructureByAgentType(agentType as AgentTypeEnum);
    }
}
