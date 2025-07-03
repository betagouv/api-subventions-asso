import { DemandeSubvention, Etablissement, Payment } from "dto";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import { isAssociationName, areDates, areNumbersValid, areStringsValid } from "../../../shared/Validators";
import DemandesSubventionsProvider from "../../subventions/@types/DemandesSubventionsProvider";
import EtablissementProvider from "../../etablissements/@types/EtablissementProvider";
import PaymentProvider from "../../payments/@types/PaymentProvider";
import { FullGrantProvider } from "../../grant/@types/FullGrantProvider";
import { FullGrantData, RawApplication, RawFullGrant, RawGrant, RawPayment } from "../../grant/@types/rawGrant";
import ProviderCore from "../ProviderCore";
import dataBretagneService from "../dataBretagne/dataBretagne.service";
import EstablishmentIdentifier from "../../../identifierObjects/EstablishmentIdentifier";
import AssociationIdentifier from "../../../identifierObjects/AssociationIdentifier";
import Siret from "../../../identifierObjects/Siret";
import fonjepSubventionPort from "../../../dataProviders/db/providers/fonjep/fonjep.subvention.port.old";
import fonjepPaymentPort from "../../../dataProviders/db/providers/fonjep/fonjep.payment.port.old";
import fonjepJoiner from "../../../dataProviders/db/providers/fonjep/fonjep.joiner.old";
import FonjepEntityAdapter from "./adapters/FonjepEntityAdapter.old";
import FonjepSubventionEntity from "./entities/FonjepSubventionEntity.old";
import FonjepPaymentEntity from "./entities/FonjepPaymentEntity.old";
import { StructureIdentifier } from "../../../identifierObjects/@types/StructureIdentifier";

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

export type CreateFonjepResponse = FonjepRejectedRequest | true;

