import { Payment } from "dto";
import { WithId } from "mongodb";
import { ASSO_BRANCHE } from "../../../shared/ChorusBrancheAccepted";
import CacheData from "../../../shared/Cache";
import { asyncFilter } from "../../../shared/helpers/ArrayHelper";
import PaymentProvider from "../../payments/@types/PaymentProvider";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import { RawGrant, RawPayment } from "../../grant/@types/rawGrant";
import ProviderCore from "../ProviderCore";
import rnaSirenService from "../../rna-siren/rnaSiren.service";
import uniteLegalEntreprisesService from "../uniteLegalEntreprises/uniteLegal.entreprises.service";
import dataBretagneService from "../dataBretagne/dataBretagne.service";
import { StructureIdentifier } from "../../../@types";
import EstablishmentIdentifier from "../../../valueObjects/EstablishmentIdentifier";
import AssociationIdentifier from "../../../valueObjects/AssociationIdentifier";
import Siren from "../../../valueObjects/Siren";
import Siret from "../../../valueObjects/Siret";
import GrantProvider from "../../grant/@types/GrantProvider";
import ChorusAdapter from "./adapters/ChorusAdapter";
import ChorusLineEntity from "./entities/ChorusLineEntity";
import chorusLineRepository from "./repositories/chorus.line.repository";

export interface RejectedRequest {
    state: "rejected";
    result: { message: string; data: unknown };
}

export class ChorusService extends ProviderCore implements PaymentProvider<ChorusLineEntity>, GrantProvider {
    constructor() {
        super({
            name: "Chorus",
            type: ProviderEnum.raw,
            description:
                "Chorus est un système d'information porté par l'AIFE pour les services de l'État qui permet de gérer les paiements des crédits État, que ce soit des commandes publiques ou des subventions et d'assurer la gestion financière du budget de l'État.",
            id: "chorus",
        });
    }

    public rawToPayment(rawGrant: RawPayment<ChorusLineEntity>) {
        // get program
        const program = dataBretagneService.programsByCode[this.getProgramCode(rawGrant.data)];
        return ChorusAdapter.rawToPayment(rawGrant, program);
    }

    private sirenBelongAssoCache = new CacheData<boolean>(1000 * 60 * 60);

    public async upsertMany(entities: ChorusLineEntity[]) {
        return chorusLineRepository.upsertMany(entities);
    }

    public async isAcceptedEntity(entity: ChorusLineEntity) {
        if (entity.indexedInformations.codeBranche === ASSO_BRANCHE) return true;

        // quick fix to handle payments to assocations without siret but ridet or tahiti
        // there is cases where both siret and ridet/tahiti columns values are #
        // for now we insert all because we don't know the rules behind it
        // and we don't want to lose any information
        if (entity.indexedInformations.siret === "#") {
            return true;
        } else {
            const siren = new Siret(entity.indexedInformations.siret).toSiren();

            if (this.sirenBelongAssoCache.has(siren.value)) return this.sirenBelongAssoCache.get(siren.value)[0];

            const sirenIsAsso = await this.sirenBelongAsso(siren);

            this.sirenBelongAssoCache.add(siren.value, sirenIsAsso);
            return sirenIsAsso;
        }
    }

    /**
     * @param entities /!\ entities must be validated upstream
     */
    public async insertBatchChorusLine(entities: ChorusLineEntity[]) {
        const acceptedEntities = await asyncFilter(entities, entity => this.isAcceptedEntity(entity));
        if (acceptedEntities.length) await this.upsertMany(acceptedEntities);

        return {
            rejected: entities.length - acceptedEntities.length,
            created: acceptedEntities.length,
        };
    }

    public async sirenBelongAsso(siren: Siren): Promise<boolean> {
        const chorusLine = await chorusLineRepository.findOneBySiren(siren);
        if (chorusLine) return true;

        if (await uniteLegalEntreprisesService.isEntreprise(siren)) return false;
        if (await rnaSirenService.find(siren)) return true;

        return false;
    }

    /**
     * |-------------------------|
     * |     Payment Part        |
     * |-------------------------|
     */

    isPaymentProvider = true;

    async getPayments(identifier: StructureIdentifier): Promise<Payment[]> {
        const requests: WithId<ChorusLineEntity>[] = [];

        if (identifier instanceof EstablishmentIdentifier && identifier.siret) {
            requests.push(...(await chorusLineRepository.findBySiret(identifier.siret)));
        } else if (identifier instanceof AssociationIdentifier && identifier.siren) {
            requests.push(...(await chorusLineRepository.findBySiren(identifier.siren)));
        }

        return this.toPaymentArray(requests);
    }

    async getPaymentsByKey(ej: string) {
        const requests = await chorusLineRepository.findByEJ(ej);

        return this.toPaymentArray(requests);
    }

    public cursorFindDataWithoutHash(exerciceBudgetaire?: number) {
        return chorusLineRepository.cursorFindDataWithoutHash(exerciceBudgetaire);
    }

    // TODO: unit test this
    public getProgramCode(entity: ChorusLineEntity) {
        return parseInt(entity.indexedInformations.codeDomaineFonctionnel.slice(0, 4), 10); // for exemple codeDomaineFonctionnel = "0143-03-01", codeProgramme = 143
    }

    private toPaymentArray(documents: WithId<ChorusLineEntity>[]) {
        return documents.map(document => {
            const program = dataBretagneService.programsByCode[this.getProgramCode(document)];
            return ChorusAdapter.toPayment(document, program);
        });
    }

    /**
     * |-------------------------|
     * |   Grant Part            |
     * |-------------------------|
     */

    isGrantProvider = true;

    async getRawGrants(identifier: StructureIdentifier): Promise<RawGrant[]> {
        let entities: ChorusLineEntity[] = [];
        if (identifier instanceof EstablishmentIdentifier && identifier.siret) {
            entities = await chorusLineRepository.findBySiret(identifier.siret);
        } else if (identifier instanceof AssociationIdentifier && identifier.siren) {
            entities = await chorusLineRepository.findBySiren(identifier.siren);
        }

        return entities.map(grant => ({
            provider: this.provider.id,
            type: "payment",
            data: grant,
            joinKey: grant.indexedInformations.ej,
        }));
    }

    rawToCommon(raw: RawGrant) {
        return ChorusAdapter.toCommon(raw.data as WithId<ChorusLineEntity>);
    }
}

const chorusService = new ChorusService();

export default chorusService;
