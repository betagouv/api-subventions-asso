import chorusService, { ChorusService } from "../../../../../modules/providers/chorus/chorus.service";
import saveChorusDbos, { SaveChorusDbos } from "../../../../../modules/providers/chorus/use-cases/save-dbos";
import saveChorusFseDbos, { SaveChorusFseDbos } from "../../../../../modules/providers/chorus/use-cases/save-fse-dbos";
import updateFlatByExercise, {
    UpdateFlatByExercise,
} from "../../../../../modules/providers/chorus/use-cases/update-flat-by-exercise";
import { ImportReport } from "../../../../../@types/ImportReport";
import { ChorusDto, ChorusFseDto } from "./chorus.dto";
import { ChorusMapper } from "./chorus.mapper";
import { ChorusParser } from "./chorus.parser";
import { ChorusValidator } from "./chorus.validator";
import ChorusDbo, { ChorusFseDbo } from "../../../../outputs/db/providers/chorus/chorus.dbo";
import { BRANCHE_ACCEPTED } from "../../../../../shared/ChorusBrancheAccepted";
import { Ridet, Siret, Tahitiet } from "../../../../../identifier-objects";
import checkIdentifierIsFromAsso, {
    CheckIdentifierIsFromAssoUseCase,
} from "../../../../../modules/associations/use-cases/check-identifier-is-from-asso.use-case";
import { asyncFilter } from "../../../../../shared/helpers/ArrayHelper";
import { toEntity } from "../../../../outputs/db/providers/chorus/chorus-fse.mapper";

export interface ChorusPipelineOptions {
    withoutEuropeanData?: boolean;
}

export class ChorusPipeline {
    constructor(
        private saveDbos: SaveChorusDbos,
        private saveFseDbos: SaveChorusFseDbos,
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
            const assos = (await this.filterAssos(dbos)) as ChorusDbo[];
            await this.saveDbos.execute(assos);
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

    // saves european chorus data
    private async saveFse(dtos: ChorusFseDto[]) {
        const dbos = dtos
            ?.filter(dto => {
                try {
                    return ChorusValidator.validateFse(dto);
                } catch (e) {
                    if (e instanceof Error) console.log(e.message);
                    return false;
                }
            })
            ?.map(dto => ChorusMapper.toFseDbo(dto));
        if (dbos) {
            const assos = (await this.filterAssos(dbos)) as ChorusFseDbo[];
            await this.saveFseDbos.execute(assos);
            // @TODO: make this a use case
            return this.chorusService.syncFlat(assos.map(asso => toEntity(asso)));
        }
    }

    private filterAssos(dbos: ChorusDbo[] | ChorusFseDbo[]) {
        return asyncFilter<ChorusDbo | ChorusFseDbo>(dbos, async dbo => {
            if (!BRANCHE_ACCEPTED[dbo.codeBranche]) return false;
            try {
                if (dbo.siret === "#" && dbo.ridetOrTahitiet === "#") return false;
                if (dbo.siret === "#") {
                    let identifier: Ridet | Tahitiet | undefined;
                    if (Ridet.isRidet(dbo.ridetOrTahitiet)) identifier = new Ridet(dbo.ridetOrTahitiet);
                    else if (Tahitiet.isTahitiet(dbo.ridetOrTahitiet)) identifier = new Tahitiet(dbo.ridetOrTahitiet);
                    if (!identifier) return false;
                    return this.checkIsAsso.execute(identifier);
                } else {
                    return this.checkIsAsso.execute(new Siret(dbo.siret));
                }
            } catch (e) {
                // @TODO: save format errors ?
                console.log(e);
                return Promise.resolve(false);
            }
        });
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
    saveChorusDbos,
    saveChorusFseDbos,
    checkIdentifierIsFromAsso,
    chorusService,
    updateFlatByExercise,
);
export default chorusPipeline;
