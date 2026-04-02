import CacheData from "../../../shared/Cache";
import { asyncFilter } from "../../../shared/helpers/ArrayHelper";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import ProviderCore from "../ProviderCore";
import Siren from "../../../identifierObjects/Siren";
import chorusAdapter from "../../../adapters/db/providers/chorus/chorus.adapter";
import ChorusEntity from "./entities/ChorusEntity";
import associationHelper from "../../associations/associations.helper";
import AssociationIdentifier from "../../../identifierObjects/AssociationIdentifier";
import Siret from "../../../identifierObjects/Siret";
import ChorusFseEntity from "./entities/ChorusFseEntity";
import chorusFseAdapter from "../../../adapters/db/providers/chorus/chorus.fse.adapter";
import PaymentFlatProvider from "../../paymentFlat/@types/paymentFlatProvider";
import paymentFlatService from "../../paymentFlat/paymentFlat.service";
import PaymentFlatEntity from "../../../entities/flats/PaymentFlatEntity";
import { ChorusFseMapper } from "./mappers/chorus.fse.mapper";

export interface RejectedRequest {
    state: "rejected";
    result: { message: string; data: unknown };
}

export class ChorusService extends ProviderCore implements PaymentFlatProvider {
    constructor() {
        super({
            name: "Chorus",
            type: ProviderEnum.raw,
            description:
                "Chorus est un système d'information porté par l'AIFE pour les services de l'État qui permet de gérer les paiements des crédits État, que ce soit des commandes publiques ou des subventions et d'assurer la gestion financière du budget de l'État.",
            id: "chorus",
        });
    }

    private sirenBelongAssoCache = new CacheData<boolean>(1000 * 60 * 60);

    public async upsertMany(entities: ChorusEntity[]) {
        return chorusAdapter.upsertMany(entities);
    }

    /*
     * it is weird that this filter, that essentially accepts according to structure being an asso or not.
     * The check about that should be associationHelper.isIdentifierFromAsso but we historically have this one
     * that use chorus specific data
     * */
    public async isAcceptedEntity(entity: ChorusEntity) {
        // quick fix to handle payments to assocations without siret but ridet or tahiti
        // there is cases where both siret and ridet/tahiti columns values are #
        // for now we insert all because we don't know the rules behind it
        // and we don't want to lose any information
        if (entity.siret === "#") {
            return true;
        } else {
            const siren = new Siret(entity.siret).toSiren();

            const cache = this.sirenBelongAssoCache.get(siren.value);
            if (cache !== null) return cache;

            return this.sirenBelongAsso(siren);
        }
    }

    // will replace isAcceptedEntity when Chorus will be refactored to match new ChorusFseEntity process
    public async isEntityAccepted(entity: ChorusFseEntity) {
        const siret = entity.identifier;
        if (siret instanceof Siret) {
            const siren = siret.toSiren();
            const cache = this.sirenBelongAssoCache.get(siren.value);
            if (cache !== null) return cache;

            return this.sirenBelongAsso(siren);
        } else {
            // @TODO: handle ridet/tahitied validation
            return false;
        }
    }

    /**
     * @param entities /!\ entities must be validated upstream
     */
    public async insertBatchChorus(entities: ChorusEntity[]) {
        const acceptedEntities = await asyncFilter(entities, entity => this.isAcceptedEntity(entity));
        if (acceptedEntities.length) await this.upsertMany(acceptedEntities);

        return {
            rejected: entities.length - acceptedEntities.length,
            created: acceptedEntities.length,
        };
    }

    public async sirenBelongAsso(siren: Siren): Promise<boolean> {
        const result = await associationHelper.isIdentifierFromAsso(AssociationIdentifier.fromSiren(siren));
        this.sirenBelongAssoCache.add(siren.value, result);
        return result;
    }

    public cursorFind(exerciceBudgetaire?: number) {
        if (!exerciceBudgetaire) return chorusAdapter.cursorFind({});
        else return chorusAdapter.cursorFindOnExercise(exerciceBudgetaire);
    }

    // TODO: unit test this
    public getProgramCode(entity: ChorusEntity) {
        return parseInt(entity.codeDomaineFonctionnel.slice(0, 4), 10); // for exemple codeDomaineFonctionnel = "0143-03-01", codeProgramme = 143
    }

    public async persistEuropeanEntities(entities: ChorusFseEntity[]) {
        const validEntities = await asyncFilter(entities, entity => this.isEntityAccepted(entity));
        await chorusFseAdapter.upsertMany(validEntities);
        return this.syncFlat(validEntities);
    }

    public savePaymentsFromStream(stream: ReadableStream<PaymentFlatEntity>) {
        return paymentFlatService.saveFromStream(stream);
    }

    // @TODO: sync this with paymentFlat.chorus.service
    public syncFlat(entities: ChorusFseEntity[]) {
        const stream = ReadableStream.from(entities.map(entity => ChorusFseMapper.toPaymentFlat(entity)));
        return this.savePaymentsFromStream(stream);
    }

    public async syncFlatByExercise(exercise: number) {
        const entities = await chorusFseAdapter.findByExercise(exercise);
        if (entities.length > 0) return this.syncFlat(entities);
        else return;
    }

    public async initFlat() {
        // @TODO: make an helper (asyncIterator, adapter) => ReadableStream
        const stream = ReadableStream.from(chorusFseAdapter.getIterableFindAll()).pipeThrough(
            new TransformStream({
                transform(chorusFseEntity, controller) {
                    controller.enqueue(ChorusFseMapper.toPaymentFlat(chorusFseEntity));
                },
            }),
        );
        return this.savePaymentsFromStream(stream);
    }
}

const chorusService = new ChorusService();

export default chorusService;
