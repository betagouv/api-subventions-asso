import { Siren, Siret } from "dto";
import { AnyBulkWriteOperation, WithId } from "mongodb";
import { ASSO_BRANCHE, BRANCHE_ACCEPTED } from "../../../shared/ChorusBrancheAccepted";
import CacheData from "../../../shared/Cache";
import { getMD5 } from "../../../shared/helpers/StringHelper";
import { asyncFilter } from "../../../shared/helpers/ArrayHelper";
import { siretToSiren } from "../../../shared/helpers/SirenHelper";
import { isEJ, isSiret } from "../../../shared/Validators";
import rnaSirenService from "../../_open-data/rna-siren/rnaSiren.service";
import VersementsProvider from "../../versements/@types/VersementsProvider";
import dataGouvService from "../datagouv/datagouv.service";
import db from "../../../shared/MongoConnection";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import { RawGrant } from "../../grant/@types/rawGrant";
import GrantProvider from "../../grant/@types/GrantProvider";
import ChorusAdapter from "./adapters/ChorusAdapter";
import ChorusLineEntity from "./entities/ChorusLineEntity";
import chorusLineRepository from "./repositories/chorus.line.repository";
import IChorusIndexedInformations from "./@types/IChorusIndexedInformations";

export interface RejectedRequest {
    state: "rejected";
    result: { message: string; data: unknown };
}

export class ChorusService implements VersementsProvider, GrantProvider {
    provider = {
        name: "Chorus",
        type: ProviderEnum.raw,
        description:
            "Chorus est un système d'information porté par l'AIFE pour les services de l'État qui permet de gérer les paiements des crédits État, que ce soit des commandes publiques ou des subventions et d'assurer la gestion financière du budget de l'État.",
        id: "chorus",
    };

    // new unique ID builder
    // remove the one used in chorus CLI after fix fully handled
    static buildUniqueId(info: IChorusIndexedInformations) {
        const { ej, siret, dateOperation, amount, numeroDemandePayment, codeCentreFinancier, codeDomaineFonctionnel } =
            info;
        return getMD5(
            `${ej}-${siret}-${dateOperation}-${amount}-${numeroDemandePayment}-${codeCentreFinancier}-${codeDomaineFonctionnel}`,
        );
    }

    // keep this for migration ?
    public async addPaymentRequestNumberToUniqueId() {
        // TODO: ajouter un index sur numeroDemandePayment ?

        const chorusCursor = chorusLineRepository.cursorFind();

        const buildUpdateOne = (document: WithId<ChorusLineEntity>, newId: string): AnyBulkWriteOperation => ({
            updateOne: {
                filter: {
                    uniqueId: document.uniqueId,
                    "indexedInformations.numeroDemandePayment": document.indexedInformations.numeroDemandePayment,
                },
                update: { $set: { uniqueId: newId } },
            },
        });

        let ops: AnyBulkWriteOperation[] = [];
        while (await chorusCursor.hasNext()) {
            const document = (await chorusCursor.next()) as WithId<ChorusLineEntity>;

            // if migration failed and we run it again, prevent appending another DP at the end of the uniqueID
            if (document.uniqueId.endsWith(document.indexedInformations.numeroDemandePayment)) continue;

            const newId = ChorusService.buildUniqueId(document.indexedInformations);
            ops.push(buildUpdateOne(document, newId));
            if (ops.length === 1000) {
                console.log("start bulkwrite");
                await db.collection("chorus-line").bulkWrite(ops);
                ops = [];
                console.log("end bulkwrite");
            }
        }

        if (ops.length) {
            console.log("start last bulkwrite");
            await db.collection("chorus-line").bulkWrite(ops);
            console.log("end last bulkwrite");
        }
    }

    private sirenBelongAssoCache = new CacheData<boolean>(1000 * 60 * 60);

