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
import { ImportReport } from "../../../../../@types/ImportReport";
import { ChorusDto, ChorusFseDto } from "./chorus.dto";
import { ChorusMapper } from "./chorus.mapper";
import { ChorusParser } from "./chorus.parser";
import { ChorusValidator } from "./chorus.validator";
import ChorusFseEntity from "../../../../../modules/providers/chorus/entities/ChorusFseEntity";
import ChorusEntity from "../../../../../modules/providers/chorus/entities/ChorusEntity";
import { Siret } from "../../../../../identifier-objects";
import { AssociationSearchPort } from "../../../../outputs/db/association-search/association-search.port";
import associationSearchAdapter from "../../../../outputs/db/association-search/association-search.adapter";

export interface ChorusImportOptions {
    withoutEuropeanData?: boolean;
}

export class ChorusImport {
    constructor(
        private saveEntities: SaveChorusEntities,
        private saveFseEntities: SaveChorusFseEntities,
        private filterAsso: FilterChorusEntities,
        private filterFseAsso: FilterChorusFseEntities,
        private chorusService: ChorusService, // @TODO: make this a use case
        private associationPort: AssociationSearchPort,
        private updateFlatByExercise: UpdateFlatByExercise, // @TODO: make this a use case
    ) {}

    // saves national chorus data
    private async save(dtos: ChorusDto[]): Promise<ImportReport> {
        let validationErrorCount = 0;
        const entities = dtos
            ?.filter(dto => {
                try {
                    return ChorusValidator.validate(dto);
                } catch (e) {
                    if (e instanceof Error) console.log(e.message);
                    validationErrorCount++;
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

            return {
                parsedCount: dtos.length,
                importedCount: assoEntities.length,
                errorCount: validationErrorCount + entities.length - assoEntities.length,
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
            // await this.associationPort.upsertFromChorus(
            //     ChorusMapper.toAssociationSearches(assoFseEntities);
            // );
            await this.saveFseEntities.execute(assoFseEntities);
            // @TODO: make this a use case
            return this.chorusService.syncFlat(assoFseEntities);
        }
    }

    // mergeAsso(map: Map<string, ChorusAssociationSearch>, assoToMerge: ChorusAssociationSearch) {
    //     const asso = map.get(assoToMerge.siren);
    //     if (asso)
    //         if (asso.payments)
    //             map.set(asso.siren, {
    //                 total: asso[asso].total + entity.amount,
    //                 min: payment.min > entity.amount ? entity.amount : payment.min,
    //                 max: payment.max < entity.amount ? entity.amount : payment.max,
    //                 nb: payment.nb + 1,
    //             });
    //         else assosList.set(asso.siren, asso);
    //     return assosList;
    // }

    private getSiren(entity: ChorusEntity | (ChorusFseEntity & { identifier: Siret })) {
        if ((entity as ChorusFseEntity)?.identifier)
            return (entity as ChorusFseEntity & { identifier: Siret }).identifier.toSiren();
        else return new Siret((entity as ChorusEntity).siret).toSiren();
    }

    async run(buffer: Buffer, options: ChorusImportOptions = {}): Promise<ImportReport> {
        const { national: nationalDtos, european: europeanDtos } = ChorusParser.fromBuffer(buffer);
        const [report] = await Promise.all([
            this.save(nationalDtos ?? []),
            options.withoutEuropeanData ? Promise.resolve() : this.saveFse(europeanDtos ?? []),
        ]);

        return report;
    }
}

const chorusImport = new ChorusImport(
    saveChorusEntities,
    saveChorusFseEntities,
    filtreAssoChorusEntities,
    filtreAssoChorusFseEntities,
    chorusService,
    associationSearchAdapter,
    updateFlatByExercise,
);
export default chorusImport;
