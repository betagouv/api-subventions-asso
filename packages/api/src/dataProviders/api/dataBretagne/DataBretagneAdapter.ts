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

export class DataBretagneDomaineFonctionnelAdapter {
    static toEntity(dto: DataBretagneDomaineFonctionnelDto): DomaineFonctionnelEntity {
        return new DomaineFonctionnelEntity(
            dto.label,
            dto.code,
            dto.code_programme ? parseInt(dto.code_programme, 10) : null,
        );
    }
}

export class DataBretagneMinistryAdapter {
    static toEntity(dto: DataBretagneMinistryDto): MinistryEntity {
        return new MinistryEntity(dto.sigle_ministere ?? null, dto.code, dto.label);
    }
}

export class DataBretagneProgrammeAdapter {
    static toEntity(dto: DataBretagneProgrammeDto): StateBudgetProgramEntity {
        return new StateBudgetProgramEntity(dto.label_theme, dto.label, dto.code_ministere, parseInt(dto.code, 10));
    }
}

export class DataBretagneRefProgrammationAdapter {
    static toEntity(dto: DataBretagneRefProgrammationDto): RefProgrammationEntity {
        return new RefProgrammationEntity(
            dto.label,
            dto.code,
            dto.code_programme ? parseInt(dto.code_programme, 10) : null,
        );
    }
}
