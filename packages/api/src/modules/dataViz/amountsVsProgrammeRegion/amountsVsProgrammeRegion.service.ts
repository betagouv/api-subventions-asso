import { FindCursor } from "mongodb";
import PaymentFlatEntity from "../../../entities/PaymentFlatEntity";
import paymentFlatService from "../../paymentFlat/paymentFlat.service";
import AmountsVsProgrammeRegionAdapter from "./amountsVsProgrammeRegion.adapter";
import amountsVsProgrammeRegionEntity from "./entitiyAndDbo/amountsVsProgrammeRegion.entity";
import amountsVsProgrammeRegionPort from "../../../dataProviders/db/dataViz/amountVSProgrammeRegion/amountsVsProgrammeRegion.port";


export class AmountsVsProgrammeRegionService {

    public async toAmountsVsProgrammeRegionEntities(exerciceBudgetaire?: number) : Promise<amountsVsProgrammeRegionEntity[]> {
        let paymentFlatCursor : FindCursor<PaymentFlatEntity>;

        paymentFlatCursor = paymentFlatService.cursorFindChorusOnly(exerciceBudgetaire);
        
        const entities : Record<string, amountsVsProgrammeRegionEntity> = {};
        while (await paymentFlatCursor.hasNext()) {
        
            const document = (await paymentFlatCursor.next()) as PaymentFlatEntity;
            const key = `${document.regionAttachementComptable}-${document.programName}-${document.programNumber}`;
        
            if (entities[key]) {
            
                entities[key].amount += parseFloat(document.amount.toFixed(2));
            }
            else {      
                entities[key] = {...AmountsVsProgrammeRegionAdapter.toNotAggregatedEntity(document)};
               
            }
        }
        return Object.values(entities)
    }

    public async init() {
        const entities = await this.toAmountsVsProgrammeRegionEntities();
        await amountsVsProgrammeRegionPort.insertMany(entities);
    }

    public async updatePaymentsFlatCollection(exerciceBudgetaire?: number) {
        const entities = await this.toAmountsVsProgrammeRegionEntities(exerciceBudgetaire);
        await amountsVsProgrammeRegionPort.upsertMany(entities);
    }

}

const amountsVsProgrammeRegionService = new AmountsVsProgrammeRegionService();
export default amountsVsProgrammeRegionService;