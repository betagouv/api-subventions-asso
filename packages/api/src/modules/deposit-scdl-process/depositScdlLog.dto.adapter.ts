import DepositScdlLogEntity from "./entities/depositScdlLog.entity";
import {
    CreateDepositScdlLogDto,
    DepositScdlLogDto,
    DepositScdlLogResponseDto,
    MixedParsedErrorDto,
    UploadedFileInfosDto,
} from "dto";
import UploadedFileInfosEntity from "./entities/uploadedFileInfos.entity";
import { MixedParsedError } from "../providers/scdl/@types/Validation";

export default class DepositScdlLogDtoAdapter {
    static entityToDepositScdlLogDto(entity: DepositScdlLogEntity): DepositScdlLogDto {
        return {
            overwriteAlert: entity.overwriteAlert,
            allocatorSiret: entity.allocatorSiret,
            permissionAlert: entity.permissionAlert,
        };
    }

    static entityToCreateDepositScdlLogDto(entity: DepositScdlLogEntity): CreateDepositScdlLogDto {
        return {
            overwriteAlert: entity.overwriteAlert,
            allocatorSiret: entity.allocatorSiret,
        };
    }

    static entityToDepositScdlLogResponseDto(entity: DepositScdlLogEntity): DepositScdlLogResponseDto {
        return {
            overwriteAlert: entity.overwriteAlert,
            allocatorSiret: entity.allocatorSiret,
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
            allocatorSiret: entity.allocatorSiret,
            errors: entity.errors,
            beginPaymentDate: entity.beginPaymentDate,
            endPaymentDate: entity.endPaymentDate,
            parseableLines: entity.parseableLines,
            existingLinesInDbOnSamePeriod: entity.existingLinesInDbOnSamePeriod,
        };
    }

    static depositScdlLogDtoToEntity(dto: DepositScdlLogDto, userId: string, step: number): DepositScdlLogEntity {
        return new DepositScdlLogEntity(
            userId,
            step,
            undefined,
            dto.overwriteAlert,
            dto.allocatorSiret,
            dto.permissionAlert,
        );
    }

    static createDepositScdlLogDtoToEntity(
        dto: CreateDepositScdlLogDto,
        userId: string,
        step: number,
    ): DepositScdlLogEntity {
        return new DepositScdlLogEntity(userId, step, undefined, dto.overwriteAlert, dto.allocatorSiret);
    }

    static uploadedFileInfosDtoToEntity(dto: UploadedFileInfosDto): UploadedFileInfosEntity {
        return {
            fileName: dto.fileName,
            uploadDate: dto.uploadDate,
            allocatorSiret: dto.allocatorSiret,
            errors: dto.errors?.map(error => this.mixedParsedErrorDtoToEntity(error)),
            beginPaymentDate: dto.beginPaymentDate,
            endPaymentDate: dto.endPaymentDate,
            parseableLines: dto.parseableLines,
            existingLinesInDbOnSamePeriod: dto.existingLinesInDbOnSamePeriod,
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
