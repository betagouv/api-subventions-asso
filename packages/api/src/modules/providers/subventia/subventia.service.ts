import { isAssociationName, isNumbersValid, isSiret, isStringsValid } from "../../../shared/Validators";
import { SubventiaRequestEntity } from "./entities/SubventiaRequestEntity";

export enum SUBVENTIA_SERVICE_ERROR {
    INVALID_ENTITY = 1
}

export interface RejectedRequest {
    success: false;
    message: string;
    code: SUBVENTIA_SERVICE_ERROR;
    data?: unknown;
}

export interface AcceptedRequest {
    success: true;
    state: "created";
}

export class SubventiaService {
    validateEntity(entity: SubventiaRequestEntity): { success: true } | RejectedRequest {
        if (!isSiret(entity.legalInformations.siret)) {
            return {
                success: false,
                message: `INVALID SIRET FOR ${entity.legalInformations.siret}`,
                data: entity,
                code: SUBVENTIA_SERVICE_ERROR.INVALID_ENTITY
            };
        }

        if (!isAssociationName(entity.legalInformations.name)) {
            return {
                success: false,
                message: `INVALID NAME FOR ${entity.legalInformations.siret}`,
                data: entity,
                code: SUBVENTIA_SERVICE_ERROR.INVALID_ENTITY
            };
        }

        const strings = [
            entity.indexedInformations.status,
            entity.indexedInformations.description,
            entity.indexedInformations.financeurs
        ];

        if (!isStringsValid(strings)) {
            return {
                success: false,
                message: `INVALID STRING FOR ${entity.legalInformations.siret}`,
                data: entity,
                code: SUBVENTIA_SERVICE_ERROR.INVALID_ENTITY
            };
        }

        const numbers = [entity.indexedInformations.exerciceBudgetaire, entity.indexedInformations.budgetGlobal];

        if (!isNumbersValid(numbers)) {
            return {
                success: false,
                message: `INVALID NUMBER FOR ${entity.legalInformations.siret}`,
                data: entity,
                code: SUBVENTIA_SERVICE_ERROR.INVALID_ENTITY
            };
        }

        return { success: true };
    }

    async createEntity(entity: SubventiaRequestEntity): Promise<RejectedRequest | AcceptedRequest> {
        const valid = this.validateEntity(entity);

        if (!valid.success) return valid;

        return {
            success: true,
            state: "created"
        };
    }
}

const subventiaService = new SubventiaService();

export default subventiaService;
