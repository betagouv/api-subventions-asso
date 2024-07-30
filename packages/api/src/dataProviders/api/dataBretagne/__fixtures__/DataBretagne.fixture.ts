import {
    DataBretagneDomaineFonctionnelDto,
    DataBretagneMinistryDto,
    DataBretagneProgrammeDto,
    DataBretagneRefProgrammationDto,
} from "../DataBretagneDto";

export const PROGRAMS: DataBretagneProgrammeDto[] = [
    {
        label_theme: "",
        label: "",
        code_ministere: "",
        description: "",
        code: "163",
    },
];

export const DTOS = {
    domaineFonct: {
        code: "code",
        code_programme: "163",
        label: "Label",
    } as DataBretagneDomaineFonctionnelDto,

    ministry: {
        code: "code",
        label: "label",
        sigle_ministere: "sigle_ministere",
    } as DataBretagneMinistryDto,

    programme: {
        code: "163",
        code_ministere: "code_ministere",
        label: "label",
        label_theme: "label_theme",
    } as DataBretagneProgrammeDto,

    refProgrammation: {
        code: "code",
        code_programme: "163",
        label: "label",
    } as DataBretagneRefProgrammationDto,
};

export const DTOS_WITH_NULLS = {
    domaineFonct: {
        code: "code",
        code_programme: null,
        label: "Label",
    } as DataBretagneDomaineFonctionnelDto,

    ministry: {
        code: "code",
        label: "label",
        sigle_ministere: null,
    } as DataBretagneMinistryDto,

    programme: {
        code: "163",
        code_ministere: "code_ministere",
        label: "label",
        label_theme: "label_theme",
    } as DataBretagneProgrammeDto,

    refProgrammation: {
        code: "code",
        code_programme: "163",
        label: "label",
    } as DataBretagneRefProgrammationDto,
};
