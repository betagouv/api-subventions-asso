import paymentFlatChorusService, { PaymentFlatChorusService } from "../../../payment-flat/payment-flat.chorus.service";
import chorusService, { ChorusService } from "../chorus.service";

export class UpdateFlatByExercise {
    constructor(
        private paymentFlatChorusService: PaymentFlatChorusService,
        private chorusService: ChorusService,
    ) {}

    /**
     * Exercice should be of type number but when invoking from CLI it will always be a string
     * @param exercise
     */
    async execute(exercise: number) {
        // @TODO: check if this is really needed after performance refactor
        const ticTacInterval = setInterval(() => console.log("TIC"), 60000);
        await this.paymentFlatChorusService.updatePaymentsFlatCollection(exercise);
        await this.chorusService.syncFlatByExercise(exercise);
        clearInterval(ticTacInterval);
    }
}

const updateFlatByExercise = new UpdateFlatByExercise(paymentFlatChorusService, chorusService);
export default updateFlatByExercise;
