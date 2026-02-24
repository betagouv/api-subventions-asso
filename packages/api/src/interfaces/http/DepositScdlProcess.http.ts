import type { CreateDepositScdlLogDto, DepositScdlLogResponseDto, DepositScdlLogDto, FileDownloadUrlDto } from "dto";
import type { IdentifiedRequest } from "../../@types";

import {
    Controller,
    Get,
    Route,
    Security,
    Tags,
    Response,
    SuccessResponse,
    Request,
    Delete,
    Post,
    Body,
    Patch,
    Path,
    UploadedFile,
    FormField,
} from "tsoa";
import DepositScdlLogDtoMapper from "../../modules/deposit-scdl-process/deposit-scdl-log.dto.mapper";
import { depositScdlProcessService } from "../../configurations/di-container";

@Route("/parcours-depot")
@Security("jwt")
@Tags("Deposit Scdl Process Controller")
export class DepositScdlProcessHttp extends Controller {
    /**
     * @summary Retrieves the deposit log information for the authenticated user if exists
     * @param req
     * @returns {DepositScdlLogResponseDto} 200 - The deposit log information for the authenticated user
     * @returns {void} 204 - No deposit log found for the user
     * @returns 401 - Unauthorized
     */
    @Get("/")
    @SuccessResponse("200", "Deposit log retrieved successfully")
    @Response("204", "No deposit log found for this user")
    @Response("401", "Unauthorized")
    public async getDepositLog(@Request() req: IdentifiedRequest): Promise<DepositScdlLogResponseDto | void> {
        const depositScdlLog = await depositScdlProcessService.getDepositLog(req.user._id.toString());
        if (!depositScdlLog) {
            this.setStatus(204);
            return;
        }
        return DepositScdlLogDtoMapper.entityToDepositScdlLogResponseDto(depositScdlLog);
    }

    /**
     * @summary return csv of SCDL grants associated with the allocator's SIRET and the exercise range of the SCDL file for the authenticated user
     * @param req
     * @returns {string} 200 - csv file content
     * @returns 401 - Unauthorized
     */
    @Get("/donnees-existantes")
    @SuccessResponse("200", "csv returned successfully")
    @Response("401", "Unauthorized")
    public async generateExistingGrantsCsv(@Request() req: IdentifiedRequest): Promise<string> {
        const { csv, fileName } = await depositScdlProcessService.generateExistingGrantsCsv(req.user._id.toString());

        this.setHeader("content-type", "text/csv; charset=utf-8");
        this.setHeader("content-disposition", `attachment; filename=${fileName}`);
        this.setHeader("Access-Control-Expose-Headers", "content-disposition");
        return csv;
    }

    /**
     * @summary return the presigned download url for the file currently being processed by the deposit process for the authenticated user
     * @param req
     * @returns {FileDownloadUrlDto} 200 - url content
     * @returns 401 - Unauthorized
     */
    @Get("/fichier-depose/url-de-telechargement")
    @SuccessResponse("200", "url returned successfully")
    @Response("401", "Unauthorized")
    @Response("404", "Not found")
    public async getFileDownloadUrl(@Request() req: IdentifiedRequest): Promise<FileDownloadUrlDto> {
        const url = await depositScdlProcessService.getFileDownloadUrl(req.user._id.toString());
        return { url };
    }

    /**
     * @summary Delete the deposit log information for the authenticated user if exists
     * @param req
     * @returns {void} 204 - Deposit log deleted successfully
     * @returns 401 - Unauthorized
     */
    @Delete("/")
    @Response("204", "no deposit log for this user")
    @Response("401", "Unauthorized")
    public async deleteDepositLog(@Request() req: IdentifiedRequest): Promise<void> {
        await depositScdlProcessService.deleteDepositLog(req.user._id.toString());
        this.setStatus(204);
    }

