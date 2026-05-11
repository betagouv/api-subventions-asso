import { Association } from "dto";
import ApiAssoPort from "../../../../adapters/outputs/api/api-asso/api-asso.port";
import { Rna } from "../../../../identifier-objects";
import { hasEmptyProperties } from "../../../../shared/helpers/ObjectHelper";
import TransformRnaStructureToAssoUseCase from "./transform-rna-structure-to-asso.use-case";
import AsyncUseCase from "../../../../@types/use-case/AsyncUseCase";

// Retrieve association structure information from the RNA repository
// @TODO: not used yet
export default class GetRnaAssoUseCase implements AsyncUseCase<Rna, Association | null> {
    constructor(
        private apiAssoPort: ApiAssoPort,
        private toAsso: TransformRnaStructureToAssoUseCase,
    ) {}

    execute(input: Rna) {
        return this.apiAssoPort.getRnaStructure(input).then(structure => {
            if (!structure) return structure;
            if (hasEmptyProperties(structure.identite) || !structure.identite.date_modif_rna) return null; // sometimes an empty shell object if given by the API
            return this.toAsso.execute(structure);
        });
    }
}
