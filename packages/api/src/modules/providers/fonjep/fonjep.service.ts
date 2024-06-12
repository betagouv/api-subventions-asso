import { Siret, Siren, DemandeSubvention, Etablissement, FonjepPayment, Rna } from "dto";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import { isAssociationName, areDates, areNumbersValid, isSiret, areStringsValid } from "../../../shared/Validators";
import DemandesSubventionsProvider from "../../subventions/@types/DemandesSubventionsProvider";
import EtablissementProvider from "../../etablissements/@types/EtablissementProvider";
import PaymentProvider from "../../payments/@types/PaymentProvider";
import GrantProvider from "../../grant/@types/GrantProvider";
import { RawGrant, RawPayment } from "../../grant/@types/rawGrant";
import ProviderCore from "../ProviderCore";
import dataBretagneService from "../dataBretagne/dataBretagne.service";
import FonjepEntityAdapter from "./adapters/FonjepEntityAdapter";
import FonjepSubventionEntity from "./entities/FonjepSubventionEntity";
import fonjepSubventionRepository from "./repositories/fonjep.subvention.repository";
import fonjepPaymentRepository from "./repositories/fonjep.payment.repository";
import FonjepPaymentEntity from "./entities/FonjepPaymentEntity";
import fonjepJoiner from "./joiners/fonjepJoiner";

export enum FONJEP_SERVICE_ERRORS {
    INVALID_ENTITY = 1,
}

export class FonjepRejectedRequest extends Error {
    code: FONJEP_SERVICE_ERRORS;
    data: FonjepSubventionEntity;

    constructor(message, code, entity) {
        super(message);
        this.code = code;
        this.data = entity;
    }
}

export const FOUNDER_CODE_TO_BOP_MAPPER = {
    "10004": 163,
    "10005": 163,
    "10008": 147,
    "10009": 163,
    "10010": 209,
    "10012": 361,
    "10016": 163,
    "10017": 163,
};

export type CreateFonjepResponse = FonjepRejectedRequest | true;

