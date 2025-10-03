import DepositScdlLogEntity from "./depositScdlLog.entity";
import { CreateDepositScdlLogDto, DepositScdlLogDto, DepositScdlLogResponseDto } from "dto";

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
}
