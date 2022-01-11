import ProviderRequestInterface from "../search/@types/ProviderRequestInterface";
import leCompteAssoRepository from "./repositories/leCompteAsso.repository";
import LeCompteAssoRequestEntity from "./entities/LeCompteAssoRequestEntity";
import LeCompteAssoPartialRequestEntity from "./entities/LeCompteAssoPartialRequestEntity";
import ILegalInformations from "../search/@types/ILegalInformations";
import searchService from "../search/search.service";
import siretService from "../external/siret.service";
import rnaService from "../external/rna.service";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../shared/LegalCategoriesAccepted";

export interface RejectedRequest {
    state: "rejected", result: { msg: string, code: number, data: unknown }
}

export class LeCompteAssoService implements ProviderRequestInterface {
    public validEntity(partialEntity: LeCompteAssoPartialRequestEntity) {
        if (
            typeof partialEntity.legalInformations.siret !== "string"
            || partialEntity.legalInformations.siret.length != 14
            || isNaN(parseInt(partialEntity.legalInformations.siret, 10))
        ) {
            return { success: false, msg: `INVALID SIRET FOR ${partialEntity.legalInformations.siret}`, data: partialEntity.legalInformations };
        }

        if (
            typeof partialEntity.legalInformations.name !== "string"
            || partialEntity.legalInformations.name.length == 0
        ) {
            return { success: false, msg: `INVALID NAME FOR ${partialEntity.legalInformations.name}`, data: partialEntity.legalInformations };
        }

        if (
            typeof partialEntity.providerInformations.compteAssoId !== "string"
            || partialEntity.providerInformations.compteAssoId.length === 0
            || !/\d{2}-\d{6}/.test(partialEntity.providerInformations.compteAssoId)
        ) {
            return { success: false, msg: `INVALID COMPTE ASSO ID FOR ${partialEntity.legalInformations.name}`, data: partialEntity.providerInformations };
        }

        return { success: true}
    }

    public async addRequest(partialEntity: LeCompteAssoPartialRequestEntity): Promise<{state: string, result: LeCompteAssoRequestEntity} | RejectedRequest> {
        // Rna is not exported in CompteAsso so we search in api
        let rna: null | string = null;

        // - 1 Search in local Db
        const requests = await searchService.findRequestsBySiret(partialEntity.legalInformations.siret);
        if (requests.length) {
            rna = requests[0].legalInformations.rna;
        }
        if (!rna) { // - 2 If Rna not found search in siret api and check type of compagny
            const siretData = await siretService.findBySiret(partialEntity.legalInformations.siret)
            if (siretData) {
                if (siretData.etablissement.unite_legale.identifiant_association) {
                    rna = siretData.etablissement.unite_legale.identifiant_association;
                } else if (!LEGAL_CATEGORIES_ACCEPTED.includes(siretData.etablissement.unite_legale.categorie_juridique)) { // Check if company is an association
                    return {
                        state: "rejected",
                        result: {
                            msg: "The company is not in legal cateries accepted",
                            code: 10,
                            data: {
                                ...partialEntity.legalInformations,
                                legalCategory: siretData.etablissement.unite_legale.categorie_juridique
                            }
                        }
                    }
                }
            }
        }

        if (!rna) { // - 3 If Rna not found search in rna api
            const rnaData = await rnaService.findBySiret(partialEntity.legalInformations.siret)
            if (rnaData && rnaData.association.id_association) {
                rna = rnaData.association.id_association;
            }
        }

        if (!rna) {
            return {
                state: "rejected",
                result: {
                    msg: "RNA not found",
                    code: 11,
                    data: partialEntity.legalInformations 
                }
            }
        }

        const legalInformations: ILegalInformations = {
            rna,
            ...partialEntity.legalInformations
        }
        const request = new LeCompteAssoRequestEntity(legalInformations, partialEntity.providerInformations,  partialEntity.data)


        const existingFile = await leCompteAssoRepository.findByCompteAssoId(request.providerInformations.compteAssoId);
        if (existingFile) {
            return {
                state: "updated",
                result: await leCompteAssoRepository.updateRequest(request),
            };
        }

        return {
            state: "created",
            result: await leCompteAssoRepository.addRequest(request),
        };
    }


    public async findBySiret(siret: string) {
        return await leCompteAssoRepository.findsBySiret(siret);
    }

    public async findByRna(rna: string) {
        return await leCompteAssoRepository.findsByRna(rna);

    }
}

const leCompteAssoService: LeCompteAssoService = new LeCompteAssoService();
export default leCompteAssoService;