export class FonjepService
    extends ProviderCore
    implements DemandesSubventionsProvider, EtablissementProvider, PaymentProvider<FonjepPaymentEntity>, GrantProvider
{
    constructor() {
        super({
            name: "Extranet FONJEP",
            type: ProviderEnum.raw,
            description:
                "L'extranet de gestion du Fonjep permet aux services instructeurs d'indiquer les décisions d'attribution des subventions Fonjep et aux associations bénéficiaires de transmettre les informations nécessaires à la mise en paiment des subventions par le Fonjep, il ne gère pas les demandes de subvention qui ne sont pas dématérialisées à ce jour.",
            id: "fonjep",
        });
    }

    rawToPayment(rawGrant: RawPayment<FonjepPaymentEntity>) {
        return FonjepEntityAdapter.rawToPayment(rawGrant);
    }

    async createSubventionEntity(entity: FonjepSubventionEntity): Promise<CreateFonjepResponse> {
        const validation = this.validateEntity(entity);

        if (validation instanceof FonjepRejectedRequest) return validation;

        await fonjepSubventionRepository.create(entity);

        return true;
    }

    validateEntity(entity: FonjepSubventionEntity): true | FonjepRejectedRequest {
        if (!isSiret(entity.legalInformations.siret)) {
            return new FonjepRejectedRequest(
                `INVALID SIRET FOR ${entity.legalInformations.siret}`,
                FONJEP_SERVICE_ERRORS.INVALID_ENTITY,
                entity,
            );
        }

        if (!isAssociationName(entity.legalInformations.name)) {
            return new FonjepRejectedRequest(
                `INVALID NAME FOR ${entity.legalInformations.siret}`,
                FONJEP_SERVICE_ERRORS.INVALID_ENTITY,
                entity,
            );
        }

        const dates = [entity.indexedInformations.date_fin_triennale];

        if (!areDates(dates)) {
            return new FonjepRejectedRequest(
                `INVALID DATE FOR ${entity.legalInformations.siret}`,
                FONJEP_SERVICE_ERRORS.INVALID_ENTITY,
                entity,
            );
        }

        const strings = [
            entity.indexedInformations.status,
            entity.indexedInformations.service_instructeur,
            entity.indexedInformations.ville,
            entity.indexedInformations.type_post,
            entity.indexedInformations.ville,
            entity.indexedInformations.code_postal,
            entity.indexedInformations.contact,
        ];

        if (!areStringsValid(strings)) {
            return new FonjepRejectedRequest(
                `INVALID STRING FOR ${entity.legalInformations.siret}`,
                FONJEP_SERVICE_ERRORS.INVALID_ENTITY,
                entity,
            );
        }

        const numbers = [entity.indexedInformations.montant_paye, entity.indexedInformations.annee_demande];

        if (!areNumbersValid(numbers)) {
            return new FonjepRejectedRequest(
                `INVALID NUMBER FOR ${entity.legalInformations.siret}`,
                FONJEP_SERVICE_ERRORS.INVALID_ENTITY,
                entity,
            );
        }

        return true;
    }

    public getBopFromFounderCode(code: number) {
        return FOUNDER_CODE_TO_BOP_MAPPER[code];
    }

    async createPaymentEntity(entity: FonjepPaymentEntity): Promise<CreateFonjepResponse> {
        if (!isSiret(entity.legalInformations.siret)) {
            return new FonjepRejectedRequest(
                `INVALID SIRET FOR ${entity.legalInformations.siret}`,
                FONJEP_SERVICE_ERRORS.INVALID_ENTITY,
                entity,
            );
        }

        // Do not validEntity now because it is only called after Subvention validation (siret as already been validated)
        await fonjepPaymentRepository.create(entity);

        return true;
    }

    /**
     * |----------------------------|
     * |  DemandesSubventions Part  |
     * |----------------------------|
     */

    isDemandesSubventionsProvider = true;

    async getDemandeSubventionBySiret(siret: Siret): Promise<DemandeSubvention[] | null> {
        const entities = await fonjepSubventionRepository.findBySiret(siret);

        if (entities.length === 0) return null;

        return entities.map(e => FonjepEntityAdapter.toDemandeSubvention(e));
    }

    async getDemandeSubventionBySiren(siren: Siren): Promise<DemandeSubvention[] | null> {
        const entities = await fonjepSubventionRepository.findBySiren(siren);

        if (entities.length === 0) return null;

        return entities.map(e => FonjepEntityAdapter.toDemandeSubvention(e));
    }

    /**
     * |----------------------|
     * |  Etablissement Part  |
     * |----------------------|
     */

    isEtablissementProvider = true;

    async getEtablissementsBySiret(siret: Siret): Promise<Etablissement[] | null> {
        const entities = await fonjepSubventionRepository.findBySiret(siret);

        if (entities.length === 0) return null;

        return entities.map(e => FonjepEntityAdapter.toEtablissement(e));
    }

    async getEtablissementsBySiren(siren: Siren): Promise<Etablissement[] | null> {
        const entities = await fonjepSubventionRepository.findBySiren(siren);

        if (entities.length === 0) return null;

        return entities.map(e => FonjepEntityAdapter.toEtablissement(e));
    }

    /**
     * |----------------------------|
     * |  Payment Part  |
     * |----------------------------|
     */

    isPaymentProvider = true;

    async toPaymentArray(documents: FonjepPaymentEntity[]): Promise<FonjepPayment[]> {
        const programs = await dataBretagneService.findProgramsRecord();
        return documents.map(document =>
            FonjepEntityAdapter.toPayment(document, programs[document.indexedInformations.bop]),
        );
    }

    async getPaymentsByKey(codePoste: string) {
        return this.toPaymentArray(await fonjepPaymentRepository.findByCodePoste(codePoste));
    }

    async getPaymentsBySiret(siret: Siret) {
        return this.toPaymentArray(await fonjepPaymentRepository.findBySiret(siret));
    }

    async getPaymentsBySiren(siren: Siren) {
        return this.toPaymentArray(await fonjepPaymentRepository.findBySiren(siren));
    }

    /**
     * |----------------------------|
     * |    Grant Part              |
     * |----------------------------|
     */

    isGrantProvider = true;

    async getGrantsByRna(rna: string): Promise<[] | null> {
        return null;
    }

    async getGrantsBySiren(siren: string): Promise<[] | null> {
        return null;
    }

    async getGrantsBySiret(siret: string): Promise<[] | null> {
        return null;
    }

    getRawGrantsByRna(_rna: Rna): Promise<RawGrant[] | null> {
        return Promise.resolve(null);
    }

    async getRawGrantsBySiren(siren: Siren): Promise<RawGrant[] | null> {
        return (await fonjepJoiner.getFullFonjepGrantsBySiren(siren)).map(grant => ({
            provider: this.provider.id,
            type: "fullGrant",
            data: grant,
            joinKey: `${grant.indexedInformations.code_poste} - ${grant.indexedInformations.annee_demande}`,
        }));
    }

    async getRawGrantsBySiret(siret: Siret): Promise<RawGrant[] | null> {
        return (await fonjepJoiner.getFullFonjepGrantsBySiret(siret)).map(grant => ({
            provider: this.provider.id,
            type: "fullGrant",
            data: grant,
            joinKey: `${grant.indexedInformations.code_poste} - ${grant.indexedInformations.annee_demande}`,
        }));
    }

    rawToCommon(raw: RawGrant) {
        return FonjepEntityAdapter.toCommon(raw.data);
    }

    /**
     * |----------------------------|
     * |  Database Management      |
     * |----------------------------|
     */

    useTemporyCollection(active: boolean) {
        fonjepSubventionRepository.useTemporyCollection(active);
        fonjepPaymentRepository.useTemporyCollection(active);
    }

    async applyTemporyCollection() {
        await fonjepSubventionRepository.applyTemporyCollection();
        await fonjepPaymentRepository.applyTemporyCollection();
    }
}

const fonjepService = new FonjepService();

export default fonjepService;
