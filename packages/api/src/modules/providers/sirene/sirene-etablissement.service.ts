import Siret from "../../../identifier-objects/Siret";
import { SireneEtablissementEntity } from "../../../entities/SireneEtablissementEntity";
import sireneEtablissementAdapter from "../../../adapters/outputs/db/sirene/sirene-etablissement.adapter";
import SireneStockEtablissementParser from "./parser/sirene-stock-etablissement.parser";
import sireneUniteLegaleService from "./sirene-unite-legale.service";

export class SireneEtablissementService {
    public async parse(filePath: string) {
        if (!(await sireneUniteLegaleService.findAll()).length) {
            throw new Error("Sirene unite legale collection must be imported before sirene etablissements");
        }

        await SireneStockEtablissementParser.parseParquetAndInsert(
            filePath,
            this._findExistingAssociationSirens.bind(this),
            this._saveBatchData.bind(this),
        );
    }

    public async _saveBatchData(batchToSave: SireneEtablissementEntity[]) {
        await this.upsertMany(batchToSave);
    }

    public _findExistingAssociationSirens(sirens: string[]) {
        return sireneUniteLegaleService.findSirens(sirens);
    }

    public upsertMany(dbos: SireneEtablissementEntity[]) {
        return sireneEtablissementAdapter.upsertMany(dbos);
    }

    public findOneBySiret(siret: Siret) {
        return sireneEtablissementAdapter.findOneBySiret(siret);
    }
}

const sireneEtablissementService = new SireneEtablissementService();
export default sireneEtablissementService;
