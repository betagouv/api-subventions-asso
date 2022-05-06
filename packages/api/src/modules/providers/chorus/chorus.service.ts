import { Siren, Siret } from "../../../@types";
import { ASSO_BRANCHE, BRANCHE_ACCEPTED } from "../../../shared/ChorusBrancheAccepted";
import CacheData from "../../../shared/Cache";
import { asyncFilter } from "../../../shared/helpers/ArrayHelper";
import { siretToSiren } from "../../../shared/helpers/SirenHelper";
import { isEJ, isSiret } from "../../../shared/Validators";
import rnaSirenService from "../../open-data/rna-siren/rnaSiren.service";
import Versement from "../../versements/@types/Versement";
import VersementsProvider from "../../versements/@types/VersementsProvider";
import dataGouvService from "../datagouv/datagouv.service";
import ChorusAdapter from "./adapters/ChorusAdapter";
import ChorusLineEntity from "./entities/ChorusLineEntity";
import chorusLineRepository from "./repositories/chorus.line.repository";
import { ProviderEnum } from '../../../@enums/ProviderEnum';

export interface RejectedRequest {
    state: "rejected", result: { message: string, code: number, data: unknown }
}

export class ChorusService implements VersementsProvider {
    provider = {
        name: "Chorus",
        type: ProviderEnum.raw,
        description: "Chorus est un système d'information porté par l'AIFE pour les services de l'Etat qui permet de gérer les paiements des crédits Etat, que ce soit des commandes publiques ou des subventions et d'assurer la gestion financière du budget de l'Etat."
    }

    private sirenBelongAssoCache = new CacheData<boolean>(1000 * 60 * 60);

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
    public async insertBatchChorusLine(entities: ChorusLineEntity[], dropedDb = false) {
        const acceptedEntities = await asyncFilter(entities, async (entity) => {
            if (entity.indexedInformations.codeBranche === ASSO_BRANCHE) return true;
            const siren = siretToSiren(entity.indexedInformations.siret);

            if (this.sirenBelongAssoCache.has(siren)) return this.sirenBelongAssoCache.get(siren)[0];

            const sirenIsAsso = await this.sirenBelongAsso(siren);

            this.sirenBelongAssoCache.add(siren, sirenIsAsso);

            if (sirenIsAsso) return true;
            return false;
        });

        await chorusLineRepository.insertMany(acceptedEntities, dropedDb);

        return {
            rejected: entities.length - acceptedEntities.length,
            created: acceptedEntities.length
        }
    }

    public async switchChorusRepo() {
        return chorusLineRepository.switchCollection();
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
        if (entity.indexedInformations.codeBranche !== ASSO_BRANCHE && ! (await this.sirenBelongAsso(siretToSiren(entity.indexedInformations.siret)))) {
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

    public async sirenBelongAsso(siren: Siren): Promise<boolean> {
        if (await dataGouvService.sirenIsEntreprise(siren)) return false;
        if (await rnaSirenService.getRna(siren, true)) return true;

        const chorusLine = await chorusLineRepository.findOneBySiren(siren);
        if (chorusLine) return true; 
        
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