import {
    DataBretagneDomaineFonctionnelDto,
    DataBretagneMinistryDto,
    DataBretagneProgrammeDto,
    DataBretagneRefProgrammationDto,
} from "../../../dataProviders/api/dataBretagne/DataBretagneDto";
import DomaineFonctionnelEntity from "../../../entities/DomaineFonctionnelEntity";
import MinistryEntity from "../../../entities/MinistryEntity";
import RefProgrammationEntity from "../../../entities/RefProgrammationEntity";
import StateBudgetProgramEntity from "../../../entities/StateBudgetProgramEntity";

export const RECORDS: {
    domaineFonct: Record<string, DomaineFonctionnelEntity>;
    ministry: Record<string, MinistryEntity>;
    programme: Record<string, StateBudgetProgramEntity>;
    refProgrammation: Record<string, RefProgrammationEntity>;
} = {
    domaineFonct: {
        "0163AC123": new DomaineFonctionnelEntity("Label d'action Exemple", "0163AC123", 163),
        "0101-01-02": new DomaineFonctionnelEntity("Label d'action Exemple", "0101-01-02", 101),
    },

    ministry: {
        code: new MinistryEntity("ME", "code", "Ministère Exemple"),
    },

    programme: {
        "163": new StateBudgetProgramEntity("Mission Exemple", "Programme Exemple", "code", 163),
        "101": new StateBudgetProgramEntity("Mission Exemple", "Programme Exemple", "code", 101),
    },

    refProgrammation: {
        AC4560000000: new RefProgrammationEntity("Label d'activité Exemple", "AC4560000000", 163),
        "077601003222": new RefProgrammationEntity("Label d'activité Exemple", "077601003222", 101),
    },
};
