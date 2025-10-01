import { Controller, Get, Route, Security, Tags, Response, SuccessResponse, Request, Delete, Post, Body } from "tsoa";
import { IdentifiedRequest } from "../../@types";
import depositScdlProcessService from "../../modules/deposit-scdl-process/depositScdlProcess.service";
import { DepositScdlLogDto, CreateDepositScdlLogDto } from "dto";
import DepositLogAdapter from "../../dataProviders/db/deposit-log/DepositLog.adapter";

@Route("/parcours-depot")
@Security("jwt")
@Tags("Deposit Scdl Process Controller")
export class DepositScdlProcessHttp extends Controller {
    /**
     * @summary Retrieves the deposit log information for the authenticated user if exists
     * @returns {DepositScdlLogDto} 200 - The deposit log information for the authenticated user
     * @returns {null} 204 - No deposit log found for the user
     * @returns 401 - Unauthorized
     */
    @Get("/")
    @SuccessResponse("200", "Deposit log retrieved successfully")
    @Response("204", "No deposit log found for this user")
    @Response("401", "Unauthorized")
    public async getDepositLog(@Request() req: IdentifiedRequest): Promise<DepositScdlLogDto | null> {
        const depositScdlLog = await depositScdlProcessService.getDepositLog(req.user._id.toString());
        if (!depositScdlLog) {
            this.setStatus(204);
            return null;
        }
        return DepositLogAdapter.entityToDepositScdlLogDto(depositScdlLog);
    }

    /**
     * @summary Delete the deposit log information for the authenticated user if exists
     * @returns {null} 204 - Deposit log deleted successfully
     * @returns 401 - Unauthorized
     */
    @Delete("/")
    @Response("204", "no deposit log for this user")
    @Response("401", "Unauthorized")
    public async deleteDepositLog(@Request() req: IdentifiedRequest): Promise<null> {
        await depositScdlProcessService.deleteDepositLog(req.user._id.toString());
        this.setStatus(204);
        return null;
    }

    /**
     * @summary Create a deposit log for the authenticated user
     * @returns {DepositScdlLogDto} 201 - Deposit log created successfully
     * @returns 400 - Bad Request, invalid payload
     * @returns 401 - Unauthorized
     * @returns 409 - Conflict, a deposit process already exists
     */
    @Post("/")
    @SuccessResponse("201", "Deposit log created successfully")
    @Response("400", "Bad Request, invalid payload")
    @Response("401", "Unauthorized")
    @Response("409", "A déposit process already exists for this user")
    public async createDepositLog(
        @Body() createDepositScdlLogDto: CreateDepositScdlLogDto,
        @Request() req: IdentifiedRequest,
    ): Promise<CreateDepositScdlLogDto> {
        const newDepositLog = await depositScdlProcessService.createDepositLog(
            createDepositScdlLogDto,
            req.user._id.toString(),
        );
        this.setStatus(201);
        return DepositLogAdapter.entityToCreateDepositScdlLogDto(newDepositLog);
    }
}
