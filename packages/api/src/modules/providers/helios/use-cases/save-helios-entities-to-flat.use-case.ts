import { ApplicationFlatService } from "../../../application-flat/application-flat.service";
import { PaymentFlatService } from "../../../payment-flat/payment-flat.service";
import HeliosEntity from "../domain/helios.entity";
import TransformHeliosEntitiesToFlat from "./transform-helios-entities-to-flat.use-case";
import { ReadableStream } from "node:stream/web";

export default class SaveHeliosEntitiesToFlatUseCase {
    constructor(
        private transformEntitiesToFlat: TransformHeliosEntitiesToFlat,
        private applicationFlatService: ApplicationFlatService,
        private paymentFlatService: PaymentFlatService,
    ) {}

    async execute(entities: HeliosEntity[]) {
        const { payments, applications } = await this.transformEntitiesToFlat.execute(entities);
        return Promise.all([
            // @TODO: if we decide to fully commit to hexagonal architecture, make this a use case
            // @TOUGHTS: make saveStream available from port and create a use case SaveFlatFromStream(FlatPort)
            this.paymentFlatService.saveFromStream(ReadableStream.from(payments)),
            this.applicationFlatService.saveFromStream(ReadableStream.from(applications)),
        ]);
    }
}
