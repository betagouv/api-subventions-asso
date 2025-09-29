import { Controller, Get, Route, Security, Tags, Response, SuccessResponse, Request } from "tsoa";
import { IdentifiedRequest } from "../../@types";
import depositScdlProcessService from "../../modules/deposit-scdl-process/depositScdlProcess.service";
import { DepositScdlLogDto } from "dto";
import DepositLogAdapter from "../../dataProviders/db/deposit-log/DepositLog.adapter";

@Route("/parcours-depot")
@Security("jwt")
@Tags("Deposit Scdl Process Controller")
export class DepositScdlProcessHttp extends Controller {
    /**
     * @summary Retrieves the deposit log information for the authenticated user if exists
     * @returns {DepositScdlLogDto} - The deposit log information for the authenticated user
     * @returns {null} 204 - No deposit log found for the user
     */
    @Get("/")
    @SuccessResponse("200", "Deposit log retrieved successfully")
    @Response("204", "No deposit log found for this user")
    @Response("401", "Unauthorized")
    public async getDepositState(@Request() req: IdentifiedRequest): Promise<DepositScdlLogDto | null> {
        const depositScdlLog = await depositScdlProcessService.getDepositState(req.user._id.toString());
        if (!depositScdlLog) {
            this.setStatus(204);
            return null;
        }
        return DepositLogAdapter.entityToDto(depositScdlLog);
    }
}
