import MinistryEntity from "../../../entities/MinistryEntity";
import { DataBretagneMinistryDto } from "./DataBretagneDto";

/**
 * Adapter class for converting DataBretagneMinistryDto to MinistryEntity.
 */

export default class DataBretagneMinistryAdapter {
    /**
     * Converts a DataBretagneMinistryDto object to a MinistryEntity object.
     *
     * @param dto - The DataBretagneMinistryDto object to be converted.
     * @returns The converted MinistryEntity object.
     */

    static toEntity(dto: DataBretagneMinistryDto): MinistryEntity {
        return new MinistryEntity(dto.sigle_ministere, dto.code, dto.label);
    }
}
