import RefProgrammationEntity from "../../../entities/RefProgrammationEntity";
import { DataBretagnenRefProgrammationDto } from "./DataBretagneDto";

/**
 * Adapter class for converting DataBretagneRefProgrammationDto to RefProgrammationEntity.
 */

export default class DataBretagneRefProgrammationAdapter {
    /**
     * Converts a DataBretagneRefProgrammationDto to a RefProgrammationEntity.
     *
     * @param dto - The DataBretagneRefProgrammationDto to convert.
     * @returns The converted RefProgrammationEntity.
     */
    static toEntity(dto: DataBretagnenRefProgrammationDto): RefProgrammationEntity {
        return new RefProgrammationEntity(dto.label, dto.code, parseInt(dto.code_programme, 10));
    }
}
