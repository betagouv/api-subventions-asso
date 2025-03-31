import DomaineFonctionnelEntity from "../../../../entities/DomaineFonctionnelEntity";
import MinistryEntity from "../../../../entities/MinistryEntity";
import StateBudgetProgramEntity from "../../../../entities/StateBudgetProgramEntity";
import RefProgrammationEntity from "../../../../entities/RefProgrammationEntity";

export type ProgramsRecord = Record<number, StateBudgetProgramEntity>;
export type MinistriesRecord = Record<string, MinistryEntity>;
export type FonctionalDomainsRecord = Record<string, DomaineFonctionnelEntity>;
export type ProgramsRefRecord = Record<string, RefProgrammationEntity>;
export type DataBretagneRecords = {
    programs: ProgramsRecord;
    ministries: MinistriesRecord;
    fonctionalDomains: FonctionalDomainsRecord;
    programsRef: ProgramsRefRecord;
};
