import chorusService, { ChorusService } from "../../../../../modules/providers/chorus/chorus.service";
import filtreAssoChorusEntities, {
    FilterChorusEntities,
} from "../../../../../modules/providers/chorus/use-cases/filter-entities";
import filtreAssoChorusFseEntities, {
    FilterChorusFseEntities,
} from "../../../../../modules/providers/chorus/use-cases/filter-fse-entities";
import saveChorusEntities, {
    SaveChorusEntities,
} from "../../../../../modules/providers/chorus/use-cases/save-entities";
import saveChorusFseEntities, {
    SaveChorusFseEntities,
} from "../../../../../modules/providers/chorus/use-cases/save-fse-entities";
import updateFlatByExercise, {
    UpdateFlatByExercise,
} from "../../../../../modules/providers/chorus/use-cases/update-flat-by-exercise";
import { ChorusDto, ChorusFseDto } from "./chorus.dto";
import { ChorusMapper } from "./chorus.mapper";
import { ChorusParser } from "./chorus.parser";
import { ChorusValidator } from "./chorus.validator";

export class ChorusImport {
    constructor(
        private saveEntities: SaveChorusEntities,
        private saveFseEntities: SaveChorusFseEntities,
        private filterAsso: FilterChorusEntities,
        private filterFseAsso: FilterChorusFseEntities,
        private chorusService: ChorusService, // @TODO: make this a use case
        private updateFlatByExercise: UpdateFlatByExercise, // @TODO: make this a use case
    ) {}

    // saves national chorus data
    private async save(dtos: ChorusDto[]) {
        const entities = dtos
            ?.filter(dto => {
                try {
                    return ChorusValidator.validate(dto);
                } catch (e) {
                    if (e instanceof Error) console.log(e.message);
                    return false;
                }
            })
            ?.map(dto => ChorusMapper.toEntity(dto));
        if (entities) {
            const assoEntities = await this.filterAsso.execute(entities);
            await this.saveEntities.execute(assoEntities);
            const exercicesSet = assoEntities.reduce((set, entity) => set.add(entity.exercice), new Set<number>());
            for (const exercise of exercicesSet) {
                await this.updateFlatByExercise.execute(exercise);
            }
        }
    }

    // saves european chorus data
    private async saveFse(dtos: ChorusFseDto[]) {
        const fseEntities = dtos
            ?.filter(dto => {
                try {
                    return ChorusValidator.validateFse(dto);
                } catch (e) {
                    if (e instanceof Error) console.log(e.message);
                    return false;
                }
            })
            ?.map(dto => ChorusMapper.toFseEntity(dto));
        if (fseEntities) {
            const assoFseEntities = await this.filterFseAsso.execute(fseEntities);
            await this.saveFseEntities.execute(assoFseEntities);
            // @TODO: make this a use case
            return this.chorusService.syncFlat(assoFseEntities);
        }
    }

    async run(buffer: Buffer) {
        const { national: nationalDtos, european: europeanDtos } = ChorusParser.fromBuffer(buffer);
        await Promise.all([this.save(nationalDtos ?? []), this.saveFse(europeanDtos ?? [])]);
    }
}

const chorusImport = new ChorusImport(
    saveChorusEntities,
    saveChorusFseEntities,
    filtreAssoChorusEntities,
    filtreAssoChorusFseEntities,
    chorusService,
    updateFlatByExercise,
);
export default chorusImport;
