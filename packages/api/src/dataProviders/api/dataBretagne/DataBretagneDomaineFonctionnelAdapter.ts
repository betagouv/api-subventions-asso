import DomaineFonctionnelEntity from "../../../entities/DomaineFonctionnelEntity";
import { DataBretagneDomaineFonctionnelDto } from "./DataBretagneDto";

/**
 * Adapter class for converting DataBretagneDomaineFonctionnelDto to DomaineFonctionnelEntity.
 */
export default class DataBretagneDomaineFonctionnelAdapter {
    /**
     * Converts a DataBretagneDomaineFonctionnelDto to a DomaineFonctionnelEntity.
     *
     * @param dto - The DataBretagneDomaineFonctionnelDto to convert.
     * @returns The converted DomaineFonctionnelEntity.
     */
    static toEntity(dto: DataBretagneDomaineFonctionnelDto): DomaineFonctionnelEntity {
        return new DomaineFonctionnelEntity(dto.label, dto.code, parseInt(dto.code_programme, 10));
    }
}
