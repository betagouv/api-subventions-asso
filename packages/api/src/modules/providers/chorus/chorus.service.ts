import { Siren, Siret } from "../../../@types";
import { ASSO_BRANCHE, BRANCHE_ACCEPTED } from "../../../shared/ChorusBrancheAccepted";
import { siretToSiren } from "../../../shared/helpers/SirenHelper";
import { isEJ, isSiret } from "../../../shared/Validators";
import rnaSirenService from "../../rna-siren/rnaSiren.service";
import Versement from "../../versements/interfaces/Versement";
import VersementsProvider from "../../versements/interfaces/VersementsProvider";
import ChorusAdapter from "./adapters/ChorusAdapter";
import ChorusLineEntity from "./entities/ChorusLineEntity";
import chorusLineRepository from "./repositories/chorus.line.repository";

export interface RejectedRequest {
    state: "rejected", result: { message: string, code: number, data: unknown }
}

export class ChorusService implements VersementsProvider {

    public validateEntity(entity: ChorusLineEntity) {
        if (!BRANCHE_ACCEPTED.includes(entity.indexedInformations.codeBranche)) {
            return { success: false, message: `The branche ${entity.indexedInformations.codeBranche} is not accepted in data`, data: entity }
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
            
        const alreadyExist = await chorusLineRepository.findOneByEJ(entity.indexedInformations.ej);

        if (
            alreadyExist 
            && datesAreOnSameDay(alreadyExist.indexedInformations.dateOperation, entity.indexedInformations.dateOperation) 
            && entity.indexedInformations.amount == alreadyExist.indexedInformations.amount
        ){
            return {
                state: "updated",
                result: await chorusLineRepository.update(entity),
            }
        }

        // Check if siret belongs to an asso
        if (entity.indexedInformations.codeBranche !== ASSO_BRANCHE && ! (await this.siretBelongAsso(entity.indexedInformations.siret))) {
            return {
                state: "rejected",
                result: {
                    message: "The Siret does not correspond to an association",
                    data: entity,
                }
            }
        }
        
        return {
            state: "created",
            result: await chorusLineRepository.create(entity),
        }
    }

    public async siretBelongAsso(siret: Siret): Promise<boolean> {
        const chorusLines = await chorusLineRepository.findBySiret(siret);
        if (chorusLines.length) return true; 
        
        const rna = await rnaSirenService.getRna(siretToSiren(siret));
        if (rna) return true;

        return false
    }



    /**
     * |-------------------------|
     * |   Versement Part        |
     * |-------------------------|
     */
    
    isVersementsProvider = true;

    async getVersementsBySiret(siret: Siret): Promise<Versement[]> {
        const requests = await chorusLineRepository.findBySiret(siret);

        return requests.map(r => ChorusAdapter.toVersement(r));
    }

    async getVersementsBySiren(siren: Siren): Promise<Versement[]> {
        const requests = await chorusLineRepository.findBySiren(siren);

        return requests.map(r => ChorusAdapter.toVersement(r));
    }

    async getVersementsByEJ(ej: string): Promise<Versement[]> {
        const requests = await chorusLineRepository.findByEJ(ej);

        return requests.map(r => ChorusAdapter.toVersement(r));
    }
}

const chorusService = new ChorusService();

export default chorusService;