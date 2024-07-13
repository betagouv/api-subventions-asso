/**
 * Represents a DomaineFonctionnelEntity.
 */
export default class DomaineFonctionnelEntity {
    /**
     * Creates an instance of DomaineFonctionnelEntity.
     * @param {string} libelle_action - The label of the action.
     * @param {string} code_action - The code of the action.
     * @param {number} code_programme - The code of the program.
     */
    constructor(public libelle_action: string, public code_action: string, public code_programme: number) {}
}
