export default interface OsirisPaymentsColumn {
    readonly "compensation(N-1)": number;
    readonly advance: number;
    readonly accountBalance: number;
    readonly complementary?: string;
    readonly paymentMade: number;
    readonly reversal: number;
    readonly grantedPercentage: number;
    readonly paymentMadePercentage: number;
}

export const OsirisPaymentsColumnKeys = {
    "compensation(N-1)": 45,
    advance: 46,
    accountBalance: 47,
    complementary: 48,
    paymentMade: 49,
    reversal: 50,
    grantedPercentage: 51,
    paymentMadePercentage: 52,
}