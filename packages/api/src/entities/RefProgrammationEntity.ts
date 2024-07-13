export default class RefProgrammationEntity {
    /**
     * Creates an instance of RefProgrammationEntity.
     * @param {string} code - The code of the program.
     * @param {string} code_programme - The code of the program.
     * @param {string} label - The label of the program.
     * @param {string} description - The description of the program.
     */
    constructor(public libelle_activite: string, public code_activite: string, public code_programme: number) {}
}
