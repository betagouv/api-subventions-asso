import { CreateDepositScdlLogDto } from "dto";
import { BadRequestError } from "core";

export class DepositScdlProcessCheckService {
    public validateCreate(dto: CreateDepositScdlLogDto) {
        if (!dto.overwriteAlert) {
            throw new BadRequestError("overwrite alert must be accepted");
        }
    }
}

const depositScdlProcessCheckService = new DepositScdlProcessCheckService();
export default depositScdlProcessCheckService;
