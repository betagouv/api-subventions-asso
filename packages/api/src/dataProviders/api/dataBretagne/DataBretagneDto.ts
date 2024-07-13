export interface DataBretagneProgrammeDto {
    label_theme: string;
    label: string;
    code_ministere: string;
    description?: string | null;
    code: string;
}

export interface DataBretagneMinistryDto {
    code: string;
    sigle_ministere: string;
    label: string;
    description?: string | null;
}

export interface DataBretagneDomaineFonctionnelDto {
    code: string;
    code_programme: string;
    label: string;
    description?: string | null;
}

export interface DataBretagnenRefProgrammationDto {
    code: string;
    code_programme: string;
    label: string;
    description?: string | null;
}
