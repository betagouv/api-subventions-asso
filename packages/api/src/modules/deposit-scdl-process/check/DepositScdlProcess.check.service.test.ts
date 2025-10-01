import { CreateDepositScdlLogDto } from "dto";
import depositScdlProcessCheckService from "./DepositScdlProcess.check.service";
import { BadRequestError } from "core";

describe("DepositScdlProcess check service", () => {
    describe("validateCreate", () => {
        it("should accept valid data", () => {
            const dto: CreateDepositScdlLogDto = { overwriteAlert: true };

            const fn = () => depositScdlProcessCheckService.validateCreate(dto);

            expect(fn).not.toThrow();
        });

        it("should throw BadRequestError if overwriteAlert is false", () => {
            const dto: CreateDepositScdlLogDto = { overwriteAlert: false };

            const fn = () => depositScdlProcessCheckService.validateCreate(dto);

            expect(fn).toThrow(BadRequestError);
            expect(fn).toThrow("overwrite alert must be accepted");
        });
    });
});
