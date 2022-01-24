import ProviderRequestInterface from "../search/@types/ProviderRequestInterface";
import leCompteAssoRepository from "./repositories/leCompteAsso.repository";
import LeCompteAssoRequestEntity from "./entities/LeCompteAssoRequestEntity";
import ILeCompteAssoPartialRequestEntity from "./@types/ILeCompteAssoPartialRequestEntity";
import ILegalInformations from "../search/@types/ILegalInformations";
import { isAssociationName, isSiret, isCompteAssoId } from "../../shared/Validators";
import * as RnaHelper from "../../shared/helpers/RnaHelper";
import { Rna } from "../../@types/Rna";
import { Siret } from "../../@types/Siret";


export interface RejectedRequest {
    state: "rejected", result: { msg: string, code: number, data: unknown }
}

export class LeCompteAssoService implements ProviderRequestInterface {
    public validEntity(partialEntity: ILeCompteAssoPartialRequestEntity) {
        if (!isSiret(partialEntity.legalInformations.siret)) {
            return { success: false, msg: `INVALID SIRET FOR ${partialEntity.legalInformations.siret}`, data: partialEntity.legalInformations };
        }

        if (!isAssociationName(partialEntity.legalInformations.name)) {
            return { success: false, msg: `INVALID NAME FOR ${partialEntity.legalInformations.name}`, data: partialEntity.legalInformations };
        }

        if (!isCompteAssoId(partialEntity.providerInformations.compteAssoId)) {
            return { success: false, msg: `INVALID COMPTE ASSO ID FOR ${partialEntity.legalInformations.name}`, data: partialEntity.providerInformations };
        }

        return { success: true }
    }

    public async addRequest(partialEntity: ILeCompteAssoPartialRequestEntity): Promise<{state: string, result: LeCompteAssoRequestEntity} | RejectedRequest> {
        // Rna is not exported in CompteAsso so we search in api
        const rna = await RnaHelper.findRnaBySiret(partialEntity.legalInformations.siret, true);
        if (typeof rna !== "string") {
            if (rna.code === RnaHelper.ERRORS_CODES.RNA_NOT_FOUND) {
                return {
                    state: "rejected",
                    result: {
                        msg: "RNA not found",
                        code: 11,
                        data: partialEntity.legalInformations 
                    }
                }
            }

            return {
                state: "rejected",
                result: {
                    msg: "The company is not in legal cateries accepted",
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


    public async findBySiret(siret: Siret) {
        return await leCompteAssoRepository.findsBySiret(siret);
    }

    public async findByRna(rna: Rna) {
        return await leCompteAssoRepository.findsByRna(rna);

    }
}

const leCompteAssoService: LeCompteAssoService = new LeCompteAssoService();
export default leCompteAssoService;