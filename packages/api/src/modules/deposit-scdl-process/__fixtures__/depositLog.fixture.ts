import DepositScdlLogEntity from "../depositScdlLog.entity";
import { CreateDepositScdlLogDto, DepositScdlLogDto } from "dto";
import DepositScdlLogDbo from "../../../dataProviders/db/deposit-log/DepositScdlLogDbo";
import { ObjectId } from "mongodb";

export const DEPOSIT_LOG_ENTITY: DepositScdlLogEntity = {
    userId: "68d6ab9b48ce4a950f7e96df",
    step: 1,
    updateDate: new Date("2025-09-26T00:00:00.000Z"),
    id: "id",
    overwriteAlert: true,
    grantOrgSiret: "12345678901234",
    permissionAlert: false,
};

export const DEPOSIT_LOG_DBO: DepositScdlLogDbo = {
    _id: new ObjectId("68d6ab9b48ce4a950f7e96df"),
    userId: "userId",
    updateDate: new Date("2025-09-26T00:00:00.000Z"),
    step: 1,
    overwriteAlert: true,
    grantOrgSiret: "12345678901234",
    permissionAlert: false,
};

export const DEPOSIT_LOG_DTO: DepositScdlLogDto = {
    overwriteAlert: true,
    grantOrgSiret: "12345678901234",
    permissionAlert: false,
};

export const CREATE_DEPOSIT_LOG_DTO: CreateDepositScdlLogDto = {
    overwriteAlert: true,
};
