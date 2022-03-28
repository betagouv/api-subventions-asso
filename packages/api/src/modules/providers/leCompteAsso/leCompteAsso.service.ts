import ProviderRequestInterface from "../../search/@types/ProviderRequestInterface";
import leCompteAssoRepository from "./repositories/leCompteAsso.repository";
import LeCompteAssoRequestEntity from "./entities/LeCompteAssoRequestEntity";
import ILeCompteAssoPartialRequestEntity from "./@types/ILeCompteAssoPartialRequestEntity";
import ILegalInformations from "../../search/@types/ILegalInformations";
import { isAssociationName, isSiret, isCompteAssoId } from "../../../shared/Validators";
import { Rna, Siret, Siren } from "../../../@types";
import Association from "../../associations/interfaces/Association";
import AssociationsProvider from "../../associations/interfaces/AssociationsProvider";
import LeCompteAssoRequestAdapter from "./adapters/LeCompteAssoRequestAdapter";
import Etablissement from "../../etablissements/interfaces/Etablissement";
import EtablissementProvider from "../../etablissements/interfaces/EtablissementProvider";
import rnaSirenService from "../../rna-siren/rnaSiren.service";
import dataEntrepriseService from "../dataEntreprise/dataEntreprise.service";
import { siretToSiren } from "../../../shared/helpers/SirenHelper";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../../shared/LegalCategoriesAccepted";
import EventManager from "../../../shared/EventManager";


export interface RejectedRequest {
    state: "rejected", result: { message: string, code: number, data: unknown }
}

export class LeCompteAssoService implements ProviderRequestInterface, AssociationsProvider, EtablissementProvider {
    public validEntity(partialEntity: ILeCompteAssoPartialRequestEntity) {
        if (!isSiret(partialEntity.legalInformations.siret)) {
            return { success: false, message: `INVALID SIRET FOR ${partialEntity.legalInformations.siret}`, data: partialEntity.legalInformations };
        }

        if (!isAssociationName(partialEntity.legalInformations.name)) {
            return { success: false, message: `INVALID NAME FOR ${partialEntity.legalInformations.name}`, data: partialEntity.legalInformations };
        }

        if (!isCompteAssoId(partialEntity.providerInformations.compteAssoId)) {
            return { success: false, message: `INVALID COMPTE ASSO ID FOR ${partialEntity.legalInformations.name}`, data: partialEntity.providerInformations };
        }

        return { success: true }
    }

    public async addRequest(partialEntity: ILeCompteAssoPartialRequestEntity): Promise<{state: string, result: LeCompteAssoRequestEntity} | RejectedRequest> {
        const existingEntity = await leCompteAssoRepository.findByCompteAssoId(partialEntity.providerInformations.compteAssoId);

        if (existingEntity) {
            const legalInformations: ILegalInformations = {
                ...existingEntity.legalInformations,
                ...partialEntity.legalInformations,
                rna: existingEntity.legalInformations.rna
            }

            EventManager.call('rna-siren.matching', [{ rna: legalInformations.rna, siren: legalInformations.siret}])
    
            return {
                state: "updated",
                result: await leCompteAssoRepository.updateRequest(new LeCompteAssoRequestEntity(legalInformations, partialEntity.providerInformations,  partialEntity.data)),
            };
        }

        // Rna is not exported in CompteAsso so we search in api
        const rna = await rnaSirenService.getRna(partialEntity.legalInformations.siret, true);
        const asso = await dataEntrepriseService.findAssociationBySiren(siretToSiren(partialEntity.legalInformations.siret));

        if (!rna || !asso || !asso.categorie_juridique?.length) {
            return {
                state: "rejected",
                result: {
                    message: "RNA not found",
                    code: 11,
                    data: partialEntity.legalInformations 
                }
            }
        }


        if (!LEGAL_CATEGORIES_ACCEPTED.includes(asso.categorie_juridique[0].value)){
            return {
                state: "rejected",
                result: {
                    message: "The company is not in legal cateries accepted",
                    code: 10,
                    data: {
                        ...partialEntity.legalInformations,
                    }
                }
            }
        }

        const legalInformations: ILegalInformations = {
            ...partialEntity.legalInformations,
            rna,
        }

        return {
            state: "created",
            result: await leCompteAssoRepository.addRequest(new LeCompteAssoRequestEntity(legalInformations, partialEntity.providerInformations,  partialEntity.data)),
        };
    }


    public async findBySiret(siret: Siret) {
        return await leCompteAssoRepository.findsBySiret(siret);
    }

    public async findByRna(rna: Rna) {
        return await leCompteAssoRepository.findsByRna(rna);

    }


    /**
     * |-------------------------|
     * |    Associations Part    |
     * |-------------------------|
     */

    isAssociationsProvider = true;

    async getAssociationsBySiren(siren: Siren): Promise<Association[] | null> {
        const requests = await leCompteAssoRepository.findBySiren(siren);
        if (requests.length === 0) return null;
        
        return requests.map(r => LeCompteAssoRequestAdapter.toAssociation(r));
    }

    async getAssociationsByRna(rna: Rna): Promise<Association[] | null> {
        const requests = await leCompteAssoRepository.findsByRna(rna);
        if (requests.length === 0) return null;
        
        return requests.map(r => LeCompteAssoRequestAdapter.toAssociation(r));
    }

    /**
     * |-------------------------|
     * |   Etablissesement Part  |
     * |-------------------------|
     */
    
    isEtablissementProvider = true;

    async getEtablissementsBySiret(siret: Siret): Promise<Etablissement[] | null> {   
        const requests = await this.findBySiret(siret);

        if (requests.length === 0) return null;

        return requests.map(r => LeCompteAssoRequestAdapter.toEtablissement(r));
    }
}

const leCompteAssoService: LeCompteAssoService = new LeCompteAssoService();

export default leCompteAssoService;