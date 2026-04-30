import OsirisActionEntity from "./OsirisActionEntity";

export type OsirisRequestValue = string | number | boolean | Date | null | undefined;
export type OsirisRequestCategory = Record<string, OsirisRequestValue>;

export default interface OsirisRequestEntity {
    dossier: OsirisRequestCategory;
    association?: OsirisRequestCategory;
    beneficiaire?: OsirisRequestCategory;
    montants?: OsirisRequestCategory;
    versements?: OsirisRequestCategory;
    representantLegal?: OsirisRequestCategory;
    coordonnees?: OsirisRequestCategory;
    nbActions?: OsirisRequestCategory;
    updateDate: Date;
    actions?: OsirisActionEntity[];
    [category: string]: OsirisRequestCategory | Date | OsirisActionEntity[] | undefined;
}
