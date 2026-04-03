import { Controller, Get, Route, Tags, Response, Example, Hidden } from "tsoa";
import { AdminStructureDto, AdminTerritorialLevel, AgentTypeEnum } from "dto";
import { HttpErrorInterface } from "core";
import adminStructureService from "../../../modules/admin-structure/admin-structure.service";

@Route("/admin-structures")
@Hidden()
@Tags("Admin Structures Controller")
export class AdminStructureHttp extends Controller {
    /**
     * @summary Renvoie les structures administratives associées à un type d'agent
     * @returns {AdminStructureDto[]}
     */
    @Example<AdminStructureDto[]>([
        {
            agentType: AgentTypeEnum.CENTRAL_ADMIN,
            territorialLevel: AdminTerritorialLevel.REGIONAL,
            structure: "Agence Nationale de la Cohésion des Territoires (ANCT)",
        },
    ])
    @Get("/{agentType}")
    @Response<HttpErrorInterface>(500, "Internal Server Error", {
        message: "Internal Server Error",
    })
    public async getAdminStructureByAgentType(agentType: string): Promise<AdminStructureDto[]> {
        return adminStructureService.getAdminStructureByAgentType(agentType as AgentTypeEnum);
    }
}
