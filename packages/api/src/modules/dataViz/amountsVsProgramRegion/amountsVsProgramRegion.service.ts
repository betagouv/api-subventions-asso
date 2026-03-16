import { FindCursor } from "mongodb";
import { AmountsVsProgramRegionDto } from "dto";
import { ChorusPaymentFlatEntity } from "../../providers/chorus/@types/ChorusPaymentFlat";
import PaymentFlatEntity from "../../../entities/flats/PaymentFlatEntity";
import paymentFlatChorusService from "../../paymentFlat/paymentFlat.chorus.service";
import amountsVsProgramRegionAdapter from "../../../dataProviders/db/dataViz/amountVSProgramRegion/amountsVsProgramRegion.adapter";
import AmountsVsProgramRegionMapper from "./amounts-vs-program-region.mapper";
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
            const key = `${document.accountingAttachmentRegion}-${document.programName}-${document.programNumber}-${document.budgetaryYear}`;
            if (entities[key]) {
                entities[key].montant += parseFloat(document.amount.toFixed(2));
            } else {
                entities[key] = { ...AmountsVsProgramRegionMapper.toNotAggregatedEntity(document) };
            }
        }
        return Object.values(entities);
    }

    public async init() {
        const entities = await this.toAmountsVsProgramRegionEntities();
        await amountsVsProgramRegionAdapter.insertMany(entities);
    }

    public async updateCollection(exerciceBudgetaire?: number) {
        const entities = await this.toAmountsVsProgramRegionEntities(exerciceBudgetaire);
        await amountsVsProgramRegionAdapter.upsertMany(entities);
    }

    public isCollectionInitialized() {
        return amountsVsProgramRegionAdapter.hasBeenInitialized();
    }

    public async getAmountsVsProgramRegionData() {
        return amountsVsProgramRegionAdapter.findAll() as Promise<AmountsVsProgramRegionDto[]>;
    }
}

const amountsVsProgramRegionService = new AmountsVsProgramRegionService();
export default amountsVsProgramRegionService;
