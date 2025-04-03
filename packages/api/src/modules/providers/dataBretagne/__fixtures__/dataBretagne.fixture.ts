import DomaineFonctionnelEntity from "../../../../entities/DomaineFonctionnelEntity";
import MinistryEntity from "../../../../entities/MinistryEntity";
import RefProgrammationEntity from "../../../../entities/RefProgrammationEntity";
import StateBudgetProgramEntity from "../../../../entities/StateBudgetProgramEntity";

export const PROGRAM_ENTITIES = [
    new StateBudgetProgramEntity("Mission Exemple", "Programme Exemple", "code", 163),
    new StateBudgetProgramEntity("Mission Exemple", "Programme Exemple", "code", 101),
];

export const MINISTRY_ENTITIES = [new MinistryEntity("ME", "code", "Ministère Exemple")];

export const DOMAINE_FONCTIONNEL_ENTITIES: DomaineFonctionnelEntity[] = [
    new DomaineFonctionnelEntity("Label d'action Exemple", "0163AC123", 163),
    new DomaineFonctionnelEntity("Label d'action Exemple", "0101-01-02", 101),
];

export const REF_PROGRAMMATION_ENTITIES: RefProgrammationEntity[] = [
    new RefProgrammationEntity("Label d'activité Exemple", "AC4560000000", 163),
    new RefProgrammationEntity("Label d'activité Exemple", "077601003222", 101),
];

export const DATA_BRETAGNE_RECORDS: {
    domainesFonct: Record<string, DomaineFonctionnelEntity>;
    ministries: Record<string, MinistryEntity>;
    programs: Record<string, StateBudgetProgramEntity>;
    refsProgrammation: Record<string, RefProgrammationEntity>;
} = {
    domainesFonct: {
        [DOMAINE_FONCTIONNEL_ENTITIES[0].code_action]: DOMAINE_FONCTIONNEL_ENTITIES[0],
        [DOMAINE_FONCTIONNEL_ENTITIES[1].code_action]: DOMAINE_FONCTIONNEL_ENTITIES[1],
    },

    ministries: {
        [MINISTRY_ENTITIES[0].code_ministere]: MINISTRY_ENTITIES[0],
    },

    programs: {
        [PROGRAM_ENTITIES[0].code_programme]: PROGRAM_ENTITIES[0],
        [PROGRAM_ENTITIES[1].code_programme]: PROGRAM_ENTITIES[1],
    },

    refsProgrammation: {
        [REF_PROGRAMMATION_ENTITIES[0].code_activite]: REF_PROGRAMMATION_ENTITIES[0],
        [REF_PROGRAMMATION_ENTITIES[1].code_activite]: REF_PROGRAMMATION_ENTITIES[1],
    },
};
