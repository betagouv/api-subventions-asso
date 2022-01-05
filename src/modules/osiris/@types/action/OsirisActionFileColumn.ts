export default interface OsirisActionFileColumn {
    readonly osirisId: string;
    readonly service: string;
    readonly financingType: string;
    readonly subFinancingType: string;
    readonly state: string;
    readonly caId: string;
    readonly pluriannuality: string;
    readonly fiscalYearStart: number;
    readonly fiscalYearEnd: number;
    readonly renewal: string;
    readonly commissionDate: string;
    readonly employeeName?: string
    readonly ejId?: string;
}

export const OsirisActionFileColumnKeys = {
    osirisId: 0,
    service: 1,
    financingType: 2,
    subFinancingType: 3,
    state: 4,
    caId: 5,
    pluriannuality: 6,
    fiscalYearStart: 7,
    fiscalYearEnd: 8,
    renewal: 9,
    commissionDate: 10,
    employeeName: 11,
    ejId: 12,
}