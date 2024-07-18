export interface DataBretagneProgrammeDto {
    label_theme: string;
    label: string;
    code_ministere: string;
    description?: string | null;
    code: string;
}

export interface DataBretagneMinistryDto {
    code: string;
    sigle_ministere: string | null;
    label: string;
    description?: string | null;
}

export interface DataBretagneDomaineFonctionnelDto {
    code: string;
    code_programme: string | null;
    label: string;
    description?: string | null;
}

export interface DataBretagneRefProgrammationDto {
    code: string;
    code_programme: string | null;
    label: string;
    description?: string | null;
}
