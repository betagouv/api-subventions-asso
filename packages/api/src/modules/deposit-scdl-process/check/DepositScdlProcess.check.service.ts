import { CreateDepositScdlLogDto, DepositScdlLogDto } from "dto";
import { BadRequestError, ConflictError } from "core";
import Siret from "../../../identifierObjects/Siret";
import DepositScdlLogEntity from "../entities/depositScdlLog.entity";
import MiscScdlGrantEntity from "../../providers/scdl/entities/MiscScdlGrantEntity";
import scdlService from "../../providers/scdl/scdl.service";

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
            2: ["overwriteAlert", "allocatorSiret", "permissionAlert"],
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

    async finalCheckBeforePersist(depositLogEntity: DepositScdlLogEntity, filename: string) {
        const parsedInfos = depositLogEntity.uploadedFileInfos;

        if (!parsedInfos) {
            throw new BadRequestError("uploadedFileInfos must be defined");
        }

        if (depositLogEntity.step !== 2) {
            throw new BadRequestError("deposit must be in step 2");
        }

        if (depositLogEntity.overwriteAlert !== true) {
            throw new BadRequestError("overwrite alert must be acknowledged");
        }

        if (depositLogEntity.allocatorSiret === undefined) {
            throw new BadRequestError("allocator SIRET must be defined");
        }

        if (depositLogEntity.permissionAlert !== true) {
            throw new BadRequestError("permission alert must be acknowledged");
        }

        if (parsedInfos.fileName !== filename) {
            throw new BadRequestError(`filename mismatch: expected '${parsedInfos.fileName}', got '${filename}'`);
        }

        if (
            parsedInfos.allocatorsSiret.length > 1 ||
            parsedInfos.allocatorsSiret[0] !== depositLogEntity.allocatorSiret
        ) {
            throw new BadRequestError("allocator SIRET in file does not match deposit allocator SIRET");
        }

        const hasBlockingErrors = parsedInfos.errors.some(error => error.bloquant === "oui");
        if (hasBlockingErrors) {
            throw new BadRequestError("file contains blocking errors that must be resolved");
        }

        const documentsInDB: MiscScdlGrantEntity[] = await scdlService.getGrantsOnPeriodByAllocator(
            parsedInfos.allocatorsSiret[0],
            parsedInfos.grantCoverageYears,
        );

        if (documentsInDB.length > parsedInfos.parseableLines) {
            throw new BadRequestError("The file contains less rows of data than what we have in the database.");
        }

        if (documentsInDB.length !== parsedInfos.existingLinesInDbOnSamePeriod) {
            throw new ConflictError(
                "The number of lines in the database does not match with the one detected during the previous parse",
            );
        }
    }
}

const depositScdlProcessCheckService = new DepositScdlProcessCheckService();
export default depositScdlProcessCheckService;
