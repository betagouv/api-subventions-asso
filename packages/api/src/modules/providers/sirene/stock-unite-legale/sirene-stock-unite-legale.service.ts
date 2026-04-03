import sireneUniteLegaleDbAdapter from "../../../../adapters/outputs/db/sirene/stock-unite-legale/sirene-stock-unite-legale.adapter";
import uniteLegaleEntrepriseService from "../../unite-legale-entreprise/unite-legale.entreprise.service";
import { UniteLegaleEntrepriseEntity } from "../../../../entities/UniteLegaleEntrepriseEntity";
import UniteLegaleNameService from "../../unite-legale-name/unite-legale.name.service";
import { SireneStockUniteLegaleEntity } from "../../../../entities/SireneStockUniteLegaleEntity";
import SireneStockUniteLegaleMapper from "./mappers/sirene-stock-unite-legale.mapper";
import Siren from "../../../../identifier-objects/Siren";
import SireneStockUniteLegaleParser from "./parser/sirene-stock-unite-legale.parser";

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
            UniteLegaleNameService.upsertMany(
                batchAssosToSave.map(e => SireneStockUniteLegaleMapper.entityToUniteLegaleNameEntity(e)),
            ),
        ]);
    }

    public async _saveBatchNonAssoData(batchNonAssosToSave: SireneStockUniteLegaleEntity[]) {
        await uniteLegaleEntrepriseService.insertManyEntrepriseSiren(
            batchNonAssosToSave.map(e => new UniteLegaleEntrepriseEntity(e.siren)),
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
