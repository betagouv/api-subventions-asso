import CacheData from "../../../shared/Cache";
import { asyncFilter } from "../../../shared/helpers/ArrayHelper";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import ProviderCore from "../provider.core";
import Siren from "../../../identifier-objects/Siren";
import chorusAdapter from "../../../adapters/outputs/db/providers/chorus/chorus.adapter";
import ChorusEntity from "./entities/ChorusEntity";
import associationHelper from "../../associations/associations.helper";
import AssociationIdentifier from "../../../identifier-objects/AssociationIdentifier";
import Siret from "../../../identifier-objects/Siret";
import ChorusFseEntity from "./entities/ChorusFseEntity";
import chorusFseAdapter from "../../../adapters/outputs/db/providers/chorus/chorus-fse.adapter";
import PaymentFlatProvider from "../../payment-flat/@types/paymentFlatProvider";
import paymentFlatService from "../../payment-flat/payment-flat.service";
import PaymentFlatEntity from "../../../entities/flats/PaymentFlatEntity";
import transformFseToFlat, { TransformFseToFlat } from "./use-cases/transform-fse-to-flat";

export interface RejectedRequest {
    state: "rejected";
    result: { message: string; data: unknown };
}

export class ChorusService extends ProviderCore implements PaymentFlatProvider {
    constructor(private transformFseToFlat: TransformFseToFlat) {
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

    // @TODO: sync this with payment-flat.chorus.service
    public syncFlat(entities: ChorusFseEntity[]) {
        const stream = ReadableStream.from(entities.map(entity => this.transformFseToFlat.execute(entity)));
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
                transform: (chorusFseEntity, controller) => {
                    controller.enqueue(this.transformFseToFlat.execute(chorusFseEntity));
                },
            }),
        );
        return this.savePaymentsFromStream(stream);
    }
}

const chorusService = new ChorusService(transformFseToFlat);

export default chorusService;