export class FonjepService
    extends ProviderCore
    implements
        DemandesSubventionsProvider<FonjepSubventionEntity>,
        EtablissementProvider,
        PaymentProvider<FonjepPaymentEntity>,
        FullGrantProvider<{ application: FonjepSubventionEntity; payments: FonjepPaymentEntity[] }>
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

    rawToGrant(rawFullGrant: RawFullGrant<{ application: FonjepSubventionEntity; payments: FonjepPaymentEntity[] }>) {
        // TODO: check if payments on same fullGrant can have different program
        const programs = rawFullGrant.data.payments.map(
            payment => dataBretagneService.programsByCode[this.getProgramCode(payment)],
        );
        return FonjepEntityAdapter.rawToGrant(rawFullGrant, programs);
    }

    // TODO: this might never be used because of rawToGrant
    rawToApplication(rawApplication: RawApplication<FonjepSubventionEntity>) {
        return FonjepEntityAdapter.rawToApplication(rawApplication);
    }

    // TODO: this might be never use because of rawToGrant
    rawToPayment(rawGrant: RawPayment<FonjepPaymentEntity>) {
        const program = dataBretagneService.programsByCode[this.getProgramCode(rawGrant.data)];
        return FonjepEntityAdapter.rawToPayment(rawGrant, program);
    }

    async createSubventionEntity(entity: FonjepSubventionEntity): Promise<CreateFonjepResponse> {
        const validation = this.validateEntity(entity);

        if (validation instanceof FonjepRejectedRequest) return validation;

        await fonjepSubventionPort.create(entity);

        return true;
    }

    validateEntity(entity: FonjepSubventionEntity): true | FonjepRejectedRequest {
        if (!Siret.isSiret(entity.legalInformations.siret)) {
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

    async createPaymentEntity(entity: FonjepPaymentEntity): Promise<CreateFonjepResponse> {
        if (!Siret.isSiret(entity.legalInformations.siret)) {
            return new FonjepRejectedRequest(
                `INVALID SIRET FOR ${entity.legalInformations.siret}`,
                FONJEP_SERVICE_ERRORS.INVALID_ENTITY,
                entity,
            );
        }

        // Do not validEntity now because it is only called after Subvention validation (siret as already been validated)
        await fonjepPaymentPort.create(entity);

        return true;
    }

    /**
     * |----------------------------|
     * |  DemandesSubventions Part  |
     * |----------------------------|
     */

    isDemandesSubventionsProvider = true;

    async getDemandeSubvention(id: StructureIdentifier): Promise<DemandeSubvention[]> {
        const entities: FonjepSubventionEntity[] = [];

        if (id instanceof EstablishmentIdentifier && id.siret) {
            entities.push(...(await fonjepSubventionPort.findBySiret(id.siret)));
        } else if (id instanceof AssociationIdentifier && id.siren) {
            entities.push(...(await fonjepSubventionPort.findBySiren(id.siren)));
        }

        return entities.map(e => FonjepEntityAdapter.toDemandeSubvention(e));
    }

    /**
     * |----------------------|
     * |  Etablissement Part  |
     * |----------------------|
     */

    isEtablissementProvider = true;

    async getEstablishments(identifier: StructureIdentifier): Promise<Etablissement[]> {
        let entities: FonjepSubventionEntity[] = [];
        if (identifier instanceof EstablishmentIdentifier && identifier.siret) {
            entities = await fonjepSubventionPort.findBySiret(identifier.siret);
        } else if (identifier instanceof AssociationIdentifier && identifier.siren) {
            entities = await fonjepSubventionPort.findBySiren(identifier.siren);
        }
        return entities.map(entity => FonjepEntityAdapter.toEtablissement(entity));
    }

    /**
     * |----------------------------|
     * |  Payment Part  |
     * |----------------------------|
     */

    isPaymentProvider = true;

    // TODO: Handle edge cases
    public getProgramCode(entity: FonjepPaymentEntity) {
        return entity.indexedInformations.bop;
    }

    toPaymentArray(documents: FonjepPaymentEntity[]) {
        return documents.map(document => {
            const program = dataBretagneService.programsByCode[this.getProgramCode(document)];
            return FonjepEntityAdapter.toPayment(document, program);
        });
    }

    async getPayments(identifier: StructureIdentifier): Promise<Payment[]> {
        const requests: FonjepPaymentEntity[] = [];

        if (identifier instanceof EstablishmentIdentifier && identifier.siret) {
            requests.push(...(await fonjepPaymentPort.findBySiret(identifier.siret)));
        } else if (identifier instanceof AssociationIdentifier && identifier.siren) {
            requests.push(...(await fonjepPaymentPort.findBySiren(identifier.siren)));
        }

        return this.toPaymentArray(requests);
    }

    /**
     * |----------------------------|
     * |    Grant Part              |
     * |----------------------------|
     */

    isGrantProvider = true;
    isFullGrantProvider = true;

    async getRawGrants(identifier: StructureIdentifier): Promise<RawGrant[]> {
        let entities: FullGrantData<FonjepSubventionEntity, FonjepPaymentEntity>[] = [];
        if (identifier instanceof EstablishmentIdentifier && identifier.siret) {
            entities = await fonjepJoiner.getFullFonjepGrantsBySiret(identifier.siret);
        } else if (identifier instanceof AssociationIdentifier && identifier.siren) {
            entities = await fonjepJoiner.getFullFonjepGrantsBySiren(identifier.siren);
        }

        return entities.map(grant => ({
            provider: this.provider.id,
            type: "fullGrant",
            data: grant,
            joinKey: `${grant.application.indexedInformations.code_poste} - ${grant.application.indexedInformations.annee_demande}`,
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
        fonjepSubventionPort.useTemporyCollection(active);
        fonjepPaymentPort.useTemporyCollection(active);
    }

    async applyTemporyCollection() {
        await fonjepSubventionPort.applyTemporyCollection();
        await fonjepPaymentPort.applyTemporyCollection();
    }
}

const fonjepService = new FonjepService();

export default fonjepService;
