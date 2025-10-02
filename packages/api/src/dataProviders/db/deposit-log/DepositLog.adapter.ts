import DepositScdlLogDbo from "./DepositScdlLogDbo";
import DepositScdlLogEntity from "../../../modules/deposit-scdl-process/depositScdlLog.entity";
import { CreateDepositScdlLogDto, DepositScdlLogDto, DepositScdlLogResponseDto } from "dto";

export default class DepositLogAdapter {
    static dboToEntity(dbo: DepositScdlLogDbo): DepositScdlLogEntity {
        return new DepositScdlLogEntity(
            dbo.userId,
            dbo.step,
            dbo.updateDate,
            dbo.overwriteAlert,
            dbo.grantOrgSiret,
            dbo.permissionAlert,
        );
    }

    static toDbo(entity: DepositScdlLogEntity): Omit<DepositScdlLogDbo, "_id"> {
        return {
            updateDate: new Date(),
            userId: entity.userId,
            step: entity.step,
            overwriteAlert: entity.overwriteAlert,
            permissionAlert: entity.permissionAlert,
            grantOrgSiret: entity.grantOrgSiret,
        };
    }

    static entityToDepositScdlLogDto(entity: DepositScdlLogEntity): DepositScdlLogDto {
        // todo: deplacer dans un dtoAdapter ?
        return {
            overwriteAlert: entity.overwriteAlert,
            grantOrgSiret: entity.grantOrgSiret,
            permissionAlert: entity.permissionAlert,
        };
    }

    static entityToCreateDepositScdlLogDto(entity: DepositScdlLogEntity): CreateDepositScdlLogDto {
        // todo: deplacer dans un dtoAdapter ?
        return {
            overwriteAlert: entity.overwriteAlert,
        };
    }

    static entityToDepositScdlLogResponseDto(entity: DepositScdlLogEntity): DepositScdlLogResponseDto {
        return {
            overwriteAlert: entity.overwriteAlert,
            grantOrgSiret: entity.grantOrgSiret,
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
            dto.grantOrgSiret,
            dto.permissionAlert,
        );
    }

    static createDepositScdlLogDtoToEntity(
        dto: CreateDepositScdlLogDto,
        userId: string,
        step: number,
    ): DepositScdlLogEntity {
        return new DepositScdlLogEntity(userId, step, undefined, dto.overwriteAlert);
    }
}
