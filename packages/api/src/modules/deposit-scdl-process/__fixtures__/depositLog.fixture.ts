import DepositScdlLogEntity from "../depositScdlLog.entity";
import { CreateDepositScdlLogDto, DepositScdlLogDto, DepositScdlLogResponseDto } from "dto";
import DepositScdlLogDbo from "../../../dataProviders/db/deposit-log/DepositScdlLogDbo";
import { ObjectId } from "mongodb";

export const DEPOSIT_LOG_ENTITY: DepositScdlLogEntity = {
    userId: "68d6ab9b48ce4a950f7e96df",
    step: 1,
    updateDate: new Date("2025-09-26T00:00:00.000Z"),
    overwriteAlert: true,
    allocatorSiret: "12345678901234",
    permissionAlert: false,
};

export const DEPOSIT_LOG_ENTITY_STEP_1: DepositScdlLogEntity = {
    userId: "68d6ab9b48ce4a950f7e96df",
    step: 1,
    updateDate: new Date("2025-09-26T00:00:00.000Z"),
    overwriteAlert: true,
    allocatorSiret: "12345678901234",
};

export const DEPOSIT_LOG_ENTITY_STEP_2: DepositScdlLogEntity = {
    userId: "68d6ab9b48ce4a950f7e96df",
    step: 2,
    updateDate: new Date("2025-09-26T00:00:00.000Z"),
    permissionAlert: true,
    allocatorSiret: "12345678901234",
    overwriteAlert: true,
};

export const DEPOSIT_LOG_DBO: DepositScdlLogDbo = {
    _id: new ObjectId("68d6ab9b48ce4a950f7e96df"),
    updateDate: new Date("2025-09-26T00:00:00.000Z"),
    userId: "userId",
    step: 1,
    overwriteAlert: true,
    permissionAlert: false,
    allocatorSiret: "12345678901234",
};

export const DEPOSIT_LOG_DTO: DepositScdlLogDto = {
    overwriteAlert: true,
    allocatorSiret: "12345678901234",
    permissionAlert: false,
};

export const CREATE_DEPOSIT_LOG_DTO: CreateDepositScdlLogDto = {
    overwriteAlert: true,
    allocatorSiret: "12345678901234",
};

export const DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2: DepositScdlLogDto = {
    permissionAlert: true,
};

export const DEPOSIT_LOG_RESPONSE_DTO: DepositScdlLogResponseDto = {
    step: 1,
    overwriteAlert: true,
    allocatorSiret: "12345678901234",
};

export const DEPOSIT_LOG_RESPONSE_DTO_STEP_2: DepositScdlLogResponseDto = {
    step: 2,
    overwriteAlert: true,
    allocatorSiret: "12345678901234",
    permissionAlert: true,
};
