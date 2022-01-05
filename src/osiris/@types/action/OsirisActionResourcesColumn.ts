export default interface OsirisActionResourcesColumn {
    readonly resources: string;
    readonly volunteers: number;
    readonly volunteersETPT: number;
    readonly employees: number;
    readonly employeesETPT: number;
    readonly cdi: number;
    readonly cdiETPT: number;
    readonly cdd: number;
    readonly cddETPT: number;
    readonly assistedJobs : number;
    readonly assistedJobsETPT: number;
    readonly volunteers2: number; // TODO: Ne m'oublie pas
    readonly volunteers2ETPT: number;
    readonly specificRecruitment: number;
}

export const OsirisActionResourcesColumnKeys = {
    resources: 48,
    volunteers: 49,
    volunteersETPT: 50,
    employees: 51,
    employeesETPT: 52,
    cdi: 53,
    cdiETPT: 54,
    cdd: 55,
    cddETPT: 56,
    assistedJobs: 57,
    assistedJobsETPT: 58,
    volunteers2: 59,
    volunteers2ETPT: 60,
    specificRecruitment: 61,
}