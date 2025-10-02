import depositScdlProcessService from "../../modules/deposit-scdl-process/depositScdlProcess.service";
import { DepositScdlProcessHttp } from "./DepositScdlProcess.http";
import { IdentifiedRequest } from "../../@types";
import { ObjectId } from "mongodb";
import {
    CREATE_DEPOSIT_LOG_DTO,
    DEPOSIT_LOG_ENTITY,
    DEPOSIT_LOG_ENTITY_UPDATE,
    DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2,
    DEPOSIT_LOG_RESPONSE_DTO,
} from "../../modules/deposit-scdl-process/__fixtures__/depositLog.fixture";
import DepositScdlLogEntity from "../../modules/deposit-scdl-process/depositScdlLog.entity";
import { ConflictError, NotFoundError } from "core";

const controller = new DepositScdlProcessHttp();

describe("DepositScdlProcessHttp", () => {
    const REQ = { user: { _id: new ObjectId() } } as IdentifiedRequest;

    describe("getDepositLog", () => {
        const getDepositLogSpy = jest.spyOn(depositScdlProcessService, "getDepositLog");
        it("should call service with args", async () => {
            const depositScdlLog = {} as Promise<DepositScdlLogEntity>;
            getDepositLogSpy.mockReturnValueOnce(depositScdlLog);
            await controller.getDepositLog(REQ);
            expect(getDepositLogSpy).toHaveBeenCalledWith(REQ.user._id.toString());
        });

        it("should return depositLogDto", async () => {
            getDepositLogSpy.mockResolvedValueOnce(DEPOSIT_LOG_ENTITY_UPDATE);
            const result = await controller.getDepositLog(REQ);
            expect(result).toEqual(DEPOSIT_LOG_RESPONSE_DTO);
        });
    });

    describe("deleteDepositLog", () => {
        const deleteDepositLogSpy = jest.spyOn(depositScdlProcessService, "deleteDepositLog");
        it("should call service with args", async () => {
            deleteDepositLogSpy.mockReturnValueOnce(Promise.resolve());
            await controller.deleteDepositLog(REQ);
            expect(deleteDepositLogSpy).toHaveBeenCalledWith(REQ.user._id.toString());
        });

        it("should return null after deleting the deposit log", async () => {
            deleteDepositLogSpy.mockResolvedValueOnce(Promise.resolve());
            const result = await controller.deleteDepositLog(REQ);
            expect(result).toEqual(null);
        });
    });

    describe("createDepositLog", () => {
        const createDepositLogSpy = jest.spyOn(depositScdlProcessService, "createDepositLog");
        it("should call service with args", async () => {
            const depositScdlLog = {} as Promise<DepositScdlLogEntity>;
            createDepositLogSpy.mockReturnValueOnce(depositScdlLog);
            await controller.createDepositLog(CREATE_DEPOSIT_LOG_DTO, REQ);
            expect(createDepositLogSpy).toHaveBeenCalledWith(CREATE_DEPOSIT_LOG_DTO, REQ.user._id.toString());
        });

        it("should return CreateDepositLogDto", async () => {
            createDepositLogSpy.mockResolvedValueOnce(DEPOSIT_LOG_ENTITY);
            const result = await controller.createDepositLog(CREATE_DEPOSIT_LOG_DTO, REQ);
            expect(result).toEqual(CREATE_DEPOSIT_LOG_DTO);
        });

        it("should reject and throw ConcliftError when user has already a deposit in progress", async () => {
            createDepositLogSpy.mockRejectedValueOnce(new ConflictError("Deposit already exists"));
            await expect(controller.createDepositLog(CREATE_DEPOSIT_LOG_DTO, REQ)).rejects.toThrow(ConflictError);
        });
    });

    describe("updateDepositLog", () => {
        const STEP = 2;
        const updateDepositLogSpy = jest.spyOn(depositScdlProcessService, "updateDepositLog");

        it("should call service with args", async () => {
            const depositScdlLog = {} as Promise<DepositScdlLogEntity>;
            updateDepositLogSpy.mockReturnValueOnce(depositScdlLog);
            await controller.updateDepositLog(STEP, DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2, REQ);
            expect(updateDepositLogSpy).toHaveBeenCalledWith(
                STEP,
                DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2,
                REQ.user._id.toString(),
            );
        });

        it("should return DepositScdlLogResponseDto", async () => {
            updateDepositLogSpy.mockResolvedValueOnce(DEPOSIT_LOG_ENTITY_UPDATE);
            const result = await controller.updateDepositLog(STEP, DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2, REQ);
            expect(result).toEqual({
                step: STEP,
                overwriteAlert: true,
                grantOrgSiret: "12345678901234",
            });
        });

        it("should reject and throw Error when error throw by service", async () => {
            updateDepositLogSpy.mockRejectedValueOnce(new NotFoundError("an error"));
            await expect(controller.updateDepositLog(STEP, DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2, REQ)).rejects.toThrow(
                NotFoundError,
            );
        });
    });
});
