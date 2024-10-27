import { FindCursor, WithId } from "mongodb";
import paymentFlatPort from "../../../dataProviders/db/paymentFlat/paymentFlat.port";
import dataBretagneService from "../../providers/dataBretagne/dataBretagne.service";
import chorusService from "../../providers/chorus/chorus.service";
import PaymentFlatEntity from "../../../entities/PaymentFlatEntity";
import ChorusLineEntity from "../../providers/chorus/entities/ChorusLineEntity";
import PaymentFlatAdapter from "./paymentFlatAdapter";

export class PaymentFlatService {
    private async getAllDataBretagneData() {
        const ministries = await dataBretagneService.getMinistriesRecord();
        const programs = await dataBretagneService.findProgramsRecord();
        const domainesFonct = await dataBretagneService.getDomaineFonctRecord();
        const refsProgrammation = await dataBretagneService.getRefProgrammationRecord();
        return { programs, ministries, domainesFonct, refsProgrammation };
    }

    public async toPaymentFlatChorusEntities(
        programs,
        ministries,
        domainesFonct,
        refsProgrammation,
        exerciceBudgetaire?: number,
    ) {
        /*
        from the chorus collection, create a list of PaymentFlatEntity 
        by aggregating NotAggregatedChorusPaymentFlatEntity having the same uniqueId
        */
        let chorusCursor: FindCursor<WithId<ChorusLineEntity>>;
        if (exerciceBudgetaire) {
            chorusCursor = chorusService.cursorFindData(exerciceBudgetaire);
        } else {
            chorusCursor = chorusService.cursorFindData();
        }
        let document = await chorusCursor.next();
        const entities: Record<string, PaymentFlatEntity> = {};

        while (document != null) {
            const paymentFlatEntity = PaymentFlatAdapter.toNotAggregatedChorusPaymentFlatEntity(
                document,
                programs,
                ministries,
                domainesFonct,
                refsProgrammation,
            );

            if (entities[paymentFlatEntity.uniqueId]) {
                entities[paymentFlatEntity.uniqueId].amount += paymentFlatEntity.amount;
                entities[paymentFlatEntity.uniqueId].amount = parseFloat(
                    entities[paymentFlatEntity.uniqueId].amount.toFixed(2),
                );
            } else {
                entities[paymentFlatEntity.uniqueId] = paymentFlatEntity;
            }

            document = await chorusCursor.next();
        }
        return Object.values(entities);
    }

    public async updatePaymentsFlatCollection(exerciceBudgetaire?: number) {
        const { programs, ministries, domainesFonct, refsProgrammation } = await this.getAllDataBretagneData();

        const chorusEntities: PaymentFlatEntity[] = await this.toPaymentFlatChorusEntities(
            programs,
            ministries,
            domainesFonct,
            refsProgrammation,
            exerciceBudgetaire,
        );
        const entityPromises = chorusEntities.map(entity => paymentFlatPort.upsertOne(entity));

        await Promise.all(entityPromises);
    }
}

const paymentFlatService = new PaymentFlatService();
export default paymentFlatService;
