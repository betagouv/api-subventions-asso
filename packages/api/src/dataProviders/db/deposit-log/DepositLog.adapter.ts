import DepositScdlLogDbo from "./DepositScdlLogDbo";
import DepositScdlLogEntity from "../../../modules/deposit-scdl-process/depositScdlLog.entity";

export default class DepositLogAdapter {
    static dboToEntity(dbo: DepositScdlLogDbo): DepositScdlLogEntity {
        return new DepositScdlLogEntity(
            dbo.userId,
            dbo.step,
            dbo.updateDate,
            dbo.overwriteAlert,
            dbo.allocatorSiret,
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
            allocatorSiret: entity.allocatorSiret,
        };
    }
}
