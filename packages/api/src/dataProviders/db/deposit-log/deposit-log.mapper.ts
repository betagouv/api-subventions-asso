import DepositScdlLogDbo from "./@types/DepositScdlLogDbo";
import DepositScdlLogEntity from "../../../modules/deposit-scdl-process/entities/depositScdlLog.entity";

export default class DepositLogMapper {
    static dboToEntity(dbo: DepositScdlLogDbo): DepositScdlLogEntity {
        return new DepositScdlLogEntity(
            dbo.userId,
            dbo.step,
            dbo.updateDate,
            dbo.allocatorSiret,
            dbo.allocatorName,
            dbo.permissionAlert,
            dbo.uploadedFileInfos,
        );
    }

    static toDbo(entity: DepositScdlLogEntity): Omit<DepositScdlLogDbo, "_id"> {
        // @TODO: define updateDate on Entity creation, not DBO
        const updateDate = entity.updateDate ?? new Date();
        return {
            updateDate,
            userId: entity.userId,
            step: entity.step,
            permissionAlert: entity.permissionAlert,
            allocatorSiret: entity.allocatorSiret,
            allocatorName: entity.allocatorName,
            uploadedFileInfos: entity.uploadedFileInfos,
        };
    }
}
