export default interface OsirisFileColumn {
    readonly service: string;
    readonly financingType: string;
    readonly subFinancingType: string;
    readonly osirisId: string;
    readonly lcaId: string;
    readonly ejId?: string;
    readonly state: string;
    readonly pluriannuality: string;
    readonly fiscalYearStart: number;
    readonly fiscalYearEnd: number;
    readonly renewal: string;
    readonly commissionDate: string;
}

export const OsirisFileColumnKeys = {
    service: 1,
    financingType: 2,
    subFinancingType: 3,
    osirisId: 4,
    lcaId: 5,
    ejId: 6,
    state: 7,
    pluriannuality: 8,
    fiscalYearStart: 9,
    fiscalYearEnd: 10,
    renewal: 11,
    commissionDate: 12,
}