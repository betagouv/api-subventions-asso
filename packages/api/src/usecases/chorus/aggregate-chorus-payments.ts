import AsyncUseCase from "../../@types/use-case/AsyncUseCase";
import chorusAdapter from "../../adapters/outputs/db/providers/chorus/chorus.adapter";
import { ChorusPort } from "../../adapters/outputs/db/providers/chorus/chorus.port";
import ChorusEntity from "../../domain/providers/chorus/ChorusEntity";
import { Siret } from "../../identifier-objects";
import { ChorusPaymentFlatEntity } from "../../modules/providers/chorus/@types/ChorusPaymentFlat";
import dataBretagneService, { DataBretagneService } from "../../modules/providers/data-bretagne/data-bretagne.service";
import chorusToPaymentFlat, { ChorusToPaymentFlat } from "./chorus-to-payment-flat";

export class AggregateChorusPayments implements AsyncUseCase<number | undefined, ChorusPaymentFlatEntity[]> {
    constructor(
        private chorusAdapter: ChorusPort,
        private dataBretagneService: DataBretagneService,
        private mapper: ChorusToPaymentFlat,
    ) {}

    async execute(exercise: number) {
        const { programs, ministries, fonctionalDomains, programsRef } =
            await this.dataBretagneService.getAllDataRecords();

        return this.toAggregatedPaymentFlatEntities(programs, ministries, fonctionalDomains, programsRef, exercise);
    }

    private async toAggregatedPaymentFlatEntities(
        programs,
        ministries,
        fonctionalDomains,
        programsRef,
        exercise: number,
    ) {
        const chorusCursor = this.chorusAdapter.cursorFindOnExercise(exercise);
        const entitiesByUniqueId: Record<string, ChorusPaymentFlatEntity> = {};

        const invalidDocuments: ChorusEntity[] = [];
        for await (const entity of chorusCursor) {
            try {
                // payment-flat does not handle other identifier than siret for now
                if (!(entity.identifier instanceof Siret)) {
                    invalidDocuments.push(entity);
                    continue;
                }
                const payment = this.mapper.execute({
                    chorusEntity: entity,
                    programs,
                    ministries,
                    fonctionalDomains,
                    programsRef,
                });

                if (entitiesByUniqueId[payment.uniqueId]) {
                    entitiesByUniqueId[payment.uniqueId].amount = parseFloat(
                        (entitiesByUniqueId[payment.uniqueId].amount + payment.amount).toFixed(2),
                    );
                } else {
                    entitiesByUniqueId[payment.uniqueId] = payment;
                }
            } catch (e) {
                // only occur if entity.siret is not a valid siret
                console.log((e as Error).message);
                continue;
            }
        }

        console.log(`Set aside ${invalidDocuments.length} chorus document with invalid establishment identifier`);
        console.log(
            `Here are some of them : \n${invalidDocuments
                .splice(0, 5)
                .map(document => `- ${document.identifier.value} \n`)
                .reduce((acc, str) => (acc += str), "")}`,
        );

        const entities = Object.values(entitiesByUniqueId);
        console.log(`${entities.length} documents transformed`);
        return entities;
    }
}

const aggregateChorusPayments = new AggregateChorusPayments(chorusAdapter, dataBretagneService, chorusToPaymentFlat);
export default aggregateChorusPayments;
