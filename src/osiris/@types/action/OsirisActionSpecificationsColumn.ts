export default interface OsirisActionSpecificationsColumn {
    readonly rank: number;
    readonly title: string;
    readonly objectives: string;
    readonly description: string;
    readonly mainFieldAction?: string;
    readonly educationLevel?: string;
    readonly type: string;
    readonly assistanceModality: string;
    readonly operationalObjectives: string;
    readonly modalitySystem: string;
    readonly personInCharge?: string;
}

export const OsirisActionSpecificationsColumnKeys = {
    rank: 26,
    title: 27,
    objectives: 28,
    description: 29,
    mainFieldAction: 30,
    educationLevel: 31,
    type: 32,
    assistanceModality: 33,
    operationalObjectives: 34,
    modalitySystem: 35,
    personInCharge: 36,
}