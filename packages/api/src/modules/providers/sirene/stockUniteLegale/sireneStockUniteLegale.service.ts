import sireneUniteLegaleDbAdapter from "../../../../adapters/outputs/db/sirene/stock-unite-legale/sirene-stock-unite-legale.adapter";
import uniteLegalEntreprisesService from "../../uniteLegalEntreprises/uniteLegal.entreprises.service";
import { UniteLegalEntrepriseEntity } from "../../../../entities/UniteLegalEntrepriseEntity";
import uniteLegalNameService from "../../uniteLegalName/uniteLegal.name.service";
import { SireneStockUniteLegaleEntity } from "../../../../entities/SireneStockUniteLegaleEntity";
import SireneStockUniteLegaleParser from "./parser/sireneStockUniteLegale.parser";
import SireneStockUniteLegaleMapper from "./mappers/sirene-stock-unite-legale.mapper";
import Siren from "../../../../identifierObjects/Siren";

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
                batchAssosToSave.map(e => SireneStockUniteLegaleMapper.entityToUniteLegaleNameEntity(e)),
            ),
        ]);
    }

    public async _saveBatchNonAssoData(batchNonAssosToSave: SireneStockUniteLegaleEntity[]) {
        await uniteLegalEntreprisesService.insertManyEntrepriseSiren(
            batchNonAssosToSave.map(e => new UniteLegalEntrepriseEntity(e.siren)),
        );
    }

    public insertOne(dbo: SireneStockUniteLegaleEntity) {
        return sireneUniteLegaleDbAdapter.insertOne(dbo);
    }

    public upsertMany(dbos: SireneStockUniteLegaleEntity[]) {
        return sireneUniteLegaleDbAdapter.upsertMany(dbos);
    }

    public findOneBySiren(siren: Siren) {
        return sireneUniteLegaleDbAdapter.findOneBySiren(siren);
    }
}

const sireneStockUniteLegaleService = new SireneStockUniteLegaleService();
export default sireneStockUniteLegaleService;
