import DemandeSubvention from "@api-subventions-asso/dto/search/DemandeSubventionDto";
import { Rna, Siren, Siret } from "../../../@types";
import EventManager from "../../../shared/EventManager";
import { isSiret, isAssociationName, isCompteAssoId, isRna, isOsirisRequestId, isOsirisActionId } from "../../../shared/Validators";
import Association from "../../associations/@types/Association";
import AssociationsProvider from "../../associations/@types/AssociationsProvider";
import Etablissement from "../../etablissements/@types/Etablissement";
import EtablissementProvider from "../../etablissements/@types/EtablissementProvider";
import ProviderRequestInterface from "../../search/@types/ProviderRequestInterface";
import OsirisRequestAdapter from "./adapters/OsirisRequestAdapter";
import OsirisActionEntity from "./entities/OsirisActionEntity";
import OsirisEvaluationEntity from './entities/OsirisEvaluationEntity';
import OsirisRequestEntity from "./entities/OsirisRequestEntity";
import { osirisRepository, osirisEvaluationRepository } from "./repositories";

export const VALID_REQUEST_ERROR_CODE = {
    INVALID_SIRET: 1,
    INVALID_RNA: 2,
    INVALID_NAME: 3,
    INVALID_CAID: 4,
    INVALID_OSIRISID: 5
}

export class OsirisService implements ProviderRequestInterface, AssociationsProvider, EtablissementProvider {
    providerName = "OSIRIS"

    public async addRequest(request: OsirisRequestEntity): Promise<{state: string, result: OsirisRequestEntity}> {
        const existingFile = await osirisRepository.findRequestByOsirisId(request.providerInformations.osirisId);
        const { rna, siret: siren, name } = request.legalInformations
        const date = request.providerInformations.dateCommission || request.providerInformations.exerciceDebut;
        
        EventManager.call('rna-siren.matching', [{ rna, siren }]);
        EventManager.call('association-name.matching', [{rna, siren, name, provider: this.providerName, lastUpdate: date}])
        
        if (existingFile) {
            return {
                state: "updated",
                result: await osirisRepository.updateRequest(request),
            };
        } else {
            return {
                state: "created",
                result: await osirisRepository.addRequest(request),
            };
        }
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

    public validEvaluation(entity: OsirisEvaluationEntity) {
        const evaluation = entity.indexedInformations;
        if (!isOsirisActionId(evaluation.osirisActionId)) {
            return { success: false, message: `INVALID OSIRIS ACTION ID FOR ${evaluation.osirisActionId}`, data: evaluation };
        }
        
        if (!isSiret(evaluation.siret)) {
            return { success: false, message: `INVALID SIRET FOR ${evaluation.siret}`, data: evaluation };
        }
        
        if(!evaluation.evaluation_resultat.length) {
            return { success: false, message: `INVALID EVALUATION RESULTAT FOR ${evaluation.evaluation_resultat}`, data: evaluation };
        }
        
        return { success: true };
    }

    public async addEvaluation(entity: OsirisEvaluationEntity) {
        const evaluation = entity.indexedInformations;
        const existingEvaluation = await osirisEvaluationRepository.findByActionId(evaluation.osirisActionId);
        if (existingEvaluation) {
            return {
                state: "updated",
                result: await osirisEvaluationRepository.update(entity),
            };
        }

        return {
            state: "created",
            result: await osirisEvaluationRepository.add(entity),
        };
    }

    public async findBySiret(siret: Siret) {
        const requests = await osirisRepository.findRequestsBySiret(siret);

        for (const request of requests) {
            request.actions = await osirisRepository.findActionsByCompteAssoId(request.providerInformations.compteAssoId)
            // map -> save actions + map -> save eval
            await request.actions.reduce(async (acc, value) => {
                await acc;
                value.evaluation = await osirisEvaluationRepository.findByActionId(value.indexedInformations.osirisActionId)
            },  Promise.resolve());
        }
        return requests;
    }

    public async findBySiren(siren: Siren) {
        const requests = await osirisRepository.findRequestsBySiren(siren);
        
        const actions = await osirisRepository.findActionsBySiren(siren);

        for (const request of requests) {
            request.actions = actions.filter(a => a.indexedInformations.compteAssoId === request.providerInformations.compteAssoId);
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

    async getAssociationsBySiret(siret: Siret): Promise<Association[] | null> {
        const requests = await osirisRepository.findRequestsBySiret(siret);

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

    async getEtablissementsBySiren(siren: Siren): Promise<Etablissement[] | null> {
        const requests = await this.findBySiren(siren);

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

    async getDemandeSubventionBySiren(siren: Siren): Promise<DemandeSubvention[] | null> {
        const requests = await this.findBySiren(siren);

        if (requests.length === 0) return null;

        return requests.map(r => OsirisRequestAdapter.toDemandeSubvention(r));
    }
}

const osirisService: OsirisService = new OsirisService();

export default osirisService;