    /**
     * @summary Create a deposit log for the authenticated user
     * @param createDepositScdlLogDto
     * @param req
     * @returns {DepositScdlLogResponseDto} 201 - Deposit log created successfully
     * @returns 400 - Bad Request, invalid payload
     * @returns 401 - Unauthorized
     * @returns 409 - Conflict, a deposit process already exists
     */
    @Post("/")
    @SuccessResponse("201", "Deposit log created successfully")
    @Response("400", "Bad Request, invalid payload")
    @Response("401", "Unauthorized")
    @Response("409", "A deposit process already exists for this user")
    public async createDepositLog(
        @Body() createDepositScdlLogDto: CreateDepositScdlLogDto,
        @Request() req: IdentifiedRequest,
    ): Promise<DepositScdlLogResponseDto> {
        const newDepositLog = await depositScdlProcessService.createDepositLog(
            createDepositScdlLogDto,
            req.user._id.toString(),
        );
        this.setStatus(201);
        return DepositScdlLogDtoMapper.entityToDepositScdlLogResponseDto(newDepositLog);
    }

    /**
     * @summary update a deposit log for the authenticated user for current step
     * @param step number step to update
     * @param depositScdlLogDto
     * @param req
     * @returns {DepositScdlLogResponseDto} 200 - Deposit log updated successfully to the next step
     * @returns 400 - Bad Request, invalid payload
     * @returns 401 - Unauthorized
     * @returns 404 - No deposit log found for this user
     * @returns 409 - Request conflicts with the current state of the deposit process
     */
    @Patch("/step/{step}")
    @SuccessResponse("200", "Deposit log updated successfully to the next step")
    @Response("400", "Bad Request, invalid payload")
    @Response("401", "Unauthorized")
    @Response("404", "No deposit log found for this user")
    public async updateDepositLog(
        @Path() step: number,
        @Body() depositScdlLogDto: DepositScdlLogDto,
        @Request() req: IdentifiedRequest,
    ): Promise<DepositScdlLogResponseDto> {
        const updatedDepositLog = await depositScdlProcessService.updateDepositLog(
            step,
            depositScdlLogDto,
            req.user._id.toString(),
        );
        return DepositScdlLogDtoMapper.entityToDepositScdlLogResponseDto(updatedDepositLog);
    }

    /**
     * @summary validate scdl file with parsing and update deposit logs
     *
     * @param file - The uploaded SCDL file to validate (CSV or Excel format)
     * @param depositScdlLogDto - dto containing uploaded file infos
     * @param req
     * @param pageName - Optional page name for excel file with multiple sheets
     *
     * @returns {DepositScdlLogResponseDto} 200 - Deposit log updated successfully with file parsing infos
     */
    @Post("/validation-fichier-scdl")
    @SuccessResponse("200", "File processed and validation report generated")
    @Response("400", "Bad Request, invalid payload")
    @Response("401", "Unauthorized")
    @Response("404", "No deposit log found for this user")
    public async validateScdlFile(
        @UploadedFile() file: Express.Multer.File,
        @FormField() depositScdlLogDto: string,
        @Request() req: IdentifiedRequest,
        @FormField() pageName?: string,
    ): Promise<DepositScdlLogResponseDto> {
        const parsedDto = JSON.parse(depositScdlLogDto);
        const updatedDepositLog = await depositScdlProcessService.validateScdlFile(
            file,
            parsedDto,
            req.user._id.toString(),
            pageName,
        );
        return DepositScdlLogDtoMapper.entityToDepositScdlLogResponseDto(updatedDepositLog);
    }

    /**
     * @summary Parse and persist scdl file, then delete deposit log
     *
     * @param req
     *
     * @returns {void} 204
     */
    @Post("/depot-fichier-scdl")
    @SuccessResponse("204", "parse file successfully")
    @Response("400", "Bad Request, invalid payload")
    @Response("409", "Conflict, database state has changed since last parsing. Re-parsing required.")
    public async parseAndPersistScdlFile(@Request() req: IdentifiedRequest): Promise<void> {
        await depositScdlProcessService.parseAndPersistScdlFile(req.user);
        this.setStatus(204);
    }
}
