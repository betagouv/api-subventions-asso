import RefProgrammationEntity from "../../../entities/RefProgrammationEntity";
import StateBudgetProgramEntity from "../../../entities/StateBudgetProgramEntity";
import DomaineFonctionnelEntity from "../../../entities/DomaineFonctionnelEntity";
import MinistryEntity from "../../../entities/MinistryEntity";
import {
    DataBretagneProgrammeDto,
    DataBretagneDomaineFonctionnelDto,
    DataBretagneMinistryDto,
    DataBretagneRefProgrammationDto,
} from "./DataBretagneDto";

/**
 * Adapter class for converting DataBretagneDomaineFonctionnelDto to DomaineFonctionnelEntity.
 */
export class DataBretagneDomaineFonctionnelAdapter {
    /**
     * Converts a DataBretagneDomaineFonctionnelDto to a DomaineFonctionnelEntity.
     *
     * @param dto - The DataBretagneDomaineFonctionnelDto to convert.
     * @returns The converted DomaineFonctionnelEntity.
     */
    static toEntity(dto: DataBretagneDomaineFonctionnelDto): DomaineFonctionnelEntity {
        return new DomaineFonctionnelEntity(dto.label, dto.code, parseInt(dto.code_programme ?? "0", 10));
    }
}

/**
 * Adapter class for converting DataBretagneMinistryDto to MinistryEntity.
 */

export class DataBretagneMinistryAdapter {
    /**
     * Converts a DataBretagneMinistryDto object to a MinistryEntity object.
     *
     * @param dto - The DataBretagneMinistryDto object to be converted.
     * @returns The converted MinistryEntity object.
     */

    static toEntity(dto: DataBretagneMinistryDto): MinistryEntity {
        return new MinistryEntity(dto.sigle_ministere ?? "", dto.code, dto.label);
    }
}

/**
 * Adapter class for converting DataBretagneProgrammeDto to StateBudgetProgramEntity.
 */
export class DataBretagneProgrammeAdapter {
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

/**
 * Adapter class for converting DataBretagneRefProgrammationDto to RefProgrammationEntity.
 */

export class DataBretagneRefProgrammationAdapter {
    /**
     * Converts a DataBretagneRefProgrammationDto to a RefProgrammationEntity.
     *
     * @param dto - The DataBretagneRefProgrammationDto to convert.
     * @returns The converted RefProgrammationEntity.
     */
    static toEntity(dto: DataBretagneRefProgrammationDto): RefProgrammationEntity {
        return new RefProgrammationEntity(dto.label, dto.code, parseInt(dto.code_programme ?? "0", 10));
    }
}
