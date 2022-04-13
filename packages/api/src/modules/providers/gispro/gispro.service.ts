import EventManager from "../../../shared/EventManager";
import GisproRequestEntity from './entities/GisproRequestEntity';
import gisproRepository from './repositories/gispro.repository';
import { isSiret, isAssociationName } from "../../../shared/Validators";
import GisproRequestAdapter from './adapters/GisproRequestAdapter';
import DemandeSubvention from '@api-subventions-asso/dto/search/DemandeSubventionDto';
import { Rna, Siren, Siret } from '@api-subventions-asso/dto';

export const VALID_REQUEST_ERROR_CODE = {
    INVALID_SIRET: 1,
    INVALID_NAME: 2
}

export class GisproService {
    public validRequest(request: GisproRequestEntity) {
        if (!isSiret(request.legalInformations.siret)) {
            return { success: false, message: `INVALID SIRET FOR ${request.legalInformations.siret}`, data: request.legalInformations, code: VALID_REQUEST_ERROR_CODE.INVALID_SIRET };
        }

        if (!isAssociationName(request.legalInformations.name)) {
            return { success: false, message: `INVALID NAME FOR ${request.legalInformations.name}`, data: request.legalInformations, code: VALID_REQUEST_ERROR_CODE.INVALID_NAME };
        }

        return { success: true };
    }

    public async addRequest(request: GisproRequestEntity): Promise<{state: string, result: GisproRequestEntity}> {
        const existingFile = await gisproRepository.findRequestByGisproId(request.providerInformations.gisproId);

        EventManager.call('rna-siren.matching', [{ rna: request.legalInformations.rna, siren: request.legalInformations.siret}])
        
        if (existingFile) {
            return {
                state: "updated",
                result: await gisproRepository.updateRequest(request),
            };
        }

        return {
            state: "created",
            result: await gisproRepository.addRequest(request),
        };
    }

    public async findBySiret(siret: Siret) {
        const requests = await gisproRepository.findRequestsBySiret(siret);
        return requests;
    }

    public async findBySiren(siren: Siren) {
        const requests = await gisproRepository.findRequestsBySiren(siren);
        return requests;
    }

    public async findByRna(rna: Rna) {
        const requests = await gisproRepository.findRequestsByRna(rna);
        return requests;
    }

    isDemandesSubventionsProvider = true;

    async getDemandeSubventionBySiret(siret: Siret): Promise<DemandeSubvention[] | null> {   
        const requests = await this.findBySiret(siret);

        if (requests.length === 0) return null;

        return requests.map(r => GisproRequestAdapter.toDemandeSubvention(r));
    }

    async getDemandeSubventionBySiren(siren: Siren): Promise<DemandeSubvention[] | null> {   
        const requests = await this.findBySiren(siren);

        if (requests.length === 0) return null;

        return requests.map(r => GisproRequestAdapter.toDemandeSubvention(r));
    }

    async getDemandeSubventionByRna(rna: Rna): Promise<DemandeSubvention[] | null> {
        return null;
    }
}

export default new GisproService();