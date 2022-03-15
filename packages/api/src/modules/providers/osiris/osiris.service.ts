import { Rna } from "../../../@types/Rna";
import { Siren } from "../../../@types/Siren";
import { Siret } from "../../../@types/Siret";
import EventManager from "../../../shared/EventManager";
import { isSiret, isAssociationName, isCompteAssoId, isRna, isOsirisRequestId, isOsirisActionId } from "../../../shared/Validators";
import Association from "../../associations/interfaces/Association";
import AssociationsProvider from "../../associations/interfaces/AssociationsProvider";
import DemandeSubvention from "../../demandes_subventions/interfaces/DemandeSubvention";
import Etablissement from "../../etablissements/interfaces/Etablissement";
import EtablissementProvider from "../../etablissements/interfaces/EtablissementProvider";
import ProviderRequestInterface from "../../search/@types/ProviderRequestInterface";
import OsirisRequestAdapter from "./adapters/OsirisRequestAdatper";
import OsirisActionEntity from "./entities/OsirisActionEntity";
import OsirisRequestEntity from "./entities/OsirisRequestEntity";
import osirisRepository from "./repository/osiris.repository";

export const VALID_REQUEST_ERROR_CODE = {
    INVALID_SIRET: 1,
    INVALID_RNA: 2,
    INVALID_NAME: 3,
    INVALID_CAID: 4,
    INVALID_OSIRISID: 5
}

export class OsirisService implements ProviderRequestInterface, AssociationsProvider, EtablissementProvider {
    public async addRequest(request: OsirisRequestEntity): Promise<{state: string, result: OsirisRequestEntity}> {
        const existingFile = await osirisRepository.findRequestByOsirisId(request.providerInformations.osirisId);

        EventManager.call('rna-siren.matching', [{ rna: request.legalInformations.rna, siren: request.legalInformations.siret}])
        
        if (existingFile) {
            return {
                state: "updated",
                result: await osirisRepository.updateRequest(request),
            };
        }

        return {
            state: "created",
            result: await osirisRepository.addRequest(request),
        };
    }

    public validRequest(request: OsirisRequestEntity) {
        if (!isSiret(request.legalInformations.siret)) {
            return { success: false, message: `INVALID SIRET FOR ${request.legalInformations.siret}`, data: request.legalInformations, code: VALID_REQUEST_ERROR_CODE.INVALID_SIRET };
        }

        if (!isRna(request.legalInformations.rna)) {
            return { success: false, message: `INVALID RNA FOR ${request.legalInformations.rna}`, data: request.legalInformations, code: VALID_REQUEST_ERROR_CODE.INVALID_RNA};
        }

        if (!isAssociationName(request.legalInformations.name)) {
            return { success: false, message: `INVALID NAME FOR ${request.legalInformations.name}`, data: request.legalInformations, code: VALID_REQUEST_ERROR_CODE.INVALID_NAME };
        }

        if (!isCompteAssoId(request.providerInformations.compteAssoId)) {
            return { success: false, message: `INVALID COMPTE ASSO ID FOR ${request.legalInformations.name}`, data: request.providerInformations, code: VALID_REQUEST_ERROR_CODE.INVALID_CAID };
        }

        if (!isOsirisRequestId(request.providerInformations.osirisId)) {
            return { success: false, message: `INVALID OSIRIS ID FOR ${request.legalInformations.name}`, data: request.providerInformations, code: VALID_REQUEST_ERROR_CODE.INVALID_OSIRISID };
        }

        return { success: true };
    }

    public async addAction(action: OsirisActionEntity): Promise<{state: string, result: OsirisActionEntity}> {
        const existingAction = await osirisRepository.findActionByOsirisId(action.indexedInformations.osirisActionId);
        if (existingAction) {
            return {
                state: "updated",
                result: await osirisRepository.updateAction(action),
            };
        }

        return {
            state: "created",
            result: await osirisRepository.addAction(action),
        };
    }

    public validAction(action: OsirisActionEntity) {
        if (!isCompteAssoId(action.indexedInformations.compteAssoId)) {
            return { success: false, message: `INVALID COMPTE ASSO ID FOR ${action.indexedInformations.compteAssoId}`, data: action.indexedInformations };
        }

        if (!isOsirisActionId(action.indexedInformations.osirisActionId)) {
            return { success: false, message: `INVALID OSIRIS ACTION ID FOR ${action.indexedInformations.osirisActionId}`, data: action.indexedInformations };
        }
        
        return { success: true };
    }

    public async findBySiret(siret: Siret) {
        const requests = await osirisRepository.findRequestsBySiret(siret);

        for (const request of requests) {
            request.actions = await osirisRepository.findActionsByCompteAssoId(request.providerInformations.compteAssoId)
        }
        return requests;
    }

    public async findByRna(rna: Rna) {
        const requests = await osirisRepository.findRequestsByRna(rna);

        for (const request of requests) {
            request.actions = await osirisRepository.findActionsByCompteAssoId(request.providerInformations.compteAssoId)
        }
        return requests;
    }

    public findAllRequests() {
        return osirisRepository.findAllRequests();
    }

    public findAllActions() {
        return osirisRepository.findAllActions();
    }

    /**
     * |-------------------------|
     * |    Associations Part    |
     * |-------------------------|
     */

    isAssociationsProvider = true;

    async getAssociationsBySiren(siren: Siren): Promise<Association[] | null> {
        const requests = await osirisRepository.findRequestsBySiren(siren);

        if (requests.length === 0) return null;
        const associations = await Promise.all(
            requests.map(async r => 
                OsirisRequestAdapter.toAssociation(
                    r,
                    (await osirisRepository.findActionsByCompteAssoId(r.providerInformations.compteAssoId)) || undefined)
            )
        )

        return associations;
    }

    async getAssociationsByRna(rna: Rna): Promise<Association[] | null> {
        const requests = await osirisRepository.findRequestsByRna(rna);

        if (requests.length === 0) return null;
        const associations = await Promise.all(
            requests.map(async r => 
                OsirisRequestAdapter.toAssociation(
                    r,
                    (await osirisRepository.findActionsByCompteAssoId(r.providerInformations.compteAssoId)) || undefined)
            )
        )

        return associations;
    }


    /**
     * |-------------------------|
     * |   Etablisesement Part   |
     * |-------------------------|
     */
    
    isEtablissementProvider = true;

    async getEtablissementsBySiret(siret: Siret): Promise<Etablissement[] | null> {   
        const requests = await this.findBySiret(siret);

        if (requests.length === 0) return null;

        return requests.map(r => OsirisRequestAdapter.toEtablissement(r));
    }


    /**
     * |------------------------------|
     * | Demandes de Subventions Part |
     * |------------------------------|
     */
    
    isDemandesSubventionsProvider = true;

    async getDemandeSubventionBySiret(siret: Siret): Promise<DemandeSubvention[] | null> {   
        const requests = await this.findBySiret(siret);

        if (requests.length === 0) return null;

        return requests.map(r => OsirisRequestAdapter.toDemandeSubvention(r));
    }
}

const osirisService: OsirisService = new OsirisService();

export default osirisService;