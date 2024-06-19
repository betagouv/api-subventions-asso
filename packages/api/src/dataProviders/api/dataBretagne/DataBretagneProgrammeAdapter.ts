import StateBudgetProgramEntity from "../../../entities/StateBudgetProgramEntity";
import { DataBretagneProgrammeDto } from "./DataBretagneDto";

/**
 * Adapter class for converting DataBretagneProgrammeDto to StateBudgetProgramEntity.
 */
export default class DataBretagneProgrammeAdapter {
    /**
     * Converts a DataBretagneProgrammeDto to a StateBudgetProgramEntity.
     *
     * @param dto - The DataBretagneProgrammeDto to convert.
     * @returns The converted StateBudgetProgramEntity.
     */
    static toEntity(dto: DataBretagneProgrammeDto): StateBudgetProgramEntity {
        return new StateBudgetProgramEntity(dto.label_theme, dto.label, dto.code_ministere, parseInt(dto.code, 10));
    }
}
