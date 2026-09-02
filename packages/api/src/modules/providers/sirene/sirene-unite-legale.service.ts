import uniteLegaleEntrepriseService from "../unite-legale-entreprise/unite-legale.entreprise.service";
import { UniteLegaleEntrepriseEntity } from "../../../entities/UniteLegaleEntrepriseEntity";
import UniteLegaleNameService from "../unite-legale-name/unite-legale.name.service";
import SireneStockUniteLegaleMapper from "./mappers/sirene-unite-legale.mapper";
import Siren from "../../../identifier-objects/Siren";
import SireneStockUniteLegaleParser from "./parser/sirene-stock-unite-legale.parser";
import { SireneUniteLegaleEntity } from "../../../entities/SireneUniteLegaleEntity";
import sireneUniteLegaleAdapter from "../../../adapters/outputs/db/sirene/sirene-unite-legale.adapter";

export class SireneUniteLegaleService {
    public async parse(filePath: string) {
        await SireneStockUniteLegaleParser.parseCsvAndInsert(
            filePath,
            this._saveBatchAssoData.bind(this),
            this._saveBatchNonAssoData.bind(this),
        );
    }

    public async _saveBatchAssoData(batchAssosToSave: SireneUniteLegaleEntity[]) {
        await Promise.all([
            this.upsertMany(batchAssosToSave),
            UniteLegaleNameService.upsertMany(
                batchAssosToSave.map(e => SireneStockUniteLegaleMapper.entityToUniteLegaleNameEntity(e)),
            ),
        ]);
    }

    public async _saveBatchNonAssoData(batchNonAssosToSave: SireneUniteLegaleEntity[]) {
        await uniteLegaleEntrepriseService.insertManyEntrepriseSiren(
            batchNonAssosToSave.map(e => new UniteLegaleEntrepriseEntity(e.siren)),
        );
    }

    public insertOne(dbo: SireneUniteLegaleEntity) {
        return sireneUniteLegaleAdapter.insertOne(dbo);
    }

    public upsertMany(dbos: SireneUniteLegaleEntity[]) {
        return sireneUniteLegaleAdapter.upsertMany(dbos);
    }

    public findOneBySiren(siren: Siren) {
        return sireneUniteLegaleAdapter.findOneBySiren(siren);
    }

    public findAll() {
        return sireneUniteLegaleAdapter.findAll();
    }
}

const sireneUniteLegaleService = new SireneUniteLegaleService();
export default sireneUniteLegaleService;