    public validateEntity(entity: ChorusLineEntity) {
        if (!BRANCHE_ACCEPTED[entity.indexedInformations.codeBranche]) {
            throw new Error(`The branch ${entity.indexedInformations.codeBranche} is not accepted in data`);
        }

        if (!isSiret(entity.indexedInformations.siret)) {
            throw new Error(`INVALID SIRET FOR ${entity.indexedInformations.siret}`);
        }

        if (isNaN(entity.indexedInformations.amount)) {
            throw new Error(`Amount is not a number`);
        }

        if (!(entity.indexedInformations.dateOperation instanceof Date)) {
            throw new Error(`Operation date is not a valid date`);
        }

        if (!isEJ(entity.indexedInformations.ej)) {
            throw new Error(`INVALID EJ FOR ${entity.indexedInformations.ej}`);
        }

        return true;
    }

    /**
     * @param entities /!\ entities must be validated upstream
     */
    public async insertBatchChorusLine(entities: ChorusLineEntity[], dropedDb = false) {
        const acceptedEntities = await asyncFilter(entities, async entity => {
            if (entity.indexedInformations.codeBranche === ASSO_BRANCHE) return true;
            const siren = siretToSiren(entity.indexedInformations.siret);

            if (this.sirenBelongAssoCache.has(siren)) return this.sirenBelongAssoCache.get(siren)[0];

            const sirenIsAsso = await this.sirenBelongAsso(siren);

            this.sirenBelongAssoCache.add(siren, sirenIsAsso);

            if (sirenIsAsso) return true;
            return false;
        });

        if (acceptedEntities.length) await chorusLineRepository.insertMany(acceptedEntities, dropedDb);

        return {
            rejected: entities.length - acceptedEntities.length,
            created: acceptedEntities.length,
        };
    }

    public async switchChorusRepo() {
        return chorusLineRepository.switchCollection();
    }

    public async addChorusLine(entity: ChorusLineEntity) {
        try {
            this.validateEntity(entity);
        } catch (error) {
            return {
                state: "rejected",
                result: { message: (error as Error).message, data: entity },
            };
        }

        const alreadyExist = await chorusLineRepository.findOneByUniqueId(entity.uniqueId);
        if (alreadyExist) {
            return {
                state: "updated",
                result: await chorusLineRepository.update(entity),
            };
        }

        // Check if siret belongs to an asso
        if (
            entity.indexedInformations.codeBranche !== ASSO_BRANCHE &&
            !(await this.sirenBelongAsso(siretToSiren(entity.indexedInformations.siret)))
        ) {
            return {
                state: "rejected",
                result: { message: "The Siret does not correspond to an association", data: entity },
            };
        }

        try {
            await chorusLineRepository.create(entity);
            return {
                state: "created",
                result: entity,
            };
        } catch (e) {
            return {
                state: "rejected",
                result: { message: "Fail to create ChorusLineEntity", data: entity },
            };
        }
    }

    public async sirenBelongAsso(siren: Siren): Promise<boolean> {
        if (await dataGouvService.sirenIsEntreprise(siren)) return false;
        if (await rnaSirenService.getRna(siren)) return true;

        const chorusLine = await chorusLineRepository.findOneBySiren(siren);
        if (chorusLine) return true;

        return false;
    }

    /**
     * |-------------------------|
     * |   Versement Part        |
     * |-------------------------|
     */

    isVersementsProvider = true;

    async getVersementsBySiret(siret: Siret) {
        const requests = await chorusLineRepository.findBySiret(siret);

        return requests.map(r => ChorusAdapter.toVersement(r));
    }

    async getVersementsBySiren(siren: Siren) {
        const requests = await chorusLineRepository.findBySiren(siren);

        return requests.map(r => ChorusAdapter.toVersement(r));
    }

    async getVersementsByKey(ej: string) {
        const requests = await chorusLineRepository.findByEJ(ej);

        return requests.map(r => ChorusAdapter.toVersement(r));
    }

    /**
     * |-------------------------|
     * |   Raw Grant Part        |
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
