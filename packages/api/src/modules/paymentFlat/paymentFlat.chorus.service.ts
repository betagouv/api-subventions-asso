import paymentFlatPort from "../../dataProviders/db/paymentFlat/paymentFlat.port";
import PaymentFlatEntity from "../../entities/PaymentFlatEntity";
import ChorusAdapter from "../providers/chorus/adapters/ChorusAdapter";
import chorusService from "../providers/chorus/chorus.service";
import ChorusLineEntity from "../providers/chorus/entities/ChorusLineEntity";
import dataBretagneService from "../providers/dataBretagne/dataBretagne.service";
import PaymentFlatAdapter from "./paymentFlatAdapter";

// TODO: this was only created to extract chorus dependent process from paymentFlatService
// This should be better thought and refactored
class PaymentFlatChorusService {
    private BATCH_SIZE = 50000;

    private async getAllDataBretagneData() {
        const ministries = await dataBretagneService.getMinistriesRecord();
        const programs = await dataBretagneService.findProgramsRecord();
        const domainesFonct = await dataBretagneService.getDomaineFonctRecord();
        const refsProgrammation = await dataBretagneService.getRefProgrammationRecord();

        return { programs, ministries, domainesFonct, refsProgrammation };
    }

    // init chorus data in paymentFlat (all exercises since 2017)
    public async init() {
        const { programs, ministries, domainesFonct, refsProgrammation } = await this.getAllDataBretagneData();

        const START_YEAR = 2017;
        const END_YEAR = new Date().getFullYear();
        let chorusEntities: PaymentFlatEntity[] = [];

        for (let year = START_YEAR; year <= END_YEAR; year++) {
            console.log(`init payment flat collection for exercise ${year}`);

            chorusEntities = await this.toPaymentFlatChorusEntities(
                programs,
                ministries,
                domainesFonct,
                refsProgrammation,
                year,
            );

            for (let i = 0; i < chorusEntities.length; i += this.BATCH_SIZE) {
                const batchEntities = chorusEntities.slice(i, i + this.BATCH_SIZE);
                await paymentFlatPort.insertMany(batchEntities);
                console.log(`Inserted ${i + this.BATCH_SIZE} documents`);
            }
        }
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
        let chorusCursor;
        if (exerciceBudgetaire) {
            chorusCursor = chorusService.cursorFind(exerciceBudgetaire);
        } else {
            chorusCursor = chorusService.cursorFind();
        }
        const entities: Record<string, PaymentFlatEntity> = {};

        while (await chorusCursor.hasNext()) {
            const document = (await chorusCursor.next()) as ChorusLineEntity;

            const paymentFlatEntity = ChorusAdapter.toNotAggregatedChorusPaymentFlatEntity(
                document,
                programs,
                ministries,
                domainesFonct,
                refsProgrammation,
            );

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
        const { programs, ministries, domainesFonct, refsProgrammation } = await this.getAllDataBretagneData();

        const chorusEntities: PaymentFlatEntity[] = await this.toPaymentFlatChorusEntities(
            programs,
            ministries,
            domainesFonct,
            refsProgrammation,
            exerciceBudgetaire,
        );

        for (let i = 0; i < chorusEntities.length; i += this.BATCH_SIZE) {
            const batchEntities = chorusEntities.slice(i, i + this.BATCH_SIZE);

            const bulkWriteArray = batchEntities.map(entity => {
                const DboWithoutId = PaymentFlatAdapter.toDbo(entity);
                return {
                    updateOne: {
                        filter: { uniqueId: DboWithoutId.uniqueId },
                        update: { $set: DboWithoutId },
                        upsert: true,
                    },
                };
            });

            await paymentFlatPort.upsertMany(bulkWriteArray);
        }
        console.log("All documents inserted");
    }

    public cursorFindChorusOnly(exerciceBudgetaire?: number) {
        return paymentFlatPort.cursorFindChorusOnly(exerciceBudgetaire);
    }
}

const paymentFlatChorusService = new PaymentFlatChorusService();
export default paymentFlatChorusService;
