import paymentFlatPort from "../../dataProviders/db/paymentFlat/paymentFlat.port";
import PaymentFlatEntity from "../../entities/flats/PaymentFlatEntity";
import EstablishmentIdentifier from "../../identifierObjects/EstablishmentIdentifier";
import { ChorusPaymentFlatEntity } from "../providers/chorus/@types/ChorusPaymentFlat";
import ChorusAdapter from "../providers/chorus/adapters/ChorusAdapter";
import chorusService from "../providers/chorus/chorus.service";
import ChorusLineEntity from "../providers/chorus/entities/ChorusLineEntity";
import dataBretagneService from "../providers/dataBretagne/dataBretagne.service";
import PaymentFlatProvider from "./@types/paymentFlatProvider";
import paymentFlatService from "./paymentFlat.service";

// TODO: this was only created to extract chorus dependent process from paymentFlatService
// This should be better thought and refactored
class PaymentFlatChorusService implements PaymentFlatProvider {
    // init chorus data in paymentFlat (all exercises since 2017)
    public async init() {
        const { programs, ministries, fonctionalDomains, programsRef } = await dataBretagneService.getAllDataRecords();

        const START_YEAR = 2017;
        const END_YEAR = new Date().getFullYear();

        for (let year = START_YEAR; year <= END_YEAR; year++) {
            console.log(`init payment flat collection for exercise ${year}`);

            const payments = await this.toAggregatedPaymentFlatEntities(
                programs,
                ministries,
                fonctionalDomains,
                programsRef,
                year,
            );

            // if no payments for year, we move on
            // mainly used for current year if no data has been added yet
            if (payments.length === 0) continue;

            await this.addToPaymentFlat(payments);
            console.log("All documents inserted");
        }
    }

    public async addToPaymentFlat(payments: ChorusPaymentFlatEntity[]) {
        const stream = ReadableStream.from(payments);
        await this.savePaymentsFromStream(stream);
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
        const entitiesByUniqueId: Record<string, ChorusPaymentFlatEntity> = {};

        const invalidDocuments: ChorusLineEntity[] = [];
        while (await chorusCursor.hasNext()) {
            const document = (await chorusCursor.next()) as ChorusLineEntity;

            // filter chorus documents with wrong or weird establishment identifier
            // that will make payment-flat adaptation fails
            if (!EstablishmentIdentifier.getIdentifierType(document.indexedInformations.siret)) {
                invalidDocuments.push(document);
                continue;
            }

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

            if (entitiesByUniqueId[paymentFlatEntity.uniqueId]) {
                entitiesByUniqueId[paymentFlatEntity.uniqueId].amount = parseFloat(
                    (entitiesByUniqueId[paymentFlatEntity.uniqueId].amount + paymentFlatEntity.amount).toFixed(2),
                );
            } else {
                entitiesByUniqueId[paymentFlatEntity.uniqueId] = paymentFlatEntity;
            }
        }

        console.log(`Set aside ${invalidDocuments.length} chorus document with invalid establishment identifier`);
        console.log(
            `Here are some of them : \n${invalidDocuments
                .splice(0, 5)
                .map(document => `- ${document.indexedInformations.siret} \n`)
                .reduce((acc, str) => (acc += str), "")}`,
        );

        const entities = Object.values(entitiesByUniqueId);
        console.log(`${entities.length} documents transformed`);
        return entities;
    }

    public async updatePaymentsFlatCollection(exerciceBudgetaire?: number) {
        const { programs, ministries, fonctionalDomains, programsRef } = await dataBretagneService.getAllDataRecords();

        const payments = await this.toAggregatedPaymentFlatEntities(
            programs,
            ministries,
            fonctionalDomains,
            programsRef,
            exerciceBudgetaire,
        );

        await this.addToPaymentFlat(payments);

        console.log("All documents inserted");
    }

    public savePaymentsFromStream(stream: ReadableStream<PaymentFlatEntity>) {
        return paymentFlatService.saveFromStream(stream);
    }

    public cursorFindChorusOnly(exerciceBudgetaire?: number) {
        return paymentFlatPort.cursorFindChorusOnly(exerciceBudgetaire);
    }
}

const paymentFlatChorusService = new PaymentFlatChorusService();
export default paymentFlatChorusService;
