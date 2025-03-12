import sireneUniteLegaleDbPort from "../../../../dataProviders/db/sirene/stockUniteLegale/sireneStockUniteLegale.port";
import uniteLegalEntreprisesService from "../../uniteLegalEntreprises/uniteLegal.entreprises.service";
import { UniteLegalEntrepriseEntity } from "../../../../entities/UniteLegalEntrepriseEntity";
import uniteLegalNameService from "../../uniteLegalName/uniteLegal.name.service";
import { SireneStockUniteLegaleEntity } from "../../../../entities/SireneStockUniteLegaleEntity";
import { SireneUniteLegaleDbo } from "./@types/SireneUniteLegaleDbo";
import SireneStockUniteLegaleParser from "./parser/sireneStockUniteLegale.parser";
import SireneStockUniteLegaleAdapter from "./adapter/sireneStockUniteLegale.adapter";

export class SireneStockUniteLegaleService {
    public async parse(filePath: string) {
        await SireneStockUniteLegaleParser.parseCsvAndInsert(
            filePath,
            this._saveBatchAssoData,
            this._saveBatchNonAssoData,
        );
    }

    public async _saveBatchAssoData(batchAssosToSave: SireneStockUniteLegaleEntity[]) {
        await Promise.all([
            this.insertMany(batchAssosToSave.map(entity => SireneStockUniteLegaleAdapter.entityToDbo(entity))),
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

    public insertOne(dbo: SireneUniteLegaleDbo) {
        return sireneUniteLegaleDbPort.insertOne(dbo);
    }

    public insertMany(dbos: SireneUniteLegaleDbo[]) {
        return sireneUniteLegaleDbPort.insertMany(dbos);
    }
}

const sireneStockUniteLegaleService = new SireneStockUniteLegaleService();
export default sireneStockUniteLegaleService;
