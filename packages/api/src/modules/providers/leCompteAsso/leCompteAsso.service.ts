import { Rna, Siret, Siren, Association, Etablissement } from "dto";
import ILegalInformations from "../../search/@types/ILegalInformations";
import { isAssociationName, isSiret, isCompteAssoId } from "../../../shared/Validators";
import ProviderRequestInterface from "../../search/@types/ProviderRequestInterface";
import AssociationsProvider from "../../associations/@types/AssociationsProvider";
import EtablissementProvider from "../../etablissements/@types/EtablissementProvider";
import apiAssoService from "../apiAsso/apiAsso.service";
import rnaSirenService from "../../_open-data/rna-siren/rnaSiren.service";
import { siretToSiren } from "../../../shared/helpers/SirenHelper";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../../shared/LegalCategoriesAccepted";
import EventManager from "../../../shared/EventManager";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import associationNameService from "../../association-name/associationName.service";
import ProviderCore from "../ProviderCore";
import ILeCompteAssoPartialRequestEntity from "./@types/ILeCompteAssoPartialRequestEntity";
import LeCompteAssoRequestEntity from "./entities/LeCompteAssoRequestEntity";
import leCompteAssoRepository from "./repositories/leCompteAsso.repository";
import LeCompteAssoRequestAdapter from "./adapters/LeCompteAssoRequestAdapter";

export interface RejectedRequest {
    state: "rejected";
    result: { message: string; code: number; data: unknown };
}

export class LeCompteAssoService
    extends ProviderCore
    implements ProviderRequestInterface, AssociationsProvider, EtablissementProvider
{
    constructor() {
        super({
            name: "Le Compte Asso",
            type: ProviderEnum.api,
            id: "compte_asso",
            description:
                "Le Compte Asso est un site internet accessible aux associations qui leur permet de réaliser différentes démarches: déposer des demandes de subvention parmi un répertoire de dispositifs de subventions, effectuer leur première immatriculation SIRET.",
        });
        associationNameService.setProviderScore(this.provider.name, 0.2);
    }

    public validEntity(partialEntity: ILeCompteAssoPartialRequestEntity) {
        if (!isSiret(partialEntity.legalInformations.siret)) {
            return {
                message: `INVALID SIRET FOR ${partialEntity.legalInformations.siret}`,
                data: partialEntity.legalInformations,
            };
        }

        if (!isAssociationName(partialEntity.legalInformations.name)) {
            return {
                message: `INVALID NAME FOR ${partialEntity.legalInformations.name}`,
                data: partialEntity.legalInformations,
            };
        }

        if (!isCompteAssoId(partialEntity.providerInformations.compteAssoId)) {
            return {
                message: `INVALID COMPTE ASSO ID FOR ${partialEntity.legalInformations.name}`,
                data: partialEntity.providerInformations,
            };
        }

        return true;
    }

    public async addRequest(
        partialEntity: ILeCompteAssoPartialRequestEntity,
    ): Promise<{ state: string; result: LeCompteAssoRequestEntity } | RejectedRequest> {
        const existingEntity = await leCompteAssoRepository.findByCompteAssoId(
            partialEntity.providerInformations.compteAssoId,
        );

        if (existingEntity) {
            const legalInformations: ILegalInformations = {
                ...existingEntity.legalInformations,
                ...partialEntity.legalInformations,
                rna: existingEntity.legalInformations.rna,
            };

            return {
                state: "updated",
                result: await leCompteAssoRepository.update(
                    new LeCompteAssoRequestEntity(
                        legalInformations,
                        partialEntity.providerInformations,
                        partialEntity.data,
                    ),
                ),
            };
        }

        // Rna is not exported in CompteAsso, so we search in api
        const rna = await rnaSirenService.getRna(partialEntity.legalInformations.siret);
        const asso = await apiAssoService.findAssociationBySiren(siretToSiren(partialEntity.legalInformations.siret));

        if (!rna || !asso || !asso.categorie_juridique?.length) {
            return {
                state: "rejected",
                result: {
                    message: "RNA not found",
                    code: 11,
                    data: partialEntity.legalInformations,
                },
            };
        }

        if (!LEGAL_CATEGORIES_ACCEPTED.includes(asso.categorie_juridique[0].value)) {
            return {
                state: "rejected",
                result: {
                    message: "The company is not in legal categories accepted",
                    code: 10,
                    data: {
                        ...partialEntity.legalInformations,
                    },
                },
            };
        }

        const legalInformations: ILegalInformations = {
            ...partialEntity.legalInformations,
            rna,
        };

        const siret = legalInformations.siret;
        if (siret) {
            const siren = siretToSiren(siret);
            await associationNameService.upsert({
                rna: legalInformations.rna || null,
                siren,
                name: legalInformations.name,
                provider: this.provider.name,
                lastUpdate: partialEntity.providerInformations.transmis_le,
            });
            EventManager.call("rna-siren.matching", [{ rna: legalInformations.rna, siren }]);
        }

        const entity = new LeCompteAssoRequestEntity(
            legalInformations,
            partialEntity.providerInformations,
            partialEntity.data,
        );
        await leCompteAssoRepository.addRequest(entity);
        return {
            state: "created",
            result: entity,
        };
    }

    public async findBySiret(siret: Siret) {
        return await leCompteAssoRepository.findsBySiret(siret);
    }

    public async findBySiren(siren: Siren) {
        return await leCompteAssoRepository.findBySiren(siren);
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

    async getAssociationsBySiret(siret: Siret): Promise<Association[] | null> {
        const requests = await leCompteAssoRepository.findsBySiret(siret);
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

    async getEtablissementsBySiren(siren: Siren): Promise<Etablissement[] | null> {
        const requests = await this.findBySiren(siren);

        if (requests.length === 0) return null;

        return requests.map(r => LeCompteAssoRequestAdapter.toEtablissement(r));
    }
}

const leCompteAssoService: LeCompteAssoService = new LeCompteAssoService();

export default leCompteAssoService;
