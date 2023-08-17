import { Controller, Get, Route, Security, Tags, Response } from "tsoa";
import { AgentTypeEnum } from "@api-subventions-asso/dto";
import { HttpErrorInterface } from "../../../../shared/errors/httpErrors/HttpError";
import adminStructureService from "../../adminStructure.service";
import AdminStructureEntity from "../../entities/AdminStructureEntity";

@Route("/admin-structures")
@Security("jwt")
@Tags("Admin Structures Controller")
export class AdminStructureController extends Controller {
    /**
     * @summary Renvoie les structures administratives associées à un type d'agent
     * @returns {AdminStructureEntity[]}
     */
    @Get("/{agentType}")
    @Response<HttpErrorInterface>(500, "Internal Server Error", {
        message: "Internal Server Error",
    })
    public async getAdminStructureByAgentType(agentType: string): Promise<AdminStructureEntity[]> {
        return adminStructureService.getAdminStructureByAgentType(agentType as AgentTypeEnum);
    }
}
