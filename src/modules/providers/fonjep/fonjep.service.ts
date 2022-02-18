import { WithId } from "mongodb";
import { Siret } from "../../../@types/Siret";
import { isAssociationName, isDates, isNumbersValid, isSiret, isStringsValid } from "../../../shared/Validators";
import DemandesSubventionsProvider from "../../demandes_subventions/interfaces/DemandesSubventionsProvider";
import DemandeSubvention from "../../demandes_subventions/interfaces/DemandeSubvention";
import Etablissement from "../../etablissements/interfaces/Etablissement";
import EtablissementProvider from "../../etablissements/interfaces/EtablissementProvider";
import FonjepEntityAdapter from "./adapters/FonjepEntityAdapter";
import FonjepRequestEntity from "./entities/FonjepRequestEntity";
import fonjepRepository from "./repositories/fonjep.repository";

export enum FONJEP_SERVICE_ERRORS {
    INVALID_ENTITY = 1, 
}

export interface RejectedRequest {
    success: false,
    message: string,
    code: FONJEP_SERVICE_ERRORS,
    data? : unknown
}

export class FonjepService implements DemandesSubventionsProvider, EtablissementProvider {

    async createEntity(entity: FonjepRequestEntity): Promise<RejectedRequest | {success: true, entity: WithId<FonjepRequestEntity>, state: 'updated' | "created"}> {
        const valid = this.validateEntity(entity);

        if (!valid.success) return valid;

        return {
            success: true,
            entity: await fonjepRepository.create(entity),
            state: "created",
        };
    }

    validateEntity(entity: FonjepRequestEntity): { success: true } | RejectedRequest {
        if (!isSiret(entity.legalInformations.siret)) {
            return { success: false, message: `INVALID SIRET FOR ${entity.legalInformations.siret}`, data: entity , code: FONJEP_SERVICE_ERRORS.INVALID_ENTITY };
        }

        if (!isAssociationName(entity.legalInformations.name)) {
            return { success: false, message: `INVALID NAME FOR ${entity.legalInformations.siret}`, data: entity , code: FONJEP_SERVICE_ERRORS.INVALID_ENTITY };
        }

        const dates = [
            entity.indexedInformations.date_versement,
            entity.indexedInformations.date_fin_triennale,
            entity.indexedInformations.date_fin_effet,
        ]

        if (!isDates(dates)) {
            return { success: false, message: `INVALID DATE FOR ${entity.legalInformations.siret}`, data: entity , code: FONJEP_SERVICE_ERRORS.INVALID_ENTITY };
        }
        
        const strings = [
            entity.indexedInformations.status,
            entity.indexedInformations.service_instructeur,
            entity.indexedInformations.code_postal,
            entity.indexedInformations.ville,
            entity.indexedInformations.financeur_principal,
        ]

        if (!isStringsValid(strings)) {
            return { success: false, message: `INVALID STRING FOR ${entity.legalInformations.siret}`, data: entity , code: FONJEP_SERVICE_ERRORS.INVALID_ENTITY };
        }

        const numbers = [
            entity.indexedInformations.montant_paye,
            entity.indexedInformations.annee_demande
        ]

        if (!isNumbersValid(numbers)) {
            return { success: false, message: `INVALID NUMBER FOR ${entity.legalInformations.siret}`, data: entity , code: FONJEP_SERVICE_ERRORS.INVALID_ENTITY };
        }

        return { success: true };
    }


    /**
     * |----------------------------|
     * |  DemandesSubventions Part  |
     * |----------------------------|
     */

    isDemandesSubventionsProvider = true

    async getDemandeSubventionBySiret(siret: Siret): Promise<DemandeSubvention[] | null> {
        const entities = await fonjepRepository.findBySiret(siret);

        if (entities.length === 0) return null;

        return entities.map(e => FonjepEntityAdapter.toDemandeSubvention(e));
    }

    /**
     * |----------------------|
     * |  Etablissement Part  |
     * |----------------------|
     */

    isEtablissementProvider = true

    async getEtablissementsBySiret(siret: Siret): Promise<Etablissement[] | null> {
        const entities = await fonjepRepository.findBySiret(siret);

        if (entities.length === 0) return null;

        return entities.map(e => FonjepEntityAdapter.toEtablissement(e));
    }
}

const fonjepService = new FonjepService();

export default fonjepService;