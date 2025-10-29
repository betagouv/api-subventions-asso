import { CreateDepositScdlLogDto, DepositScdlLogDto } from "dto";
import { BadRequestError } from "core";
import Siret from "../../../identifierObjects/Siret";

export class DepositScdlProcessCheckService {
    public validateCreate(dto: CreateDepositScdlLogDto) {
        if (!dto.overwriteAlert) {
            throw new BadRequestError("overwrite alert must be accepted");
        }
        if (!Siret.isSiret(dto.allocatorSiret)) {
            throw new BadRequestError("allocatorSiret must be a valid SIRET");
        }
    }

    public validateUpdateConsistency(depositScdlLogDto: DepositScdlLogDto, step: number) {
        this.ensureExactPropertiesForStep(step, depositScdlLogDto);
        this.validateFields(depositScdlLogDto);
    }

    private ensureExactPropertiesForStep(step: number, depositScdlLogDto: DepositScdlLogDto) {
        const allowedPropsByStep: Record<number, (keyof DepositScdlLogDto)[]> = {
            1: ["overwriteAlert", "allocatorSiret"],
            2: ["permissionAlert"],
        };

        const allowedProps = allowedPropsByStep[step];
        if (!allowedProps) {
            throw new BadRequestError(`step ${step} is not supported`);
        }

        const dtoKeys = Object.entries(depositScdlLogDto)
            .filter(([_key, value]) => value !== undefined)
            .map(([key]) => key);

        const isPropertiesInconsistant =
            dtoKeys.length !== allowedProps.length ||
            !dtoKeys.every(key => allowedProps.includes(key as keyof DepositScdlLogDto));

        if (isPropertiesInconsistant) {
            throw new BadRequestError(`Step ${step} must contains this properties: ${allowedProps.join(", ")}`);
        }
    }

    private validateFields(depositScdlLogDto: DepositScdlLogDto) {
        if (depositScdlLogDto.overwriteAlert !== undefined) {
            if (!depositScdlLogDto.overwriteAlert) {
                throw new BadRequestError("overwriteAlert must be true");
            }
        }
        if (depositScdlLogDto.permissionAlert !== undefined) {
            if (!depositScdlLogDto.permissionAlert) {
                throw new BadRequestError("permissionAlert must be true");
            }
        }
        if (depositScdlLogDto.allocatorSiret !== undefined) {
            if (!Siret.isSiret(depositScdlLogDto.allocatorSiret)) {
                throw new BadRequestError("allocatorSiret must be a valid SIRET");
            }
        }
    }
}

const depositScdlProcessCheckService = new DepositScdlProcessCheckService();
export default depositScdlProcessCheckService;
