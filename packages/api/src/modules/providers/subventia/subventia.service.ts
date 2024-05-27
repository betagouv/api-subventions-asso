import { isAssociationName, areNumbersValid, isSiret, areStringsValid } from "../../../shared/Validators";
import { SubventiaRequestEntity } from "./entities/SubventiaRequestEntity";

export enum SUBVENTIA_SERVICE_ERROR {
    INVALID_ENTITY = 1,
}

export interface RejectedRequest {
    message: string;
    code: SUBVENTIA_SERVICE_ERROR;
    data?: unknown;
}

export interface AcceptedRequest {
    state: "created";
}

export class SubventiaService {
    validateEntity(entity: SubventiaRequestEntity): true | RejectedRequest {
        if (!isSiret(entity.legalInformations.siret)) {
            return {
                message: `INVALID SIRET FOR ${entity.legalInformations.siret}`,
                data: entity,
                code: SUBVENTIA_SERVICE_ERROR.INVALID_ENTITY,
            };
        }

        if (!isAssociationName(entity.legalInformations.name)) {
            return {
                message: `INVALID NAME FOR ${entity.legalInformations.siret}`,
                data: entity,
                code: SUBVENTIA_SERVICE_ERROR.INVALID_ENTITY,
            };
        }

        const strings = [
            entity.indexedInformations.status,
            entity.indexedInformations.description,
            entity.indexedInformations.financeurs,
        ];

        if (!areStringsValid(strings)) {
            return {
                message: `INVALID STRING FOR ${entity.legalInformations.siret}`,
                data: entity,
                code: SUBVENTIA_SERVICE_ERROR.INVALID_ENTITY,
            };
        }

        const numbers = [entity.indexedInformations.exerciceBudgetaire, entity.indexedInformations.budgetGlobal];

        if (!areNumbersValid(numbers)) {
            return {
                message: `INVALID NUMBER FOR ${entity.legalInformations.siret}`,
                data: entity,
                code: SUBVENTIA_SERVICE_ERROR.INVALID_ENTITY,
            };
        }

        return true;
    }

    async createEntity(entity: SubventiaRequestEntity): Promise<RejectedRequest | AcceptedRequest> {
        const valid = this.validateEntity(entity);

        if (valid !== true) return valid;

        return {
            state: "created",
        };
    }
}

const subventiaService = new SubventiaService();

export default subventiaService;
