import { cursorTo } from "readline";
import { Siren, Siret } from "dto";
import { WithId } from "mongodb";
import { ASSO_BRANCHE } from "../../../shared/ChorusBrancheAccepted";
import CacheData from "../../../shared/Cache";
import { asyncFilter } from "../../../shared/helpers/ArrayHelper";
import { siretToSiren } from "../../../shared/helpers/SirenHelper";
import PaymentProvider from "../../payments/@types/PaymentProvider";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import { RawGrant, RawPayment } from "../../grant/@types/rawGrant";
import ProviderCore from "../ProviderCore";
import rnaSirenService from "../../rna-siren/rnaSiren.service";
import uniteLegalEntreprisesService from "../uniteLegalEntreprises/uniteLegal.entreprises.service";
import { DuplicateIndexError } from "../../../shared/errors/dbError/DuplicateIndexError";
import dataBretagneService from "../dataBretagne/dataBretagne.service";
import { DefaultObject } from "../../../@types";
import ChorusAdapter from "./adapters/ChorusAdapter";
import ChorusLineEntity from "./entities/ChorusLineEntity";
import chorusLineRepository from "./repositories/chorus.line.repository";

export interface RejectedRequest {
    state: "rejected";
    result: { message: string; data: unknown };
}

export class ChorusService extends ProviderCore implements PaymentProvider<ChorusLineEntity> {
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

    public async insertMany(entities: ChorusLineEntity[]) {
        return chorusLineRepository.insertMany(entities);
    }

    public async isAcceptedEntity(entity: ChorusLineEntity) {
        if (entity.indexedInformations.codeBranche === ASSO_BRANCHE) return true;

        const siren = siretToSiren(entity.indexedInformations.siret);

        if (this.sirenBelongAssoCache.has(siren)) return this.sirenBelongAssoCache.get(siren)[0];

        const sirenIsAsso = await this.sirenBelongAsso(siren);

        this.sirenBelongAssoCache.add(siren, sirenIsAsso);
        return sirenIsAsso;
    }

    /**
     * @param entities /!\ entities must be validated upstream
     */
    public async insertBatchChorusLine(entities: ChorusLineEntity[]) {
        const acceptedEntities = await asyncFilter(entities, entity => this.isAcceptedEntity(entity));
        let duplicates = 0;
        if (acceptedEntities.length) {
            try {
                await this.insertMany(acceptedEntities);
            } catch (e) {
                duplicates = ((e as DuplicateIndexError<ChorusLineEntity[]>).duplicates as ChorusLineEntity[]).length;
            }
        }

        return {
            rejected: entities.length - acceptedEntities.length,
            created: acceptedEntities.length - duplicates,
            duplicates,
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

    async getPaymentsBySiret(siret: Siret) {
        const requests = await chorusLineRepository.findBySiret(siret);

        return this.toPaymentArray(requests);
    }

    async getPaymentsBySiren(siren: Siren) {
        const requests = await chorusLineRepository.findBySiren(siren);

        return this.toPaymentArray(requests);
    }

    async getPaymentsByKey(ej: string) {
        const requests = await chorusLineRepository.findByEJ(ej);

        return this.toPaymentArray(requests);
    }

    async chorusCursorFind(projection: DefaultObject<unknown> = { indexedInformations: 1 }) {
        return await chorusLineRepository.cursorFind({}, projection);
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

    async getRawGrantsBySiret(siret: string): Promise<RawGrant[] | null> {
        return (await chorusLineRepository.findBySiret(siret)).map(grant => ({
            provider: this.provider.id,
            type: "payment",
            data: grant,
            joinKey: grant.indexedInformations.ej,
        }));
    }
    async getRawGrantsBySiren(siren: string): Promise<RawGrant[] | null> {
        return (await chorusLineRepository.findBySiren(siren)).map(grant => ({
            provider: this.provider.id,
            type: "payment",
            data: grant,
            joinKey: grant.indexedInformations.ej,
        }));
    }
    getRawGrantsByRna(_rna: string): Promise<RawGrant[] | null> {
        return Promise.resolve(null);
    }

    rawToCommon(raw: RawGrant) {
        return ChorusAdapter.toCommon(raw.data as WithId<ChorusLineEntity>);
    }
}

const chorusService = new ChorusService();

export default chorusService;
