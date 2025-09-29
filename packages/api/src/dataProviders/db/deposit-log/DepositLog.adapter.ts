import DepositScdlLogDbo from "./DepositScdlLogDbo";
import { ObjectId } from "mongodb";
import DepositScdlLogEntity from "../../../modules/deposit-scdl-process/depositScdlLog.entity";
import { DepositScdlLogDto } from "dto";

export default class DepositLogAdapter {
    static dboToEntity(dbo: DepositScdlLogDbo | null): DepositScdlLogEntity | null {
        if (!dbo) {
            return null;
        }

        return new DepositScdlLogEntity(
            dbo.userId,
            dbo.step,
            dbo.updateDate,
            dbo._id.toString(),
            dbo.overwriteAlert,
            dbo.grantOrgSiret,
            dbo.permissionAlert,
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

    static entityToDto(entity: DepositScdlLogEntity | null): DepositScdlLogDto | null {
        // todo: deplacer dans un dtoAdapter ?
        if (!entity) {
            return null;
        }

        return {
            userId: entity.userId,
            step: entity.step,
            overwriteAlert: entity.overwriteAlert,
            grantOrgSiret: entity.grantOrgSiret,
            permissionAlert: entity.permissionAlert,
        };
    }
}
