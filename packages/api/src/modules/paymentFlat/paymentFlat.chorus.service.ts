import paymentFlatPort from "../../dataProviders/db/paymentFlat/paymentFlat.port";
import PaymentFlatEntity from "../../entities/PaymentFlatEntity";
import { ChorusPaymentFlatEntity } from "../providers/chorus/@types/ChorusPaymentFlat";
import ChorusAdapter from "../providers/chorus/adapters/ChorusAdapter";
import chorusService from "../providers/chorus/chorus.service";
import ChorusLineEntity from "../providers/chorus/entities/ChorusLineEntity";
import dataBretagneService from "../providers/dataBretagne/dataBretagne.service";
import paymentFlatService from "./paymentFlat.service";

// TODO: this was only created to extract chorus dependent process from paymentFlatService
// This should be better thought and refactored
class PaymentFlatChorusService {
    private BATCH_SIZE = 50000;

    // init chorus data in paymentFlat (all exercises since 2017)
    public async init() {
        const { programs, ministries, fonctionalDomains, programsRef } = await dataBretagneService.getAllDataRecords();

        const START_YEAR = 2017;
        const END_YEAR = new Date().getFullYear();
        let chorusEntities: PaymentFlatEntity[] = [];

        for (let year = START_YEAR; year <= END_YEAR; year++) {
            console.log(`init payment flat collection for exercise ${year}`);

            chorusEntities = await this.toAggregatedPaymentFlatEntities(
                programs,
                ministries,
                fonctionalDomains,
                programsRef,
                year,
            );

            for (let i = 0; i < chorusEntities.length; i += this.BATCH_SIZE) {
                const batchEntities = chorusEntities.slice(i, i + this.BATCH_SIZE);
                await paymentFlatPort.insertMany(batchEntities);
                console.log(`Inserted ${i + this.BATCH_SIZE} documents`);
            }
        }
    }

    /**
     *  Create a list of PaymentFlatEntity from ChorusLine collection
     *  It aggregates NotAggregatedChorusPaymentFlatEntity having the same uniqueId, to calculate the total amount
     */
    // TODO: move this in ChorusAdapter ?
    // We should rename this to toAggregatedPaymentFlat
    // And explain somewhere that to be able to store a PaymentFlat from Chorus we need to aggregate some of them (and why)
    public async toAggregatedPaymentFlatEntities(
        programs,
        ministries,
        fonctionalDomains,
        programsRef,
        exerciceBudgetaire?: number,
    ) {
        const chorusCursor = chorusService.cursorFind(exerciceBudgetaire);
        const entities: Record<string, ChorusPaymentFlatEntity> = {};

        while (await chorusCursor.hasNext()) {
            const document = (await chorusCursor.next()) as ChorusLineEntity;
            let paymentFlatEntity;

            try {
                paymentFlatEntity = ChorusAdapter.toNotAggregatedPaymentFlatEntity(
                    document,
                    programs,
                    ministries,
                    fonctionalDomains,
                    programsRef,
                );
            } catch (e) {
                console.log((e as Error).message);
                // means that a chorus line is not valid to be inserted in payment flat
                continue;
            }

            if (entities[paymentFlatEntity.uniqueId]) {
                entities[paymentFlatEntity.uniqueId].amount = parseFloat(
                    (entities[paymentFlatEntity.uniqueId].amount + paymentFlatEntity.amount).toFixed(2),
                );
            } else {
                entities[paymentFlatEntity.uniqueId] = paymentFlatEntity;
            }
        }
        return Object.values(entities);
    }

    public async updatePaymentsFlatCollection(exerciceBudgetaire?: number) {
        const { programs, ministries, fonctionalDomains, programsRef } = await dataBretagneService.getAllDataRecords();

        const chorusEntities: PaymentFlatEntity[] = await this.toAggregatedPaymentFlatEntities(
            programs,
            ministries,
            fonctionalDomains,
            programsRef,
            exerciceBudgetaire,
        );

        for (let i = 0; i < chorusEntities.length; i += this.BATCH_SIZE) {
            const batchEntities = chorusEntities.slice(i, i + this.BATCH_SIZE);
            await paymentFlatService.upsertMany(batchEntities);
        }
        console.log("All documents inserted");
    }

    public cursorFindChorusOnly(exerciceBudgetaire?: number) {
        return paymentFlatPort.cursorFindChorusOnly(exerciceBudgetaire);
    }
}

const paymentFlatChorusService = new PaymentFlatChorusService();
export default paymentFlatChorusService;
