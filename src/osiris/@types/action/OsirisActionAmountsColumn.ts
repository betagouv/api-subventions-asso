export default interface OsirisActionAmountsColumn {
    readonly coast: number;
    readonly requested: number;
    readonly suggested: number;
    readonly granted: number;
    readonly totalAmountAllocated: number;
    readonly paymentMade: number;
    readonly reversal: number;
    readonly grantedPercentage: number;
    readonly paymentMadePercentage: number;
}

export const OsirisActionAmountsColumnKeys = {
    coast: 63,
    requested: 64,
    suggested: 65,
    granted: 66,
    totalAmountAllocated: 67,
    paymentMade: 68,
    reversal: 69,
    grantedPercentage: 70,
    paymentMadePercentage: 71,
}