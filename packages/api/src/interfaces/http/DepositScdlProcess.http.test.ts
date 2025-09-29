import depositScdlProcessService from "../../modules/deposit-scdl-process/depositScdlProcess.service";
import { DepositScdlProcessHttp } from "./DepositScdlProcess.http";
import { IdentifiedRequest } from "../../@types";
import { ObjectId } from "mongodb";
import {
    DEPOSIT_LOG_DTO,
    DEPOSIT_LOG_ENTITY,
} from "../../modules/deposit-scdl-process/__fixtures__/depositLog.fixture";
import DepositScdlLogEntity from "../../modules/deposit-scdl-process/depositScdlLog.entity";

const controller = new DepositScdlProcessHttp();

describe("DepositScdlProcessHttp", () => {
    const REQ = { user: { _id: new ObjectId() } } as IdentifiedRequest;

    describe("getDepositState", () => {
        const getDepositStateSpy = jest.spyOn(depositScdlProcessService, "getDepositState");
        it("should call service with args", async () => {
            const depositScdlLog = {} as Promise<DepositScdlLogEntity>;
            getDepositStateSpy.mockReturnValueOnce(depositScdlLog);
            await controller.getDepositState(REQ);
            expect(getDepositStateSpy).toHaveBeenCalledWith(REQ.user._id.toString());
        });

        it("should return deposit state dto", async () => {
            getDepositStateSpy.mockResolvedValueOnce(DEPOSIT_LOG_ENTITY);
            const result = await controller.getDepositState(REQ);
            expect(result).toEqual(DEPOSIT_LOG_DTO);
        });
    });
});
