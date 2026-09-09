import { Readable, Transform, Writable } from "stream";
import { pipeline } from "stream/promises";

import uniteLegaleEntrepriseService from "../unite-legale-entreprise/unite-legale.entreprise.service";
import { UniteLegaleEntrepriseEntity } from "../../../entities/UniteLegaleEntrepriseEntity";
import UniteLegaleNameService from "../unite-legale-name/unite-legale.name.service";
import SireneStockUniteLegaleMapper from "./mappers/sirene-unite-legale.mapper";
import Siren from "../../../identifier-objects/Siren";
import SireneStockUniteLegaleParser from "./parser/sirene-stock-unite-legale.parser";
import { SireneUniteLegaleEntity } from "../../../entities/SireneUniteLegaleEntity";
import sireneUniteLegaleAdapter from "../../../adapters/outputs/db/sirene/sirene-unite-legale.adapter";
import SireneUniteLegaleDto from "./@types/SireneUniteLegaleDto";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../../shared/LegalCategoriesAccepted";

export class SireneUniteLegaleService {
    private static SAVE_BATCH_SIZE = 1000;

    public async parse(filePath: string) {
        let batchAssos: SireneUniteLegaleEntity[] = [];
        let batchNonAssos: SireneUniteLegaleEntity[] = [];

        await pipeline([
            Readable.from(SireneStockUniteLegaleParser.parse(filePath)),
            new Transform({
                objectMode: true,
                transform: (batch: SireneUniteLegaleDto[], _enc, callback) => {
                    try {
                        callback(
                            null,
                            batch
                                .filter(dto => this.isCorrect(dto))
                                .map(dto => SireneStockUniteLegaleMapper.dtoToEntity(dto)),
                        );
                    } catch (err) {
                        callback(err as Error);
                    }
                },
            }),
            new Writable({
                objectMode: true,
                write: async (entities: SireneUniteLegaleEntity[], _enc, callback) => {
                    try {
                        for (const entity of entities) {
                            if (this.isAsso(entity)) {
                                batchAssos.push(entity);
                                if (batchAssos.length === SireneUniteLegaleService.SAVE_BATCH_SIZE) {
                                    const batchToSave = batchAssos;
                                    batchAssos = [];
                                    await this._saveBatchAssoData(batchToSave);
                                }
                            } else {
                                batchNonAssos.push(entity);
                                if (batchNonAssos.length === SireneUniteLegaleService.SAVE_BATCH_SIZE) {
                                    const batchToSave = batchNonAssos;
                                    batchNonAssos = [];
                                    await this._saveBatchNonAssoData(batchToSave);
                                }
                            }
                        }
                        callback();
                    } catch (err) {
                        callback(err as Error);
                    }
                },
                final: async callback => {
                    try {
                        if (batchAssos.length > 0) await this._saveBatchAssoData(batchAssos);
                        if (batchNonAssos.length > 0) await this._saveBatchNonAssoData(batchNonAssos);
                        callback();
                    } catch (err) {
                        callback(err as Error);
                    }
                },
            }),
        ]);
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

    private isCorrect(data: SireneUniteLegaleDto) {
        const unitePurgee = data.unitePurgeeUniteLegale;
        /* for storage reasons, data concerning companies
            ceased before 31/12/2002 are purged.
            * unitePurgee == true if the company has been purged
            * unitePurgee == "" if the company has not been purged
        */

        return unitePurgee == "" && Siren.isSiren(data.siren);
    }

    private isAsso(data: SireneUniteLegaleEntity) {
        const categorieJuridique = data.categorieJuridiqueUniteLegale;
        return LEGAL_CATEGORIES_ACCEPTED.includes(categorieJuridique);
    }
}

const sireneUniteLegaleService = new SireneUniteLegaleService();
export default sireneUniteLegaleService;
