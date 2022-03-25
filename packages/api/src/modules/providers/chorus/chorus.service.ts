import { Siren, Siret } from "../../../@types";
import { ASSO_BRANCHE, BRANCHE_ACCEPTED } from "../../../shared/ChorusBrancheAccepted";
import CacheData from "../../../shared/Cache";
import { asyncFilter } from "../../../shared/helpers/ArrayHelper";
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
    private siretBelongAssoCache = new CacheData<boolean>(1000 * 60 * 60);

    public validateEntity(entity: ChorusLineEntity) {
        if (!BRANCHE_ACCEPTED[entity.indexedInformations.codeBranche]) {
            return { success: false, message: `The branche ${entity.indexedInformations.codeBranche} is not accepted in data`, data: entity }
        }

        if (!isSiret(entity.indexedInformations.siret)) {
            return { success: false, message: `INVALID SIRET FOR ${entity.indexedInformations.siret}`, data: entity };
        }

        if (isNaN(entity.indexedInformations.amount)) {
            return { success: false, message: `Amount is not a number`, data: entity }
        }

        if (!(entity.indexedInformations.dateOperation instanceof Date)) {
            return { success: false, message: `Operation date is not a valid date`, data: entity }
        }

        if (!isEJ(entity.indexedInformations.ej)) {
            return { success: false, message: `INVALID EJ FOR ${entity.indexedInformations.ej}`, data: entity };
        }

        return { success: true }
    }

    /**
     * @param entities /!\ entites must be validated upstream
     */
    public async insertBatchChorusLine(entities: ChorusLineEntity[]) {
        const acceptedEntities = await asyncFilter(entities, async (entity, index) => {
            console.log(index);
            if (entity.indexedInformations.codeBranche === ASSO_BRANCHE) return true;
            console.log("b");
            if (await this.siretBelongAsso(entity.indexedInformations.siret)) return true;
            return false;
        });

        // chorusLineRepository.insertMany(acceptedEntities);

        return {
            rejected: entities.length - acceptedEntities.length,
            created: acceptedEntities.length
        }
    }

    public async addChorusLine(entity: ChorusLineEntity) {
        if(!this.validateEntity(entity).success) {
            return {
                state: "rejected",
                result: this.validateEntity(entity)
            }
        }
        const alreadyExist = await chorusLineRepository.findOneByUniqueId(entity.uniqueId);

        if (alreadyExist){
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
        const siren = siretToSiren(siret);

        if (this.siretBelongAssoCache.has(siren)) return false;

        const chorusLine = await chorusLineRepository.findOneBySiren(siren);
        if (chorusLine) return true; 
        
        const rna = await rnaSirenService.getRna(siren, true);

        if (rna) return true;

        this.siretBelongAssoCache.add(siren, false);
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