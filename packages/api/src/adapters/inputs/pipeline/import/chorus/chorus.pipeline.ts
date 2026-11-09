import chorusService, { ChorusService } from "../../../../../modules/providers/chorus/chorus.service";
import saveChorusEntities, {
    SaveChorusEntities,
} from "../../../../../modules/providers/chorus/use-cases/save-entities";
import saveChorusFseEntities, {
    SaveChorusFseEntities,
} from "../../../../../modules/providers/chorus/use-cases/save-fse-entities";
import updateFlatByExercise, {
    UpdateFlatByExercise,
} from "../../../../../modules/providers/chorus/use-cases/update-flat-by-exercise";
import { ImportReport } from "../../../../../@types/ImportReport";
import { ChorusDto, ChorusFseDto } from "./chorus.dto";
import { ChorusMapper } from "./chorus.mapper";
import { ChorusParser } from "./chorus.parser";
import { ChorusValidator } from "./chorus.validator";
import ChorusDbo from "../../../../outputs/db/providers/chorus/chorus.dbo";
import { BRANCHE_ACCEPTED } from "../../../../../shared/ChorusBrancheAccepted";
import { EstablishmentIdentifier, Siret } from "../../../../../identifier-objects";
import checkIdentifierIsFromAsso, {
    CheckIdentifierIsFromAssoUseCase,
} from "../../../../../modules/associations/use-cases/check-identifier-is-from-asso.use-case";
import { asyncFilter } from "../../../../../shared/helpers/ArrayHelper";
import ChorusFseDbo from "../../../../outputs/db/providers/chorus/chorus-fse.dbo";

export interface ChorusPipelineOptions {
    withoutEuropeanData?: boolean;
}

export class ChorusPipeline {
    constructor(
        private saveEntities: SaveChorusEntities,
        private saveFseEntities: SaveChorusFseEntities,
        private checkIsAsso: CheckIdentifierIsFromAssoUseCase,
        private chorusService: ChorusService, // @TODO: make this a use case
        private updateFlatByExercise: UpdateFlatByExercise, // @TODO: make this a use case
    ) {}

    // saves national chorus data
    private async save(dtos: ChorusDto[]): Promise<ImportReport> {
        let validationErrorCount = 0;
        const dbos = dtos
            ?.filter(dto => {
                try {
                    return ChorusValidator.validate(dto);
                } catch (e) {
                    if (e instanceof Error) console.log(e.message);
                    validationErrorCount++;
                    return false;
                }
            })
            ?.map(dto => ChorusMapper.toDbo(dto));
        if (dbos) {
            const assos = await this.filterAssos(dbos);
            await this.saveEntities.execute(assos);
            const exercicesSet = assos.reduce((set, entity) => set.add(entity.exercice), new Set<number>());
            for (const exercise of exercicesSet) {
                await this.updateFlatByExercise.execute(exercise);
            }

            return {
                parsedCount: dtos.length,
                importedCount: assos.length,
                errorCount: validationErrorCount + dbos.length - assos.length,
            };
        }

        return {
            parsedCount: dtos.length,
            importedCount: 0,
            errorCount: dtos.length,
        };
    }

    private filterAssos(dbos: ChorusDbo[]) {
        return asyncFilter(dbos, async dbo => {
            if (!BRANCHE_ACCEPTED[dbo.codeBranche]) return false;
            try {
                if (dbo.siret === "#" && dbo.ridetOrTahitiet === "#") return false;
                if (dbo.siret === "#") {
                    const identifier = EstablishmentIdentifier.buildIdentifierFromString(dbo.ridetOrTahitiet);
                    if (!identifier) return false;
                    return this.checkIsAsso.execute(identifier);
                } else {
                    console.log(dbo);
                    return this.checkIsAsso.execute(new Siret(dbo.siret));
                }
            } catch (e) {
                // filter entities with wrong identifiers format
                // @TODO: make entity validates identifiers
                console.log(e);
                return Promise.resolve(false);
            }
        });
    }

    private filterFseAssos(dbos: ChorusFseDbo[]) {
        return asyncFilter(dbos, async dbo => {
            if (!BRANCHE_ACCEPTED[dbo.branchCode]) return false;
            return this.checkIsAsso.execute(dbo.identifier);
        });
    }

    // saves european chorus data
    private async saveFse(dtos: ChorusFseDto[]) {
        const fseDbos = dtos
            ?.filter(dto => {
                try {
                    return ChorusValidator.validateFse(dto);
                } catch (e) {
                    if (e instanceof Error) console.log(e.message);
                    return false;
                }
            })
            ?.map(dto => ChorusMapper.toFseEntity(dto));
        if (fseDbos) {
            const assoFseEntities = await this.filterFseAssos(fseDbos);
            await this.saveFseEntities.execute(assoFseEntities);
            // @TODO: make this a use case
            return this.chorusService.syncFlat(assoFseEntities);
        }
    }

    async run(buffer: Buffer, options: ChorusPipelineOptions = {}): Promise<ImportReport> {
        const { national: nationalDtos, european: europeanDtos } = ChorusParser.fromBuffer(buffer);
        const [report] = await Promise.all([
            this.save(nationalDtos ?? []),
            options.withoutEuropeanData ? Promise.resolve() : this.saveFse(europeanDtos ?? []),
        ]);

        return report;
    }
}

const chorusPipeline = new ChorusPipeline(
    saveChorusEntities,
    saveChorusFseEntities,
    checkIdentifierIsFromAsso,
    chorusService,
    updateFlatByExercise,
);
export default chorusPipeline;
