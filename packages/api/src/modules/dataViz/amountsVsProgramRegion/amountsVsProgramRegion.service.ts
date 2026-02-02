import { FindCursor } from "mongodb";
import { AmountsVsProgramRegionDto } from "dto";
import { ChorusPaymentFlatEntity } from "../../providers/chorus/@types/ChorusPaymentFlat";
import PaymentFlatEntity from "../../../entities/flats/PaymentFlatEntity";
import paymentFlatChorusService from "../../paymentFlat/paymentFlat.chorus.service";
import amountsVsProgramRegionPort from "../../../dataProviders/db/dataViz/amountVSProgramRegion/amountsVsProgramRegion.port";
import AmountsVsProgramRegionAdapter from "./amountsVsProgramRegion.adapter";
import AmountsVsProgramRegionEntity from "./entitiyAndDbo/amountsVsProgramRegion.entity";

export class AmountsVsProgramRegionService {
    public async toAmountsVsProgramRegionEntities(
        exerciceBudgetaire?: number,
    ): Promise<AmountsVsProgramRegionEntity[]> {
        const paymentFlatCursor: FindCursor<ChorusPaymentFlatEntity> =
            paymentFlatChorusService.cursorFindChorusOnly(exerciceBudgetaire);

        const entities: Record<string, AmountsVsProgramRegionEntity> = {};
        while (await paymentFlatCursor.hasNext()) {
            const document = (await paymentFlatCursor.next()) as PaymentFlatEntity;
            const key = `${document.regionAttachementComptable}-${document.programName}-${document.programNumber}-${document.exerciceBudgetaire}`;
            if (entities[key]) {
                entities[key].montant += parseFloat(document.amount.toFixed(2));
            } else {
                entities[key] = { ...AmountsVsProgramRegionAdapter.toNotAggregatedEntity(document) };
            }
        }
        return Object.values(entities);
    }

    public async init() {
        const entities = await this.toAmountsVsProgramRegionEntities();
        await amountsVsProgramRegionPort.insertMany(entities);
    }

    public async updateCollection(exerciceBudgetaire?: number) {
        const entities = await this.toAmountsVsProgramRegionEntities(exerciceBudgetaire);
        await amountsVsProgramRegionPort.upsertMany(entities);
    }

    public isCollectionInitialized() {
        return amountsVsProgramRegionPort.hasBeenInitialized();
    }

    public async getAmountsVsProgramRegionData() {
        return amountsVsProgramRegionPort.findAll() as Promise<AmountsVsProgramRegionDto[]>;
    }
}

const amountsVsProgramRegionService = new AmountsVsProgramRegionService();
export default amountsVsProgramRegionService;
