import DepositScdlLogDbo from "./DepositScdlLogDbo";
import { ObjectId } from "mongodb";
import DepositScdlLogEntity from "../../../modules/deposit-scdl-process/depositScdlLog.entity";
import { CreateDepositScdlLogDto, DepositScdlLogDto } from "dto";

export default class DepositLogAdapter {
    static dboToEntity(dbo: DepositScdlLogDbo): DepositScdlLogEntity {
        return new DepositScdlLogEntity(
            dbo.userId,
            dbo.step,
            dbo.updateDate,
            dbo.overwriteAlert,
            dbo.permissionAlert,
            dbo._id.toString(),
            dbo.grantOrgSiret,
        );
    }

    static toDbo(entity: DepositScdlLogEntity): DepositScdlLogDbo {
        // todo : pq Omit<DepositScdlLogEntity, "id"> ne fonctionne pas ?
        return {
            _id: new ObjectId(),
            userId: entity.userId,
            updateDate: entity.updateDate ?? new Date(),
            step: entity.step,
            overwriteAlert: entity.overwriteAlert,
            grantOrgSiret: entity.grantOrgSiret,
            permissionAlert: entity.permissionAlert,
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

    static depositScdlLogDtoToEntity(dto: DepositScdlLogDto, userId: string, step: number): DepositScdlLogEntity {
        return new DepositScdlLogEntity(
            userId,
            step,
            undefined,
            dto.overwriteAlert,
            dto.permissionAlert,
            undefined,
            dto.grantOrgSiret,
        );
    }

    static createDepositScdlLogDtoToEntity(
        dto: CreateDepositScdlLogDto,
        userId: string,
        step: number,
    ): DepositScdlLogEntity {
        return new DepositScdlLogEntity(userId, step, undefined, dto.overwriteAlert, false);
    }
}
