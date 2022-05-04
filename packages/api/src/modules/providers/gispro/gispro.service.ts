import GisproActionEntity from './entities/GisproActionEntity';
import gisproRepository from './repositories/gispro.repository';
import { isSiret, isAssociationName } from "../../../shared/Validators";
import { DefaultObject } from '../../../@types';
import GisproRequestAdapter from './adapters/GisproRequestAdapter';
import DemandesSubventionsProvider from "../../demandes_subventions/@types/DemandesSubventionsProvider";
import DemandeSubvention from '@api-subventions-asso/dto/search/DemandeSubventionDto';
import { Rna, Siren, Siret } from '@api-subventions-asso/dto';

export const VALID_REQUEST_ERROR_CODE = {
    INVALID_SIRET: 1,
    INVALID_NAME: 2
}

export class GisproService implements DemandesSubventionsProvider {
    public validEntity(entity: GisproActionEntity) {
        if (!isSiret(entity.providerInformations.siret)) {
            return { success: false, message: `INVALID SIRET FOR ${entity.providerInformations.siret}`, data: entity.providerInformations, code: VALID_REQUEST_ERROR_CODE.INVALID_SIRET };
        }

        if (!isAssociationName(entity.providerInformations.tier)) {
            return { success: false, message: `INVALID NAME FOR ${entity.providerInformations.tier}`, data: entity.providerInformations, code: VALID_REQUEST_ERROR_CODE.INVALID_NAME };
        }

        return { success: true };
    }

    public async upsertMany(requests: GisproActionEntity[]) {
        return await gisproRepository.upsertMany(requests);
    }

    public async insertMany(requests: GisproActionEntity[]) {
        return await gisproRepository.insertMany(requests);
    }

    public async add(enitity: GisproActionEntity): Promise<{state: string, result: GisproActionEntity}> {
        const existingFile = await gisproRepository.findByActionCode(enitity.providerInformations.codeAction);

        if (existingFile) {
            return {
                state: "updated",
                result: await gisproRepository.update(enitity),
            };
        }

        return {
            state: "created",
            result: await gisproRepository.add(enitity),
        };
    }

    public async findBySiret(siret: Siret) {
        const actions = await gisproRepository.findBySiret(siret);
        return actions;
    }

    public async findBySiren(siren: Siren) {
        const actions = await gisproRepository.findBySiren(siren);
        return actions;
    }

    private groupByRequestCode(entities: GisproActionEntity[]): GisproActionEntity[][] {
        const entitiesByCode = entities.reduce((acc, entity) => {
            if (!acc[entity.providerInformations.codeRequest]) acc[entity.providerInformations.codeRequest] = [];
            acc[entity.providerInformations.codeRequest].push(entity);
            return acc;
        }, {} as DefaultObject<GisproActionEntity[]>)

        return Object.values(entitiesByCode);
    }

    isDemandesSubventionsProvider = true;

    async getDemandeSubventionBySiret(siret: Siret): Promise<DemandeSubvention[] | null> {   
        const actions = await this.findBySiret(siret);

        if (actions.length === 0) return null;

        const groupedActions = this.groupByRequestCode(actions);

        return groupedActions.map(group => GisproRequestAdapter.toDemandeSubvention(group));
    }

    async getDemandeSubventionBySiren(siren: Siren): Promise<DemandeSubvention[] | null> {   
        const actions = await this.findBySiren(siren);

        if (actions.length === 0) return null;

        const groupedActions = this.groupByRequestCode(actions);

        return groupedActions.map(group => GisproRequestAdapter.toDemandeSubvention(group));
    }

    async getDemandeSubventionByRna(rna: Rna): Promise<DemandeSubvention[] | null> {
        return null;
    }
}

export default new GisproService();