export default interface OsirisAmountsColumn {
    readonly coast: number;
    readonly requested: number;
    readonly suggested: number;
    readonly granted: number;
    readonly totalAmountAllocated: number;
}

export const OsirisAmountsColumnKeys = {
    coast: 40,
    requested: 41,
    suggested: 42,
    granted: 43,
    totalAmountAllocated: 44,
}