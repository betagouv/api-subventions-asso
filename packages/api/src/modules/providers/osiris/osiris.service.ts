import { DemandeSubvention, Rna, Siren, Siret, Association, Etablissement } from "@api-subventions-asso/dto";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import EventManager from "../../../shared/EventManager";
import { siretToSiren } from "../../../shared/helpers/SirenHelper";
import {
    isSiret,
    isAssociationName,
    isCompteAssoId,
    isRna,
    isOsirisRequestId,
    isOsirisActionId,
} from "../../../shared/Validators";
import associationNameService from "../../association-name/associationName.service";
import AssociationsProvider from "../../associations/@types/AssociationsProvider";
import EtablissementProvider from "../../etablissements/@types/EtablissementProvider";
import ProviderRequestInterface from "../../search/@types/ProviderRequestInterface";
import { RawGrant } from "../../grant/@types/rawGrant";
import GrantProvider from "../../grant/@types/GrantProvider";
import OsirisRequestAdapter from "./adapters/OsirisRequestAdapter";
import OsirisActionEntity from "./entities/OsirisActionEntity";
import OsirisEvaluationEntity from "./entities/OsirisEvaluationEntity";
import OsirisRequestEntity from "./entities/OsirisRequestEntity";
import { osirisRequestRepository, osirisActionRepository, osirisEvaluationRepository } from "./repositories";

export const VALID_REQUEST_ERROR_CODE = {
    INVALID_SIRET: 1,
    INVALID_RNA: 2,
    INVALID_NAME: 3,
    INVALID_CAID: 4,
    INVALID_OSIRISID: 5,
};

