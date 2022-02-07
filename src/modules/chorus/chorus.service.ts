import { Siret } from "../../@types/Siret";
import { isEJ, isSiret } from "../../shared/Validators";
import ChorusLineEntity from "./entities/ChorusLineEntity";
import chorusLineRepository from "./repositories/chorus.line.repository";

export interface RejectedRequest {
    state: "rejected", result: { message: string, code: number, data: unknown }
}

export class ChorusService {

    public validateEntity(entity: ChorusLineEntity) {
        if (!["TD ASSOCIATION", "TI EP ASSO GIP"].includes(entity.indexedInformations.compte)) {
            return { success: false, message: `The comtpe ${entity.indexedInformations.compte} is not accepted in data`, data: entity }
        }

        if (isNaN(entity.indexedInformations.amount)) {
            return { success: false, message: `Amount is not a number`, data: entity }
        }

        if (!(entity.indexedInformations.dateOperation instanceof Date)) {
            return { success: false, message: `Operation date is not a valid date`, data: entity }
        }

        if (!isSiret(entity.indexedInformations.siret)) {
            return { success: false, message: `INVALID SIRET FOR ${entity.indexedInformations.siret}`, data: entity };
        }

        if (!isEJ(entity.indexedInformations.ej)) {
            return { success: false, message: `INVALID EJ FOR ${entity.indexedInformations.ej}`, data: entity };
        }

        return { success: true }
    }

    public async addChorusLine(entity: ChorusLineEntity) {
        if(!this.validateEntity(entity).success) {
            return {
                state: "rejected",
                result: this.validateEntity(entity)
            }
        }
        const datesAreOnSameDay = (first: Date, second: Date) =>
            first.getFullYear() === second.getFullYear() &&
            first.getMonth() === second.getMonth() &&
            first.getDate() === second.getDate();
            
        const alreadyExist = await chorusLineRepository.findByEJ(entity.indexedInformations.ej);

        if (
            !alreadyExist 
            || !datesAreOnSameDay(alreadyExist.indexedInformations.dateOperation, entity.indexedInformations.dateOperation) 
            || entity.indexedInformations.amount != alreadyExist.indexedInformations.amount
        ){  
            return {
                state: "created",
                result: await chorusLineRepository.create(entity),
            }
        }

        return {
            state: "updated",
            result: await chorusLineRepository.update(entity),
        }
    }

    public async findsBySiret(siret: Siret) {
        return chorusLineRepository.findsBySiret(siret);
    }
}

const chorusService = new ChorusService();

export default chorusService;