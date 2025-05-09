import sireneUniteLegaleDbPort from "../../../../dataProviders/db/sirene/stockUniteLegale/sireneStockUniteLegale.port";
import uniteLegalEntreprisesService from "../../uniteLegalEntreprises/uniteLegal.entreprises.service";
import { UniteLegalEntrepriseEntity } from "../../../../entities/UniteLegalEntrepriseEntity";
import uniteLegalNameService from "../../uniteLegalName/uniteLegal.name.service";
import { SireneStockUniteLegaleEntity } from "../../../../entities/SireneStockUniteLegaleEntity";
import SireneStockUniteLegaleParser from "./parser/sireneStockUniteLegale.parser";
import SireneStockUniteLegaleAdapter from "./adapter/sireneStockUniteLegale.adapter";

export class SireneStockUniteLegaleService {
    public async parse(filePath: string) {
        await SireneStockUniteLegaleParser.parseCsvAndInsert(
            filePath,
            this._saveBatchAssoData.bind(this),
            this._saveBatchNonAssoData.bind(this),
        );
    }

    public async _saveBatchAssoData(batchAssosToSave: SireneStockUniteLegaleEntity[]) {
        await Promise.all([
            this.upsertMany(batchAssosToSave),
            uniteLegalNameService.upsertMany(
                batchAssosToSave.map(e => SireneStockUniteLegaleAdapter.entityToUniteLegaleNameEntity(e)),
            ),
        ]);
    }

    public async _saveBatchNonAssoData(batchNonAssosToSave: SireneStockUniteLegaleEntity[]) {
        await uniteLegalEntreprisesService.insertManyEntrepriseSiren(
            batchNonAssosToSave.map(e => new UniteLegalEntrepriseEntity(e.siren)),
        );
    }

    public insertOne(dbo: SireneStockUniteLegaleEntity) {
        return sireneUniteLegaleDbPort.insertOne(dbo);
    }

    public upsertMany(dbos: SireneStockUniteLegaleEntity[]) {
        return sireneUniteLegaleDbPort.upsertMany(dbos);
    }
}

const sireneStockUniteLegaleService = new SireneStockUniteLegaleService();
export default sireneStockUniteLegaleService;
