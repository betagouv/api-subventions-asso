import ProviderRequestInterface from "../search/@types/ProviderRequestInterface";
import OsirisActionEntity from "./entities/OsirisActionEntity";
import OsirisRequestEntity from "./entities/OsirisRequestEntity";
import osirisRepository from "./repository/osiris.repository";

export class OsirisService implements ProviderRequestInterface {
    public async addRequest(request: OsirisRequestEntity): Promise<{state: string, result: OsirisRequestEntity}> {
        const existingFile = await osirisRepository.findRequestByOsirisId(request.providerInformations.osirisId);
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

    public async findBySiret(siret: string) {
        const requests = await osirisRepository.findRequestsBySiret(siret);

        for (const request of requests) {
            request.actions = await osirisRepository.findActionsByCompteAssoId(request.providerInformations.compteAssoId)
        }
        return requests;
    }

    public async findByRna(rna: string) {
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
}

const osirisService: OsirisService = new OsirisService();

export default osirisService;