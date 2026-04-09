import DepositScdlLogEntity from "./entities/depositScdlLog.entity";
import {
    CreateDepositScdlLogDto,
    DepositScdlLogDto,
    DepositScdlLogResponseDto,
    MixedParsedErrorDto,
    UploadedFileInfosDto,
    ScdlErrorStatsDto,
} from "dto";
import UploadedFileInfosEntity from "./entities/uploadedFileInfos.entity";
import { MixedParsedError } from "../providers/scdl/@types/Validation";
import ScdlErrorStats from "./entities/ScdlErrorStats";

export default class DepositScdlLogDtoMapper {
    static entityToDepositScdlLogDto(entity: DepositScdlLogEntity): DepositScdlLogDto {
        return {
            allocatorSiret: entity.allocatorSiret,
            allocatorName: entity.allocatorName,
            permissionAlert: entity.permissionAlert,
        };
    }

    static entityToCreateDepositScdlLogDto(entity: DepositScdlLogEntity): CreateDepositScdlLogDto {
        return {
            allocatorSiret: entity.allocatorSiret,
        };
    }

    static entityToDepositScdlLogResponseDto(entity: DepositScdlLogEntity): DepositScdlLogResponseDto {
        return {
            allocatorSiret: entity.allocatorSiret,
            allocatorName: entity.allocatorName,
            permissionAlert: entity.permissionAlert,
            step: entity.step,
            uploadedFileInfos: entity.uploadedFileInfos
                ? this.entityUploadedFileInfosToDto(entity.uploadedFileInfos)
                : undefined,
        };
    }

    static entityUploadedFileInfosToDto(entity: UploadedFileInfosEntity): UploadedFileInfosDto {
        return {
            fileName: entity.fileName,
            uploadDate: entity.uploadDate,
            allocatorsSiret: entity.allocatorsSiret,
            grantCoverageYears: entity.grantCoverageYears,
            parseableLines: entity.parseableLines,
            totalLines: entity.totalLines,
            lineCountsByExercice: entity.lineCountsByExercice,
            missingHeaders: entity.missingHeaders,
            existingLinesInDbOnSamePeriod: entity.existingLinesInDbOnSamePeriod,
            errorStats: entity.errorStats,
            sheetName: entity.sheetName,
            processedExercices: entity.processedExercices,
        };
    }

    static depositScdlLogDtoToEntity(dto: DepositScdlLogDto, userId: string, step: number): DepositScdlLogEntity {
        return new DepositScdlLogEntity(
            userId,
            step,
            undefined,
            dto.allocatorSiret,
            dto.allocatorName,
            dto.permissionAlert,
        );
    }

    static createDepositScdlLogDtoToEntity(
        dto: CreateDepositScdlLogDto,
        allocatorName: string | undefined,
        userId: string,
        step: number,
    ): DepositScdlLogEntity {
        return new DepositScdlLogEntity(userId, step, undefined, dto.allocatorSiret, allocatorName);
    }

    static uploadedFileInfosDtoToEntity(dto: UploadedFileInfosDto): UploadedFileInfosEntity {
        return {
            fileName: dto.fileName,
            uploadDate: dto.uploadDate,
            allocatorsSiret: dto.allocatorsSiret,
            grantCoverageYears: dto.grantCoverageYears,
            parseableLines: dto.parseableLines,
            totalLines: dto.totalLines,
            lineCountsByExercice: dto.lineCountsByExercice,
            missingHeaders: dto.missingHeaders,
            existingLinesInDbOnSamePeriod: dto.existingLinesInDbOnSamePeriod,
            errorStats: this.scdlErrorStatsDtoToEntity(dto.errorStats),
            sheetName: dto.sheetName,
            processedExercices: dto.processedExercices,
        };
    }

    static scdlErrorStatsDtoToEntity(dto: ScdlErrorStatsDto): ScdlErrorStats {
        return {
            count: dto.count,
            errorSample: dto.errorSample?.map(error => this.mixedParsedErrorDtoToEntity(error)),
        };
    }

    static mixedParsedErrorDtoToEntity(dto: MixedParsedErrorDto): MixedParsedError {
        const { valeur, colonne, message, doublon, bloquant, ...otherProps } = dto;
        return {
            valeur,
            colonne,
            message,
            doublon,
            bloquant,
            ...otherProps,
        };
    }
}