export class OsirisService
    implements ProviderRequestInterface, AssociationsProvider, EtablissementProvider, GrantProvider
{
    provider = {
        name: "OSIRIS",
        type: ProviderEnum.raw,
        description:
            "Osiris est le système d'information permettant la gestion des subventions déposées via le Compte Asso par les services instructeurs (instruction, décision, édition des documents, demandes de mise en paiement).",
    };

    constructor() {
        associationNameService.setProviderScore(this.provider.name, 0.3);
    }

    public async addRequest(request: OsirisRequestEntity): Promise<{ state: string; result: OsirisRequestEntity }> {
        const existingFile = await osirisRequestRepository.findByOsirisId(request.providerInformations.osirisId);
        const { rna, siret, name } = request.legalInformations;
        const siren = siretToSiren(siret);
        const date = request.providerInformations.dateCommission || request.providerInformations.exerciceDebut;

        EventManager.call("rna-siren.matching", [{ rna, siren }]);
        await associationNameService.upsert({
            rna: rna || null,
            siren,
            name,
            provider: this.provider.name,
            lastUpdate: date,
        });

        if (existingFile) {
            await osirisRequestRepository.update(request);
            return {
                state: "updated",
                result: request,
            };
        } else {
            await osirisRequestRepository.add(request);
            return {
                state: "created",
                result: request,
            };
        }
    }

    public validRequest(request: OsirisRequestEntity) {
        if (!isSiret(request.legalInformations.siret)) {
            return {
                message: `INVALID SIRET FOR ${request.legalInformations.siret}`,
                data: request.legalInformations,
                code: VALID_REQUEST_ERROR_CODE.INVALID_SIRET,
            };
        }

        if (!isRna(request.legalInformations.rna)) {
            return {
                message: `INVALID RNA FOR ${request.legalInformations.rna}`,
                data: request.legalInformations,
                code: VALID_REQUEST_ERROR_CODE.INVALID_RNA,
            };
        }

        if (!isAssociationName(request.legalInformations.name)) {
            return {
                message: `INVALID NAME FOR ${request.legalInformations.name}`,
                data: request.legalInformations,
                code: VALID_REQUEST_ERROR_CODE.INVALID_NAME,
            };
        }

        if (!isCompteAssoId(request.providerInformations.compteAssoId)) {
            return {
                message: `INVALID COMPTE ASSO ID FOR ${request.legalInformations.name}`,
                data: request.providerInformations,
                code: VALID_REQUEST_ERROR_CODE.INVALID_CAID,
            };
        }

        if (!isOsirisRequestId(request.providerInformations.osirisId)) {
            return {
                message: `INVALID OSIRIS ID FOR ${request.legalInformations.name}`,
                data: request.providerInformations,
                code: VALID_REQUEST_ERROR_CODE.INVALID_OSIRISID,
            };
        }

        return true;
    }

    public async addAction(action: OsirisActionEntity): Promise<{ state: string; result: OsirisActionEntity }> {
        const existingAction = await osirisActionRepository.findByOsirisId(action.indexedInformations.osirisActionId);
        if (existingAction) {
            return {
                state: "updated",
                result: await osirisActionRepository.update(action),
            };
        }

        await osirisActionRepository.add(action);

        return {
            state: "created",
            result: action,
        };
    }

    public validAction(action: OsirisActionEntity) {
        if (!isCompteAssoId(action.indexedInformations.compteAssoId)) {
            return {
                message: `INVALID COMPTE ASSO ID FOR ${action.indexedInformations.compteAssoId}`,
                data: action.indexedInformations,
            };
        }

        if (!isOsirisActionId(action.indexedInformations.osirisActionId)) {
            return {
                message: `INVALID OSIRIS ACTION ID FOR ${action.indexedInformations.osirisActionId}`,
                data: action.indexedInformations,
            };
        }

        return true;
    }

    public validEvaluation(entity: OsirisEvaluationEntity) {
        const evaluation = entity.indexedInformations;
        if (!isOsirisActionId(evaluation.osirisActionId)) {
            return {
                message: `INVALID OSIRIS ACTION ID FOR ${evaluation.osirisActionId}`,
                data: evaluation,
            };
        }

        if (!isSiret(evaluation.siret)) {
            return {
                message: `INVALID SIRET FOR ${evaluation.siret}`,
                data: evaluation,
            };
        }

        if (!evaluation.evaluation_resultat.length) {
            return {
                message: `INVALID EVALUATION RESULTAT FOR ${evaluation.evaluation_resultat}`,
                data: evaluation,
            };
        }

        return true;
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

        await osirisEvaluationRepository.add(entity);

        return {
            state: "created",
            result: entity,
        };
    }

    public async findBySiret(siret: Siret) {
        const requests = await osirisRequestRepository.findBySiret(siret);

        for (const request of requests) {
            request.actions = await osirisActionRepository.findByCompteAssoId(
                request.providerInformations.compteAssoId,
            );
            // map -> save actions + map -> save eval
            await request.actions.reduce(async (acc, value) => {
                await acc;
                value.evaluation = await osirisEvaluationRepository.findByActionId(
                    value.indexedInformations.osirisActionId,
                );
            }, Promise.resolve());
        }
        return requests;
    }

    public async findBySiren(siren: Siren) {
        const requests = await osirisRequestRepository.findBySiren(siren);

        const actions = await osirisActionRepository.findBySiren(siren);

        for (const request of requests) {
            request.actions = actions.filter(
                a => a.indexedInformations.compteAssoId === request.providerInformations.compteAssoId,
            );
        }
        return requests;
    }

    public async findByRna(rna: Rna) {
        const requests = await osirisRequestRepository.findByRna(rna);

        for (const request of requests) {
            request.actions = await osirisActionRepository.findByCompteAssoId(
                request.providerInformations.compteAssoId,
            );
        }
        return requests;
    }

    /**
     * |-------------------------|
     * |    Associations Part    |
     * |-------------------------|
     */

    isAssociationsProvider = true;

    async getAssociationsBySiren(siren: Siren): Promise<Association[] | null> {
        const requests = await osirisRequestRepository.findBySiren(siren);

        if (requests.length === 0) return null;
        const associations = await Promise.all(
            requests.map(async r =>
                OsirisRequestAdapter.toAssociation(
                    r,
                    (await osirisActionRepository.findByCompteAssoId(r.providerInformations.compteAssoId)) || undefined,
                ),
            ),
        );

        return associations;
    }

    async getAssociationsBySiret(siret: Siret): Promise<Association[] | null> {
        const requests = await osirisRequestRepository.findBySiret(siret);

        if (requests.length === 0) return null;
        const associations = await Promise.all(
            requests.map(async r =>
                OsirisRequestAdapter.toAssociation(
                    r,
                    (await osirisActionRepository.findByCompteAssoId(r.providerInformations.compteAssoId)) || undefined,
                ),
            ),
        );

        return associations;
    }

    async getAssociationsByRna(rna: Rna): Promise<Association[] | null> {
        const requests = await osirisRequestRepository.findByRna(rna);

        if (requests.length === 0) return null;
        const associations = await Promise.all(
            requests.map(async r =>
                OsirisRequestAdapter.toAssociation(
                    r,
                    (await osirisActionRepository.findByCompteAssoId(r.providerInformations.compteAssoId)) || undefined,
                ),
            ),
        );

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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getDemandeSubventionByRna(rna: string): Promise<DemandeSubvention[] | null> {
        return null;
    }

    /**
     * |-------------------------|
     * |   Raw Grant Part        |
     * |-------------------------|
     */

    isGrantProvider = true;

    async getRawGrantsBySiret(siret: string): Promise<RawGrant[] | null> {
        return (await this.findBySiret(siret)).map(grant => ({
            provider: "osiris", // TODO nomenclature
            type: "application",
            data: grant,
            joinKey: grant?.providerInformations?.ej,
        }));
    }
    async getRawGrantsBySiren(siren: string): Promise<RawGrant[] | null> {
        return (await this.findBySiren(siren)).map(grant => ({
            provider: "osiris", // TODO nomenclature
            type: "application",
            data: grant,
            joinKey: grant?.providerInformations?.ej,
        }));
    }
    getRawGrantsByRna(): Promise<RawGrant[] | null> {
        return Promise.resolve(null);
    }
}

const osirisService: OsirisService = new OsirisService();

export default osirisService;
