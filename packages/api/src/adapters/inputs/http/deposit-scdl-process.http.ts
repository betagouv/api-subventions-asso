import type { CreateDepositScdlLogDto, DepositScdlLogResponseDto, DepositScdlLogDto, FileDownloadUrlDto } from "dto";
import type { IdentifiedRequest } from "../../../@types";

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
    Example,
    Hidden,
} from "tsoa";
import DepositScdlLogDtoMapper from "../../../modules/deposit-scdl-process/deposit-scdl-log.dto.mapper";
import { depositScdlProcessService } from "../../../init-services";
import { fixFilenameEncoding } from "../../../shared/helpers/FileHelper";

@Route("/parcours-depot")
@Security("jwt")
@Hidden()
@Tags("Deposit Scdl Process Controller")
export class DepositScdlProcessHttp extends Controller {
    /**
     * @summary Récupère le journal de dépôt de l'utilisateur courant
     * @param req
     * @returns {DepositScdlLogResponseDto} 200 - The deposit log information for the authenticated user
     * @returns {void} 204 - No deposit log found for the user
     * @returns 401 - Unauthorized
     */
    @Example<DepositScdlLogResponseDto>({
        step: 2,
        allocatorSiret: "12345678900012",
        permissionAlert: false,
        uploadedFileInfos: {
            lineCountsByExercice: [{ exercice: 2025, parsedLines: 500, linesInDb: 400 }],
            fileName: "subventions_2023.csv",
            uploadDate: "2024-01-15T10:30:00.000Z" as unknown as Date,
            allocatorsSiret: ["12345678900012"],
            grantCoverageYears: [2023],
            parseableLines: 150,
            totalLines: 152,
            missingHeaders: { mandatory: [], optional: [] },
            existingLinesInDbOnSamePeriod: 50,
            errorStats: { count: 0, errorSample: [] },
        },
    })
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
     * @summary Génère un CSV des subventions SCDL existantes pour l'utilisateur courant
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
     * @summary Retourne l'URL de téléchargement du fichier en cours de dépôt
     * @param req
     * @returns {FileDownloadUrlDto} 200 - url content
     * @returns 401 - Unauthorized
     */
    @Example<FileDownloadUrlDto>({
        url: "https://storage.api-subventions.fr/scdl/deposit_12345678900012_2024-01-15.csv?token=abc123",
    })
    @Get("/fichier-depose/url-de-telechargement")
    @SuccessResponse("200", "url returned successfully")
    @Response("401", "Unauthorized")
    @Response("404", "Not found")
    public async getFileDownloadUrl(@Request() req: IdentifiedRequest): Promise<FileDownloadUrlDto> {
        const url = await depositScdlProcessService.getFileDownloadUrl(req.user._id.toString());
        return { url };
    }

    /**
     * @summary Supprime le journal de dépôt de l'utilisateur courant
     * @param req
     * @returns {void} 204 - Deposit log deleted successfully
     * @returns 401 - Unauthorized
     */
    @Delete("/")
    @Response("204")
    @Response("401", "Unauthorized")
    public async deleteDepositLog(@Request() req: IdentifiedRequest): Promise<void> {
        await depositScdlProcessService.deleteDepositLog(req.user._id.toString());
        this.setStatus(204);
    }

    /**
     * @summary Crée un journal de dépôt pour l'utilisateur courant
     * @param createDepositScdlLogDto
     * @param req
     * @returns {DepositScdlLogResponseDto} 201 - Deposit log created successfully
     * @returns 400 - Bad Request, invalid payload
     * @returns 401 - Unauthorized
     * @returns 409 - Conflict, a deposit process already exists
     */
    @Example<DepositScdlLogResponseDto>({ step: 1, allocatorSiret: "12345678900012" })
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
     * @summary Met à jour l'étape courante du journal de dépôt
     * @param step number step to update
     * @param depositScdlLogDto
     * @param req
     * @returns {DepositScdlLogResponseDto} 200 - Deposit log updated successfully to the next step
     * @returns 400 - Bad Request, invalid payload
     * @returns 401 - Unauthorized
     * @returns 404 - No deposit log found for this user
     * @returns 409 - Request conflicts with the current state of the deposit process
     */
    @Example<DepositScdlLogResponseDto>({ step: 3, allocatorSiret: "12345678900012" })
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
     * @summary Valide et analyse le fichier SCDL, met à jour le journal de dépôt
     *
     * @param file - The uploaded SCDL file to validate (CSV or Excel format)
     * @param depositScdlLogDto - dto containing uploaded file infos
     * @param req
     * @param pageName - Optional page name for excel file with multiple sheets
     *
     * @returns {DepositScdlLogResponseDto} 200 - Deposit log updated successfully with file parsing infos
     */
    @Example<DepositScdlLogResponseDto>({
        step: 2,
        allocatorSiret: "12345678900012",
        permissionAlert: false,
        uploadedFileInfos: {
            lineCountsByExercice: [{ exercice: 2025, parsedLines: 500, linesInDb: 400 }],
            fileName: "subventions_2023.csv",
            uploadDate: "2024-01-15T10:30:00.000Z" as unknown as Date,
            allocatorsSiret: ["12345678900012"],
            grantCoverageYears: [2023],
            parseableLines: 150,
            totalLines: 152,
            missingHeaders: { mandatory: [], optional: [] },
            existingLinesInDbOnSamePeriod: 50,
            errorStats: {
                count: 0,
                errorSample: [],
            },
        },
    })
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
        file.originalname = fixFilenameEncoding(file.originalname); // accented char pb: see if other way to fix this
        const updatedDepositLog = await depositScdlProcessService.validateScdlFile(
            file,
            parsedDto,
            req.user._id.toString(),
            pageName,
        );
        return DepositScdlLogDtoMapper.entityToDepositScdlLogResponseDto(updatedDepositLog);
    }

    /**
     * @summary Intègre le fichier SCDL en base et supprime le journal de dépôt
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
