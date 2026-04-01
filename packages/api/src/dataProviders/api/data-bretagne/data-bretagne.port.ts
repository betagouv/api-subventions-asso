import StateBudgetProgramEntity from "../../../entities/StateBudgetProgramEntity";
import MinistryEntity from "../../../entities/MinistryEntity";
import DomaineFonctionnelEntity from "../../../entities/DomaineFonctionnelEntity";
import RefProgrammationEntity from "../../../entities/RefProgrammationEntity";

export interface DataBretagnePort {
    login(): Promise<void>;
    getStateBudgetPrograms(): Promise<StateBudgetProgramEntity[]>;
    getMinistry(): Promise<MinistryEntity[]>;
    getDomaineFonctionnel(): Promise<DomaineFonctionnelEntity[]>;
    getRefProgrammation(): Promise<RefProgrammationEntity[]>;
}
